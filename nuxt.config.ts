/* eslint no-undef: 0 */

import fs from 'node:fs';
import path from 'node:path';

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
            cssCodeSplit: false,
        },
    },

    experimental: {
        payloadExtraction: false,
        inlineSSRStyles: false,
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
        '@visitscotland/component-library/cludo-autocomplete.css',
        '@visitscotland/component-library/cludo-search-results.css',
    ],

    build: {
        transpile: [
            'bootstrap-vue-next',
            '@visitscotland/component-library',
        ],
    },

    compatibilityDate: '2026-04-22',

    routeRules: {
        '/_nuxt/**': {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
    },

    app: {
        head: {
            htmlAttrs: {
                class: 'no-js',
            },
            script: [
                {
                    innerHTML: 'document.documentElement.classList.remove(\'no-js\');',
                    type: 'text/javascript',
                },
            ],
        },
    },

    future: {
        multiApp: true,
    },
});
