import { defineConfig, devices } from '@playwright/test';
import { apps } from './tests/pages.config';

const CI = !!process.env.CI;
const PW_PROJECT = process.env.PW_PROJECT;

const filteredApps = PW_PROJECT ? apps.filter((app) => app.name === PW_PROJECT) : apps;

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: CI,
    retries: CI ? 2 : 0,
    workers: CI ? 1 : undefined,
    reporter: CI ? [['html', { open: 'never' }], ['github']] : 'html',
    timeout: 60000,

    use: {
        baseURL: 'http://localhost:3070',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        reducedMotion: 'reduce',
    },

    snapshotPathTemplate: '{testDir}/__snapshots__/{arg}{ext}',

    expect: {
        toHaveScreenshot: {
            stylePath: './tests/visual-overrides.css',
            maxDiffPixelRatio: 0.005,
            threshold: 0.1,
        },
    },

    webServer: filteredApps.map((app) => ({
        command: `node ./node_modules/nuxt/bin/nuxt.mjs dev --port ${app.port}`,
        cwd: app.appDir,
        url: `http://localhost:${app.port}`,
        reuseExistingServer: !CI,
        timeout: 120000,
        env: CI ? { ...process.env, NUXT_SSR: 'false' } : undefined,
    })),

    projects: filteredApps.map((app) => ({
        name: app.name,
        use: {
            ...devices['Desktop Chrome'],
            baseURL: `http://localhost:${app.port}`,
        },
    })),
});
