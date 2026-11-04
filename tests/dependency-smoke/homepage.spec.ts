import { test, expect } from '@playwright/test';
import { smokeEnvironment } from './environment.mjs';
import { monitorPage } from './diagnostics.ts';
import { assertHomepage } from './assert-homepage.ts';

const { appOrigin, cmsOrigin } = smokeEnvironment();

test('production server returns a real server-rendered homepage', async({ request }, testInfo) => {
    const response = await request.get('/', {
        maxRedirects: 0,
    });

    const html = await response.text();

    await testInfo.attach('server-response.html', {
        body: html,
        contentType: 'text/html',
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');

    const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] || '';

    expect(main).toMatch(/<h1\b[^>]*>[\s\S]*?Discover Scotland[\s\S]*?<\/h1>/i);
    expect(main).toContain('Plan your next adventure in Scotland.');
    expect(html).toMatch(/<header\b/i);
    expect(html).toMatch(/<footer\b/i);

    const cmsRequests = await request.get(`${cmsOrigin}/__requests`);

    expect((await cmsRequests.json()).length, 'SSR must use the fixture through the real SDK').toBeGreaterThan(0);
});

test('homepage mounts, renders and responds to interaction', async({ page }, testInfo) => {
    const diagnostics = await monitorPage(page, appOrigin, cmsOrigin);

    try {
        await assertHomepage(page);
        // Small bounded observation window catches delayed startup failures;
        await page.waitForTimeout(750);

        await expect(page.getByRole('heading', {
            level: 1,
            name: 'Discover Scotland',
        })).toBeVisible();

        const finalResponse = await page.request.get('/', {
            maxRedirects: 0,
        });

        expect(finalResponse.status(), 'Server must remain healthy after browser startup').toBe(200);
        expect(diagnostics.failures).toEqual([]);

        if (diagnostics.hydrationWarnings.length) {
            testInfo.annotations.push({
                type: 'warning',
                description: `${diagnostics.hydrationWarnings.length} non-blocking hydration mismatch messages`,
            });
        }
    } finally {
        await testInfo.attach('browser-diagnostics.json', {
            body: JSON.stringify(diagnostics, null, 2),
            contentType: 'application/json',
        });
    }
});
