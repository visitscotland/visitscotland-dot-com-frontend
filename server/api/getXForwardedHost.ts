/* eslint no-undef: 0 */

export default defineEventHandler(() => {
    const { BR_X_FORWARDED_HOST } = useRuntimeConfig();
    return BR_X_FORWARDED_HOST;
});
