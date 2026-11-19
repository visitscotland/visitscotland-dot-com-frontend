import {
    test, expect, takeSnapshot,
} from '@chromatic-com/playwright';
import { resolve } from 'node:path';
import { apps } from './pages.config';
import { mockBloomreachApi, waitForHydration } from './utils/mock-bloomreach.ts';

const chromaticCapture = process.env.CHROMATIC_CAPTURE === 'true';

// Capture once, after rendering assertions pass; keep native comparisons locally.
test.use({
    disableAutoSnapshot: true,
});

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

                const response = await browserPage.goto(page.path, {
                    waitUntil: 'domcontentloaded',
                });

                expect(response?.ok(), 'Page navigation should succeed').toBe(true);
                await waitForHydration(browserPage);
                await expect(browserPage.locator('.hydrate')).toBeVisible();
                await expect(browserPage.getByRole('main')).toBeVisible();
                await expect(browserPage.getByRole('heading', {
                    level: 1,
                    name: page.heading,
                    exact: true,
                })).toBeVisible();
                await expect(browserPage.getByRole('contentinfo')).toBeVisible();
                expect(piniaErrors).toEqual([]);

                if (chromaticCapture) {
                    // Persist native screenshot overrides in the DOM archive too.
                    await browserPage.addStyleTag({
                        path: resolve('tests/visual-overrides.css'),
                    });
                    await takeSnapshot(browserPage, testInfo);
                    return;
                }

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
