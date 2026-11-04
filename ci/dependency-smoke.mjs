import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { smokeEnvironment } from '../tests/dependency-smoke/environment.mjs';
import { terminateTree } from '../tests/dependency-smoke/processes.mjs';
import { prepareSmokeRuntime } from './dependency-runtime.mjs';

const allowed = new Set(['--skip-build', '--harness']);

if (process.argv.slice(2).some((argument) => !allowed.has(argument))) {
    throw new Error('Supported flags: --skip-build, --harness');
}

const results = [];
let running;
const stop = () => {
    terminateTree(running);
    process.exitCode = 1;
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
await mkdir('smoke-results', {
    recursive: true,
});

async function stage(name, args, timeoutMs) {
    const start = Date.now();
    const log = createWriteStream(`smoke-results/${name}.log`);

    console.log(`\nDependency smoke: ${name}`);

    const child = spawn(process.execPath, args, {
        env: smokeEnvironment().env,
        detached: process.platform !== 'win32',
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    running = child;
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.stdout.pipe(log, {
        end: false,
    });
    child.stderr.pipe(log, {
        end: false,
    });

    let timedOut = false;
    const timeout = setTimeout(() => {
        timedOut = true;
        terminateTree(child);
    }, timeoutMs);

    try {
        const code = await new Promise((done, reject) => {
            child.once('exit', done);
            child.once('error', reject);
        });

        results.push({
            stage: name,
            passed: code === 0 && !timedOut,
            durationMs: Date.now() - start,
            exitCode: code,
            timedOut,
        });

        if (code !== 0 || timedOut) {
            throw new Error(`${name} failed${timedOut ? ' (timed out)' : ''}; see smoke-results/${name}.log`);
        }
    } finally {
        clearTimeout(timeout);
        log.end();
        running = undefined;
    }
}

try {
    console.log(`Dependency smoke setup: ${JSON.stringify(await prepareSmokeRuntime())}`);
    if (!process.argv.includes('--skip-build')) {
        await stage('lint', ['.yarn/releases/yarn-4.14.1.cjs', 'lint'], 180_000);
        await stage('build', ['.yarn/releases/yarn-4.14.1.cjs', 'build'], 600_000);
    }

    await stage('browser', [
        'node_modules/@playwright/test/cli.js', 'test', '--config', 'tests/dependency-smoke/playwright.config.ts',
        process.argv.includes('--harness') ? 'harness.spec.ts' : 'homepage.spec.ts',
    ], 300_000);
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
} finally {
    await writeFile('smoke-results/result.json', `${JSON.stringify({
        passed: results.length > 0 && results.every((result) => result.passed) && !process.exitCode,
        buildSkipped: process.argv.includes('--skip-build'),
        harnessOnly: process.argv.includes('--harness'),
        results,
    }, null, 2)}\n`);
}
