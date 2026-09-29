import { type Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Intercepts Bloomreach Resource API requests and responds with stored fixture data.
 *
 * The Bloomreach SPA SDK makes a single GET request per page load to:
 *   {endpoint}/{path}
 *
 * This function matches that request and returns the pre-captured JSON fixture,
 * ensuring deterministic rendering for visual regression tests.
 */
export async function mockBloomreachApi(
    page: Page,
    options: {
        endpoint: string;
        fixturePath: string;
    },
): Promise<void> {
    const fixtureFullPath = resolve(process.cwd(), options.fixturePath);
    const fixtureData = readFileSync(fixtureFullPath, 'utf-8');

    await page.route(
        (url) => {
            return url.hostname === options.endpoint
                && url.pathname.includes('resourceapi');
        },
        (route) => route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: fixtureData,
        }),
    );
}

/**
 * Waits for the Bloomreach SPA SDK to fully hydrate the page.
 * The app dispatches a 'vs-app-hydrated' window event on mount.
 */
export async function waitForHydration(page: Page): Promise<void> {
    await page.evaluate(() => new Promise<void>((resolve) => {
        const check = () => {
            const hydrate = document.querySelector('.hydrate');
            if (hydrate && hydrate.offsetParent !== null) {
                resolve();
                return;
            }
        };

        check();

        window.addEventListener('vs-app-hydrated', () => resolve(), { once: true });

        const observer = new MutationObserver(check);
        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            check();
            resolve();
        }, 15000);
    }));
}
