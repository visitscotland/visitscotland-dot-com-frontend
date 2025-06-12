/* eslint no-undef: 0 */

import fs from 'fs';
import path from 'path';

function bufferFile(relPath: string) {
    return fs.readFileSync(path.join(__dirname, relPath), {
        encoding: 'utf8',
    });
}

const clVersion = bufferFile('.clversion');

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        BR_RESOURCE_API_ENDPOINT: process.env.BR_RESOURCE_API_ENDPOINT,
        BR_X_FORWARDED_HOST: process.env.BR_X_FORWARDED_HOST,
        public: {
            BR_CMS_ORIGIN_LOCATION: process.env.BR_CMS_ORIGIN_LOCATION,
            BR_NUXT_APP_DEBUG: process.env.BR_NUXT_APP_DEBUG,
            COMP_LIBRARY_VERSION: clVersion,
        },
    },

    vite: {
        resolve: {
            preserveSymlinks: true,
        },
        build: {
            cssCodeSplit: true,
        },
    },

    vue: {
        runtimeCompiler: true,
    },

    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],

    buildModules: [
        '@nuxtjs/dotenv',
    ],

    modules: [
        '@pinia/nuxt',
        'nuxt-jsonld',
        'nuxt-lazy-hydrate',
    ],

    'nuxt-jsonld': {
        disableOptionsAPI: true,
    },

    css: [
        '@visitscotland/component-library/style.css',
    ],

    build: {
        transpile: [
            'bootstrap-vue-next',
            '@visitscotland/component-library',
        ],
    },

    compatibilityDate: '2025-05-06',
});
