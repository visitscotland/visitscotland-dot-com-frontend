import { test, expect } from '@playwright/test';
import { smokeEnvironment } from './environment.mjs';
import { monitorPage } from './diagnostics.ts';
import { assertHomepage } from './assert-homepage.ts';

const { appOrigin, cmsOrigin } = smokeEnvironment();

test('a hydration mismatch alone does not block a working homepage', async({ page }) => {
    const diagnostics = await monitorPage(page, appOrigin, cmsOrigin);

    await page.addInitScript(() => console.error('Hydration completed but contains mismatches.'));
    await assertHomepage(page);
    expect(diagnostics.hydrationWarnings).toContain('Hydration completed but contains mismatches.');
    expect(diagnostics.failures).toEqual([]);
});

for (const status of [500, 200]) {
    test(`rejects an HTTP ${status} error page`, async({ page }) => {
        await monitorPage(page, appOrigin, cmsOrigin);
        await page.route(`${appOrigin}/`, (route) => route.fulfill({
            status,
            contentType: 'text/html',
            body: '<h1>Something went wrong</h1>',
        }));
        await expect(assertHomepage(page)).rejects.toThrow();
    });
}

test('SSR content without client JavaScript is not a pass', async({ page }) => {
    const diagnostics = await monitorPage(page, appOrigin, cmsOrigin);

    await page.route('**/_nuxt/**', (route) => route.request().resourceType() === 'script' ? route.abort() : route.fallback());
    await expect(assertHomepage(page)).rejects.toThrow();
    expect(diagnostics.failures.some((message) => message.startsWith('Request failed:'))).toBe(true);
});

test('a skeleton covering the rendered content is not a pass', async({ page }) => {
    await monitorPage(page, appOrigin, cmsOrigin);
    await page.addInitScript(() => window.addEventListener('vs-app-hydrated', () => {
        // The library may remove the original skeleton on mount. Inject a
        // stuck replacement after those handlers, outside the hydrated root.
        queueMicrotask(() => {
            const overlay = document.createElement('div');

            overlay.className = 'skeleton-site';
            overlay.style.cssText = 'display:block!important;position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;pointer-events:auto!important;z-index:2147483647!important';
            document.body.appendChild(overlay);
        });
    }));
    await expect(assertHomepage(page)).rejects.toThrow();
});

test('uncaught application exceptions block even if content still renders', async({ page }) => {
    const diagnostics = await monitorPage(page, appOrigin, cmsOrigin);

    await assertHomepage(page);
    await page.evaluate(() => setTimeout(() => {
        throw new Error('Injected application startup failure');
    }, 0));
    await expect.poll(() => diagnostics.failures.some((message) => message.includes('Injected application startup failure'))).toBe(true);
});

test('missing application CSS is detected', async({ page }) => {
    const diagnostics = await monitorPage(page, appOrigin, cmsOrigin);

    await page.route('**/_nuxt/*.css', (route) => route.fulfill({
        status: 404,
        contentType: 'text/css',
        body: '',
    }));
    await page.goto('/', {
        waitUntil: 'domcontentloaded',
    });
    await expect.poll(() => diagnostics.failures.some((message) => message.includes('HTTP 404:'))).toBe(true);
});

test('HTML served as a JavaScript asset is detected', async({ page }) => {
    const diagnostics = await monitorPage(page, appOrigin, cmsOrigin);

    await page.route('**/_nuxt/**', (route) => route.request().resourceType() === 'script'
        ? route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: '<h1>Error</h1>',
        }) : route.fallback());
    await page.goto('/', {
        waitUntil: 'domcontentloaded',
    });
    await expect.poll(() => diagnostics.failures.some((message) => message.includes('Invalid JavaScript content type'))).toBe(true);
});
