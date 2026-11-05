import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';
import { smokeEnvironment } from './environment.mjs';

const { appOrigin } = smokeEnvironment();

export default defineConfig({
    testDir: '.',
    testMatch: /.*\.spec\.ts/,
    workers: 1,
    retries: 0,
    timeout: 40_000,
    expect: {
        timeout: 15_000,
    },
    outputDir: '../../smoke-results/browser',
    reporter: [
        ['list'],
        ['json', {
            outputFile: resolve('smoke-results/playwright.json'),
        }],
        ['html', {
            outputFolder: resolve('smoke-results/report'),
            open: 'never',
        }],
    ],
    use: {
        browserName: 'chromium',
        viewport: {
            width: 1440,
            height: 1000,
        },
        baseURL: appOrigin,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        serviceWorkers: 'block',
    },
    webServer: {
        command: 'node tests/dependency-smoke/serve.mjs',
        cwd: process.cwd(),
        wait: {
            stdout: /SMOKE_SERVER_READY/,
        },
        reuseExistingServer: false,
        timeout: 65_000,
        stdout: 'pipe',
        stderr: 'pipe',
    },
});
