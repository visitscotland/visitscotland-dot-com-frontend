export default defineEventHandler(async() => {
        const { VS_AWS_APPCONFIG_URL } = useRuntimeConfig();
        let response;
    try {
        response = await fetch(VS_AWS_APPCONFIG_URL);
        } catch (error) {  
            console.log(error);
            response = {}
        }
    return response;
});

