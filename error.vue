<template>
    <div>
        <VsBrSkeleton
            v-show="!isMounted"
        />
        <div
            class="hydrate"
            v-show="isMounted"
        >
            <br-page
                :configuration="configuration"
                :mapping="mapping"
            >
                <template #default>
                    <div
                        :class="!isMounted ? 'no-js' : ''"
                    >
                        <br-component component="menu" />
                        <br-component component="main" />
                        <br-component component="footer" />
                    </div>
                </template>
            </br-page>
        </div>
        <noscript>
            <component :is="'style'">
            .skeleton-site { display: none !important }
            .hydrate { display: block !important }
            </component>
        </noscript>
    </div>
</template>

<script setup>
/* eslint vue/component-name-in-template-casing: 0 */
/* eslint vue/multi-word-component-names: 0 */
/* eslint no-undef: 0 */

import axios from 'axios';

import {
    getCurrentInstance, ref, onMounted,
} from 'vue';
import mitt from 'mitt';

import VsBrMenu from '~/components/Base/VsBrMenu.vue';
import VsBrFooter from '~/components/Base/VsBrFooter.vue';
import VsBrSkeleton from '~/components/Base/VsBrSkeleton.vue';
import VsBrMain from '~/components/Base/VsBrMain.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const app = getCurrentInstance();
const emitter = mitt();
app.appContext.config.globalProperties.emitter = emitter;

const route = useRoute().path;

const localeStrings = [
    'fr-fr',
    'es-es',
    'it-it',
    'nl-nl',
    'de-de',
];

// Get API endpoint from the server side.
const { data: endpoint } = await useFetch('/api/getEndpoint');
const { data: xForwardedhost } = await useFetch('/api/getXForwardedHost');

const isMounted = ref(false);

onMounted(() => {
    isMounted.value = true;
});

const PREVIEW_TOKEN_KEY = 'token';
const PREVIEW_SERVER_ID_KEY = 'server-id';

let authorizationToken = '';
let serverId = '';

if (window && window.location) {
    const searchParams = new URLSearchParams(window.location.search);
    authorizationToken = searchParams.get(PREVIEW_TOKEN_KEY);
    serverId = searchParams.get(PREVIEW_SERVER_ID_KEY);
}

const runtimeConfig = useRuntimeConfig();

if (process.server && xForwardedhost.value) {
    axios.defaults.headers.common.Host = xForwardedhost.value;
}

let locale = 'resourceapi';

for (let x = 0; x < localeStrings.length; x++) {
    if (route.includes(localeStrings[x])) {
        locale = `${localeStrings[x]}/resourceapi`;
        deLocalisedRoute = deLocalisedRoute.replace(`/${localeStrings[x]}`, '');
    }
}

configStore.pathIfError = deLocalisedRoute;

const localisedEndpoint = endpoint.value.replace('resourceapi', locale);

const configuration = {
    path: '/servererror',
    endpoint: localisedEndpoint,
    httpClient: axios,
    ...(authorizationToken ? {
        authorizationToken,
    } : {
    }),
    ...(serverId ? {
        serverId,
    } : {
    }),
    origin: runtimeConfig.public.BR_CMS_ORIGIN_LOCATION,
    debug: runtimeConfig.public.BR_NUXT_APP_DEBUG === 'true',
};

const mapping = {
    menu: VsBrMenu,
    main: VsBrMain,
    footer: VsBrFooter,
};
</script>

<style lang="scss">
    .has-edit-button {
        position: relative;

        &.vs-sticky-nav {
            top: 0;
        }
    }
</style>
