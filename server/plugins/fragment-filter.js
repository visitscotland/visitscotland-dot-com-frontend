/* eslint no-undef: 0 */

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:response', (response, { event }) => {
        const path = event.path;

        if (path.includes('/data/internal/')) {
            const bodyString = response.body.toString();

            // 1. HARVEST STYLES (links and internal style blocks)
            const styleRegex = /<link [^>]*rel=["']stylesheet["'][^>]*>|<style[^>]*>[\s\S]*?<\/style>/gi;
            const harvestedStyles = bodyString.match(styleRegex) || [];

            // 2. MAKE URLS ABSOLUTE
            // We need the protocol and host so the third-party site knows where to fetch the CSS
            const host = getRequestHost(event, {
                xForwardedHost: true,
            });
            const protocol = getRequestProtocol(event);
            const baseOrigin = `${protocol}://${host}`;

            const absoluteStyles = harvestedStyles.map((tag) => tag.replace(/href="\//g, `href="${baseOrigin}/`));

            const styleBlock = absoluteStyles.join('\n');

            // 3. FRAGMENT EXTRACTION (Your existing logic)
            const startIdx = bodyString.indexOf('START_FRAGMENT_MARKER');
            const endIdx = bodyString.indexOf('END_FRAGMENT_MARKER');

            if (startIdx !== -1 && endIdx !== -1) {
                let fragment = bodyString.substring(
                    startIdx + 'START_FRAGMENT_MARKER'.length,
                    endIdx,
                ).trim();

                fragment = fragment.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

                // 4. COMBINE STYLES + DOM
                // If it's the dedicated css-header path, we maybe ONLY want the styles.
                // Otherwise, we prepend the styles to the DOM fragment.
                if (path.endsWith('css-header')) {
                    fragment = styleBlock;
                } else {
                    fragment = `${styleBlock}\n${fragment}`;
                }

                // Add legacy wrapping
                if (path.endsWith('/header')) {
                    fragment = `${fragment}\n<main id="main">\n`;
                } else if (path.endsWith('/footer')) {
                    fragment = `${fragment}\n<div data-js-footer-dest class="notranslate"></div>\n</main>`;
                }

                response.body = fragment;
                setHeader(event, 'Content-Type', 'text/html; charset=utf-8');
            } else if (path.endsWith('css-header')) {
                // Fallback for css-header if markers aren't used there
                response.body = styleBlock;
                setHeader(event, 'Content-Type', 'text/html; charset=utf-8');
            } else {
                response.body = '';
            }
        }
    });
});
