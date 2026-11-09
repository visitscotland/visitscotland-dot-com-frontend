/* eslint no-undef: 0 */

// Temporary forwarding route for non-production environments (local, feature).
// TODO: remove before merging.

export default defineEventHandler(async(event) => {
    const { BR_RESOURCE_API_ENDPOINT } = useRuntimeConfig();
    const body = await readBody(event);

    // Keep the origin and any feature-proxy query string (vs_brxm_host etc.)
    const cmsEndpoint = new URL(BR_RESOURCE_API_ENDPOINT);
    const url = `${cmsEndpoint.origin}/api/favourites/get-favourites${cmsEndpoint.search}`;

    try {
        return await $fetch(url, {
            method: 'POST',
            body,
        });
    } catch (error: any) {
        console.error('Favourites forwarding error', error);

        throw createError({
            statusCode: error?.statusCode || 502,
            statusMessage: 'Favourites forwarding error',
        });
    }
});
