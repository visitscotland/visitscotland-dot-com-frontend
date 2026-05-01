export default defineEventHandler(async() => {
    const { VS_AWS_APPCONFIG_URL } = useRuntimeConfig();
    const response = await fetch(VS_AWS_APPCONFIG_URL);
    return response;
});

