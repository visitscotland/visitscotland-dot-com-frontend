import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { apps } from './pages.config';
import { mockBloomreachApi, waitForHydration } from './utils/mock-bloomreach.ts';

for (const app of apps) {
    test.describe(app.name, () => {
        for (const page of app.pages) {
            test(`visual regression: ${page.name}`, async({ page: browserPage }, testInfo) => {
                test.skip(testInfo.project.name !== app.name, 'Skipping: not the current project');

                const piniaErrors: string[] = [];
                browserPage.on('pageerror', (error) => {
                    if (/pinia|storeToRefs/i.test(error.message)) {
                        piniaErrors.push(error.message);
                    }
                });

                const fixturePath = resolve(
                    process.cwd(),
                    app.fixtureDir,
                    page.fixtureFile,
                );

                await mockBloomreachApi(browserPage, {
                    endpoint: app.bloomreachEndpoint,
                    fixturePath,
                });

                await browserPage.route('**/api/getEndpoint', (route) =>
                    route.fulfill({
                        status: 200,
                        contentType: 'text/plain',
                        body: `https://${app.bloomreachEndpoint}/resourceapi`,
                    }),
                );
                await browserPage.route('**/api/getXForwardedHost', (route) =>
                    route.fulfill({
                        status: 200,
                        contentType: 'text/plain',
                        body: '',
                    }),
                );

                await browserPage.goto(page.path, {
                    waitUntil: 'domcontentloaded',
                });

                await waitForHydration(browserPage);
                await expect(browserPage.locator('.hydrate')).toBeVisible();
                expect(piniaErrors).toEqual([]);

                await expect(browserPage).toHaveScreenshot(
                    `${page.name.toLowerCase().replace(/\s+/g, '-')}.png`,
                    {
                        fullPage: true,
                    },
                );
            });
        }
    });
}
