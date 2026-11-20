import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const uploadOnly = args.some((arg) => ['--skip', '--help', '--version'].includes(arg));

function run(script, scriptArgs, env = process.env) {
    const result = spawnSync(process.execPath, [script, ...scriptArgs], {
        stdio: 'inherit',
        env,
    });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!uploadOnly) {
    console.log('Generating Playwright captures before uploading to Chromatic...');
    run(resolve(dirname(require.resolve('playwright/package.json')), 'cli.js'), ['test'], {
        ...process.env,
        CI: 'true',
        NUXT_SSR: 'false',
        CHROMATIC_CAPTURE: 'true',
    });

    const archives = resolve(
        process.env.CHROMATIC_ARCHIVE_LOCATION || 'test-results',
        'chromatic-archives',
        'archive',
    );
    const captures = readdirSync(archives).filter((file) => file.endsWith('.snapshot.json'));
    if (!captures.length) {
        throw new Error('No Playwright captures were generated. Chromatic upload cancelled.');
    }
    console.log(`Generated ${captures.length} Playwright captures.`);
}

const packagePath = require.resolve('chromatic/package.json');
const chromaticPackage = JSON.parse(readFileSync(packagePath, 'utf8'));
const bin = typeof chromaticPackage.bin === 'string'
    ? chromaticPackage.bin
    : chromaticPackage.bin.chromatic;
run(resolve(dirname(packagePath), bin), args.includes('--playwright') || uploadOnly
    ? args
    : ['--playwright', ...args]);
