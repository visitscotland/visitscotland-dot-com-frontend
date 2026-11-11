import { spawnSync } from 'node:child_process';
import {
    access, mkdir, readFile, readdir, writeFile,
} from 'node:fs/promises';
import { delimiter, join } from 'node:path';
import {
    homedir, platform, release, arch,
} from 'node:os';
import { chromium } from '@playwright/test';

// Read-only diagnostics: no package installation, browser session or environment
// dump. Probe failures are evidence, not a reason to skip the real smoke tests.
const exists = async(path) => access(path).then(() => true, () => false);
const read = async(path) => readFile(path, 'utf8').catch(() => null);
const command = (executable, args) => {
    const result = spawnSync(executable, args, {
        encoding: 'utf8',
        timeout: 10_000,
        maxBuffer: 64 * 1024,
        windowsHide: true,
    });

    return {
        command: [executable, ...args],
        exitCode: result.status,
        stdout: result.stdout?.trim() || '',
        stderr: result.stderr?.trim() || '',
        error: result.error?.message || null,
    };
};

async function findOnPath(name) {
    for (const directory of (process.env.PATH || '').split(delimiter)) {
        const candidate = join(directory, process.platform === 'win32' ? `${name}.exe` : name);

        if (await exists(candidate)) {
            return candidate;
        }
    }

    return null;
}

async function findBundledBrowsers(directory, depth = 0) {
    if (depth > 3) {
        return [];
    }

    const entries = await readdir(directory, {
        withFileTypes: true,
    }).catch(() => []);
    const paths = [];

    for (const entry of entries) {
        const path = join(directory, entry.name);

        if (entry.isFile() && /^(?:chrome|chrome-headless-shell)(?:\.exe)?$/.test(entry.name)) {
            paths.push(path);
        }

        if (entry.isDirectory() && (depth > 0 || entry.name.startsWith('chromium'))) {
            paths.push(...await findBundledBrowsers(path, depth + 1));
        }
    }

    return paths;
}

const pinnedNode = (await read('.nvmrc'))?.trim();
const nuxt = JSON.parse(await readFile('node_modules/nuxt/package.json', 'utf8'));
const expectedBrowser = chromium.executablePath();
const cache = process.env.PLAYWRIGHT_BROWSERS_PATH && process.env.PLAYWRIGHT_BROWSERS_PATH !== '0'
    ? process.env.PLAYWRIGHT_BROWSERS_PATH
    : process.platform === 'win32'
        ? join(process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local'), 'ms-playwright')
        : process.platform === 'darwin'
            ? join(homedir(), 'Library', 'Caches', 'ms-playwright')
            : join(process.env.XDG_CACHE_HOME || join(homedir(), '.cache'), 'ms-playwright');
const systemBrowsers = [];

for (const name of ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable', 'firefox']) {
    const path = await findOnPath(name);

    if (path) {
        systemBrowsers.push(path);
    }
}

for (const path of ['/opt/google/chrome/chrome', '/usr/lib/chromium/chromium']) {
    if (process.platform === 'linux' && await exists(path)) {
        systemBrowsers.push(path);
    }
}

const bundledBrowsers = await findBundledBrowsers(cache);

if (await exists(expectedBrowser)) {
    bundledBrowsers.push(expectedBrowser);
}

const browsers = [];

for (const path of new Set([...systemBrowsers, ...bundledBrowsers])) {
    const libraries = process.platform === 'linux' ? command('ldd', [path]) : null;

    browsers.push({
        path,
        source: systemBrowsers.includes(path) ? 'system' : 'playwright',
        // Chrome on Windows can open a desktop window for --version. Only
        // probe versions on Linux, which is the Jenkins target.
        version: process.platform === 'linux' ? command(path, ['--version']) : null,
        libraries,
        missingLibraries: libraries ? `${libraries.stdout}\n${libraries.stderr}`.split('\n').filter((line) => /not found/.test(line)) : [],
    });
}

const report = {
    collectedAt: new Date().toISOString(),
    runtime: {
        node: process.version,
        pinnedNode,
        matchesPin: process.version === `v${pinnedNode}`,
        executable: process.execPath,
        nuxtVersion: nuxt.version,
        nuxtSupportedNodeRange: nuxt.engines?.node || null,
        platform: platform(),
        architecture: arch(),
        kernel: release(),
        uid: process.getuid?.() ?? null,
        osRelease: process.platform === 'linux' ? await read('/etc/os-release') : null,
        libc: process.platform === 'linux' ? command('ldd', ['--version']) : null,
    },
    playwright: {
        version: JSON.parse(await readFile('node_modules/@playwright/test/package.json', 'utf8')).version,
        expectedBrowser,
        expectedBrowserExists: await exists(expectedBrowser),
        browserCache: cache,
    },
    linuxResources: process.platform === 'linux' ? {
        sharedMemory: command('df', ['-h', '/dev/shm']),
        processLimits: await read('/proc/self/limits'),
        seccomp: (await read('/proc/self/status'))?.split('\n').filter((line) => /^(?:NoNewPrivs|Seccomp):/.test(line)) || [],
    } : null,
    browsers,
};

await mkdir('smoke-results', {
    recursive: true,
});
await writeFile('smoke-results/environment.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

if (!report.runtime.matchesPin) {
    console.warn(`Node differs from .nvmrc: running ${process.version}, expected ${pinnedNode}. Diagnostics do not change the runtime.`);
}

console.log('Diagnostics saved to smoke-results/environment.json. Smoke tests must still run.');
