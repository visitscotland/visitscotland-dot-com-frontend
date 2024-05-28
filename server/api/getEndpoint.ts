/* eslint no-undef: 0 */

export default defineEventHandler(() => {
    const { BR_RESOURCE_API_ENDPOINT } = useRuntimeConfig();
    return BR_RESOURCE_API_ENDPOINT;
});
