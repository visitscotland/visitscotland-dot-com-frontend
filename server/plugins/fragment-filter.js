/* eslint no-undef: 0 */

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:response', (response, { event }) => {
        const path = event.path;

        if (path.includes('/data/internal/')) {
            const bodyString = response.body.toString();

            // Look for our literal markers
            const startIdx = bodyString.indexOf('START_FRAGMENT_MARKER');
            const endIdx = bodyString.indexOf('END_FRAGMENT_MARKER');

            if (startIdx !== -1 && endIdx !== -1) {
                // Extract just the content between the markers
                let fragment = bodyString.substring(
                    startIdx + 'START_FRAGMENT_MARKER'.length,
                    endIdx,
                ).trim();

                // Remove any auto-injected Nuxt script tags from the fragment
                fragment = fragment.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

                // Add legacy wrapping
                if (path.endsWith('/header')) {
                    fragment = `${fragment}\n<main id="main">\n`;
                } else if (path.endsWith('/footer')) {
                    fragment = `${fragment}\n<div data-js-footer-dest class="notranslate"></div>\n</main>`;
                }

                // REWRITE the entire response body
                response.body = fragment;

                // Force the content type to HTML (prevents JSON headers)
                setHeader(event, 'Content-Type', 'text/html; charset=utf-8');
            } else {
                // If markers are missing, it means br-page didn't render components.
                // This usually means the Bloomreach API hasn't returned data yet.
                response.body = '';
            }
        }
    });
});
