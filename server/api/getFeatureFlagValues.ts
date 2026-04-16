export default defineEventHandler(async() => {
    const { VS_AWS_APPCONFIG_URL } = useRuntimeConfig();
    const response = await fetch("http://172.28.63.17:2772/applications/visitscotland.com/environments/local/configurations/ttalfx1");
    return response;
});

