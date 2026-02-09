/* eslint no-undef: 0 */

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:response', (response, { event }) => {
        const path = event.path;

        if (path.includes('/data/internal/')) {
            const bodyString = response.body.toString();
            const host = getRequestHost(event, {
                xForwardedHost: true,
            });
            const protocol = getRequestProtocol(event);
            const baseOrigin = `${protocol}://${host}`;

            const styleRegex = /<link [^>]*rel=["']stylesheet["'][^>]*>|<style[^>]*>[\s\S]*?<\/style>/gi;
            const styleBlock = (bodyString.match(styleRegex) || [])
                .map((tag) => tag.replace(/href="\//g, `href="${baseOrigin}/`))
                .join('\n');

            const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
            const scriptBlock = (bodyString.match(scriptRegex) || [])
                .map((tag) => tag.replace(/src="\//g, `src="${baseOrigin}/`))
                .join('\n');

            const startMarker = '<div id="start-fragment" style="display:none;"></div>';
            const endMarker = '<div id="end-fragment" style="display:none;"></div>';

            const startIdx = bodyString.indexOf(startMarker);
            const endIdx = bodyString.indexOf(endMarker);

            if (startIdx !== -1 && endIdx !== -1) {
                const internalName = path.split('/').pop();
                const persistenceScript = `<script>window.__NUXT_INTERNAL_RESOURCE__ = "${internalName}";</script>`;

                let fragment = bodyString.substring(
                    startIdx + startMarker.length,
                    endIdx,
                ).trim();

                fragment = fragment.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

                fragment = `${persistenceScript}\n${scriptBlock}\n${styleBlock}\n${fragment}`;

                if (path.endsWith('/header')) {
                    fragment = `${fragment}\n<main id="main">\n`;
                } else if (path.endsWith('/footer')) {
                    fragment = `${fragment}\n<div data-js-footer-dest class="notranslate"></div>\n</main>`;
                }

                response.body = fragment;
                setHeader(event, 'Content-Type', 'text/html; charset=utf-8');
            } else {
                // Helpful for debugging in the network tab if markers fail
                response.body = '';
            }
        }
    });
});
