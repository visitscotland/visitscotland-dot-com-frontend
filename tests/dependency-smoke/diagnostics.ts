import type { Page } from '@playwright/test';

// Only console diagnostics are exempted. An exception mentioning hydration is
// still an exception and must fail. Keep this list narrow.
export const isHydrationMismatch = (message: string) =>
    /^(?:\[Vue warn\]:\s*)?Hydration (?:node|text(?: content)?|children|class|style|attribute) mismatch\b/i.test(message)
    || /^Hydration completed but contains mismatches\.?$/i.test(message);

export async function monitorPage(page: Page, appOrigin: string, cmsOrigin: string) {
    const diagnostics = {
        console: [] as object[],
        hydrationWarnings: [] as string[],
        failures: [] as string[],
        optionalRequests: [] as string[],
    };
    const localOrigins = new Set([appOrigin, cmsOrigin]);
    // These services are optional for rendering; stub them without downloading
    // or executing remote code. Unexpected external app requests still fail.
    const optionalHosts = new Set(['customer.cludo.com', 'www.googletagmanager.com', 'dataplane.rum.eu-west-2.amazonaws.com']);

    page.on('console', (message) => {
        diagnostics.console.push({
            type: message.type(),
            text: message.text(),
            location: message.location(),
        });

        if (isHydrationMismatch(message.text())) {
            diagnostics.hydrationWarnings.push(message.text());
        } else if (message.type() === 'error') {
            diagnostics.failures.push(`Console error: ${message.text()}`);
        }
    });
    page.on('pageerror', (error) => diagnostics.failures.push(`Uncaught exception: ${error.message}`));
    page.on('crash', () => diagnostics.failures.push('Browser page crashed'));

    const essential = (url: string, type: string) => localOrigins.has(new URL(url).origin)
        && ['document', 'script', 'stylesheet', 'fetch', 'xhr'].includes(type);

    page.on('requestfailed', (request) => {
        if (essential(request.url(), request.resourceType())) {
            diagnostics.failures.push(`Request failed: ${request.url()} (${request.failure()?.errorText})`);
        }
    });
    page.on('response', (response) => {
        const request = response.request();

        if (!essential(response.url(), request.resourceType())) {
            return;
        }

        if (response.status() >= 400) {
            diagnostics.failures.push(`HTTP ${response.status()}: ${response.url()}`);
        }

        const mime = response.headers()['content-type'] || '';

        if (request.resourceType() === 'script' && !/javascript|ecmascript/i.test(mime)) {
            diagnostics.failures.push(`Invalid JavaScript content type: ${response.url()} (${mime})`);
        }

        if (request.resourceType() === 'stylesheet' && !/text\/css/i.test(mime)) {
            diagnostics.failures.push(`Invalid CSS content type: ${response.url()} (${mime})`);
        }
    });
    await page.route('**/*', async(route) => {
        const request = route.request();
        const url = new URL(request.url());

        // Vendored Cludo client initialises a remote search service even on
        // the homepage. It is optional third-party code, despite its local URL.
        if (url.origin === appOrigin && url.pathname === '/scripts/cludo-search-results.js') {
            diagnostics.optionalRequests.push(request.url());

            return route.fulfill({
                status: 200,
                contentType: 'application/javascript',
                body: '',
            });
        }

        if (localOrigins.has(url.origin) || !['http:', 'https:'].includes(url.protocol)) {
            return route.continue();
        }

        if (optionalHosts.has(url.hostname)) {
            diagnostics.optionalRequests.push(request.url());

            return route.fulfill({
                status: 200,
                contentType: request.resourceType() === 'script' ? 'application/javascript' : 'text/plain',
                body: '',
            });
        }

        diagnostics.optionalRequests.push(request.url());

        if (['script', 'stylesheet', 'fetch', 'xhr', 'document'].includes(request.resourceType())) {
            diagnostics.failures.push(`Unexpected external application request: ${request.url()}`);
        }

        return route.abort();
    });
    await page.addInitScript(() => {
        (window as any).__smokeMounted = false;
        window.addEventListener('vs-app-hydrated', () => {
            (window as any).__smokeMounted = true;
        }, {
            once: true,
        });
    });

    return diagnostics;
}
