export function smokeEnvironment(source = process.env) {
    const port = (name, fallback) => {
        const value = Number(source[name] || fallback);

        if (!Number.isInteger(value) || value < 1024 || value > 65535) {
            throw new Error(`Invalid ${name}`);
        }

        return value;
    };
    const appPort = port('SMOKE_APP_PORT', 4317);
    const cmsPort = port('SMOKE_CMS_PORT', 4318);

    if (appPort === cmsPort) {
        throw new Error('Smoke ports must be different');
    }

    const appOrigin = `http://127.0.0.1:${appPort}`;
    const cmsOrigin = `http://127.0.0.1:${cmsPort}`;

    return {
        appPort,
        cmsPort,
        appOrigin,
        cmsOrigin,
        env: {
            ...source,
            NODE_ENV: 'production',
            NITRO_PRESET: 'node-server',
            HOST: '127.0.0.1',
            PORT: String(appPort),
            NITRO_HOST: '127.0.0.1',
            NITRO_PORT: String(appPort),
            BR_RESOURCE_API_ENDPOINT: `${cmsOrigin}/resourceapi`,
            BR_X_FORWARDED_HOST: `127.0.0.1:${cmsPort}`,
            BR_CMS_ORIGIN_LOCATION: cmsOrigin,
            NUXT_BR_RESOURCE_API_ENDPOINT: `${cmsOrigin}/resourceapi`,
            NUXT_BR_X_FORWARDED_HOST: `127.0.0.1:${cmsPort}`,
            NUXT_PUBLIC_BR_CMS_ORIGIN_LOCATION: cmsOrigin,
            NUXT_PUBLIC_BR_NUXT_APP_DEBUG: 'false',
            NUXT_PUBLIC_AWS_RUM_APPLICATION_ID: '',
            NUXT_PUBLIC_AWS_IDENTITY_POOL_ID: '',
        },
    };
}
