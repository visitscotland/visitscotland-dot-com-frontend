/* eslint no-undef: 0 */

/**
 * Here be dragons
 *
 * This is all very ugly and unpleasant, and worked out through some trial and error. We needed to
 * replicate the existing header and footer behaviour that the freemarker site supplies for the
 * TMS, but Nuxt complicates things quite a lot. As SSR all happens entirely within the Nuxt server
 * we end up receiving an entire html document when we get /data/internal/header rather than just
 * an html snapshot, and we get some js bundle files and vue config rather than creating them in
 * one place once the page has been constructed like we do in freemarker.
 *
 * This provides us with that functionality when the TMS server hits those endpoints, and does
 * nothing otherwise/
 */

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

            /**
             * As we're going to have to strip the html head from the document to make it into a
             * pure fragment, we have to remove all the styles and scripts and put them into a
             * readable place.
             */
            const styleRegex = /<link [^>]*rel=["']stylesheet["'][^>]*>|<style[^>]*>[\s\S]*?<\/style>/gi;
            const styleBlock = (bodyString.match(styleRegex) || [])
                .map((tag) => tag.replace(/href="\//g, `href="${baseOrigin}/`))
                .join('\n');

            const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
            const scriptBlock = (bodyString.match(scriptRegex) || [])
                .map((tag) => tag.replace(/src="\//g, `src="${baseOrigin}/`))
                .join('\n');

            /**
             * This identifies the chunk of code that actually templates the header/footer so it
             * can be cut out.
             */
            const startMarker = '<div id="start-fragment" style="display:none;"></div>';
            const endMarker = '<div id="end-fragment" style="display:none;"></div>';

            const startIdx = bodyString.indexOf(startMarker);
            const endIdx = bodyString.indexOf(endMarker);

            if (startIdx !== -1 && endIdx !== -1) {
                const internalName = path.split('/').pop().split('?')[0];

                let fragment = bodyString.substring(
                    startIdx + startMarker.length,
                    endIdx,
                ).trim();

                fragment = fragment.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

                fragment = `<div class="nuxt-internal-wrapper" data-internal-type="${internalName}">${fragment}</div>`;

                /**
                 * We reconstruct the two html fragments, including the #main block which is then
                 * used to load the actual content of the TMS on the other server.
                 */
                if (path.includes('/header')) {
                    fragment = `${styleBlock}\n${scriptBlock}\n${fragment}\n<main id="main" class="external-header-integration">`;
                } else if (path.includes('/footer')) {
                    /**
                     * As this creates two nuxt apps which are hydrated separately, one containing
                     * the header and one containing the footer, it is very difficult to get both
                     * to rehydrate in the browser. Fortunately we only really care about
                     * interaction in the header within the TMS. For the footer we can force it
                     * into no-js mode which keeps the menus open and makes it not an issue if it
                     * stays unhydrated.
                     */
                    fragment = `</main><div class="no-js">\n${fragment}</div>`;
                }

                fragment = `${fragment}<!-- end include -->`;

                response.body = fragment;
                setHeader(event, 'Content-Type', 'text/html; charset=utf-8');
            }
        }
    });
});
