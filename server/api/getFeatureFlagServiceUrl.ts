/* eslint no-undef: 0 */

export default defineEventHandler(() => {
    const { VS_AWS_APPCONFIG_URL } = useRuntimeConfig();
    console.log(VS_AWS_APPCONFIG_URL);
    return VS_AWS_APPCONFIG_URL;
});