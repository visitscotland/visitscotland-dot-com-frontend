export default defineEventHandler(async() => {
        const { VS_AWS_APPCONFIG_URL } = useRuntimeConfig();
        let response;
    try {
        response = await fetch(VS_AWS_APPCONFIG_URL);
        } catch (error) {  
export default defineEventHandler(async() => {
    const { VS_AWS_APPCONFIG_URL } = useRuntimeConfig();
    if (!VS_AWS_APPCONFIG_URL) {
        console.error('VS_AWS_APPCONFIG_URL is not configured');
        return {};
    }
    try {
        const response = await fetch(VS_AWS_APPCONFIG_URL);
        if (!response.ok) {
            console.error(`Feature flags fetch failed: ${response.status}`);
            return {};
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching feature flags:', error);
        return {};
    }
});

