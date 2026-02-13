<template>
    <div>
        <div v-if="!isInternalResource">
            <VsBrSkeleton
                v-show="!hideSkeleton"
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
                            <br-component
                                component="menu"
                            />
                            <br-component
                                component="main"
                            />
                            <br-component
                                component="footer"
                            />
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
        <!-- Alternative templating that is only loaded by the TMS when retrieving the header
         and footer for external use -->
        <div v-if="isInternalResource">
            <div id="start-fragment" style="display: none;" />
            <div id="__nuxt" class="external-header-integration">
                <br-page :configuration="configuration" :mapping="mapping">
                    <template #default>
                        <Suspense v-if="internalResourceName === 'header'">
                            <component :is="CssHeader" />
                        </Suspense>
                        <br-component component="menu" v-if="internalResourceName === 'header'" />
                        <br-component component="footer" v-if="internalResourceName === 'footer'" />
                    </template>
                </br-page>
            </div>
            <div id="end-fragment" style="display: none;" />
        </div>
    </div>
</template>

<script setup>
/* eslint vue/component-name-in-template-casing: 0 */
/* eslint no-undef: 0 */

/**
 * As the core of the vue application booted up by nuxt, this component manages all of the
 * communication with the bloomreach resourceApi instance and scaffolds out the component. It
 * also renders the skeleton which is displayed until the site has been mounted.
 */

import axios from 'axios';

import {
    getCurrentInstance, ref, onMounted,
} from 'vue';
import mitt from 'mitt';

import VsBrMenu from '~/components/Base/VsBrMenu.vue';
import VsBrFooter from '~/components/Base/VsBrFooter.vue';
import VsBrMain from '~/components/Base/VsBrMain.vue';
import VsBrSkeleton from '~/components/Base/VsBrSkeleton.vue';

const CssHeader = defineAsyncComponent(() => import('~/components/InternalResources/CssHeader.vue'));

/**
 * This section sets up all of the information we need to make available for the Bloomreach SDK
 * to make a connection to the resourceApi. Once it is all gathered and bundled into the
 * configuration object, we then pass it as a prop to the br-page component and everything is
 * handled by the SDK internally.
 */
const app = getCurrentInstance();
const emitter = mitt();
app.appContext.config.globalProperties.emitter = emitter;

/**
 * The current path, which is then transformed into a resource api endpoint to get from the CMS
 */
const route = useRoute().path;

/**
 * The endpoint, and a host name which is only needed in prod to ensure different servers can
 * communicate
 */
const { data: endpoint } = await useFetch('/api/getEndpoint');
const { data: xForwardedhost } = await useFetch('/api/getXForwardedHost');

let locale = 'resourceapi';

const localeStrings = [
    'fr-fr',
    'es-es',
    'it-it',
    'nl-nl',
    'de-de',
];

const isMounted = ref(false);
const hideSkeleton = ref(false);

onMounted(() => {
    isMounted.value = true;

    const hydrationEvent = new Event('vs-app-hydrated');
    window.dispatchEvent(hydrationEvent);
});

let deLocalisedRoute = route;

for (let x = 0; x < localeStrings.length; x++) {
    if (route.includes(localeStrings[x])) {
        locale = `${localeStrings[x]}/resourceapi`;
        deLocalisedRoute = deLocalisedRoute.replace(`/${localeStrings[x]}`, '');
    }
}

const localisedEndpoint = endpoint.value.replace('resourceapi', locale);

/**
 * The query parameter names which the cms is set to use in preview mode, so we can retrieve the
 * correct flags from the preview iframe url to request preview data from the cms / show edit
 * buttons.
 */
const PREVIEW_TOKEN_KEY = 'token';
const PREVIEW_SERVER_ID_KEY = 'server-id';

let authorizationToken = '';
let serverId = '';

if (window && window.location) {
    const searchParams = new URLSearchParams(window.location.search);
    authorizationToken = searchParams.get(PREVIEW_TOKEN_KEY);
    serverId = searchParams.get(PREVIEW_SERVER_ID_KEY);
}

/**
 * This object retrieves the runtimeConfig object from nuxt.config, making set values from the .env
 * file available at runtime
 */
const runtimeConfig = useRuntimeConfig();

if (process.server && xForwardedhost.value) {
    axios.defaults.headers.common.Host = xForwardedhost.value;
}

let isInternalResource = false;
let internalResourceName = '';

const determineInternalState = () => {
    if (process.server) {
        if (deLocalisedRoute.includes('/data/internal/header')) {
            return {
                isInternal: true,
                name: 'header',
            };
        }
        if (deLocalisedRoute.includes('/data/internal/footer')) {
            return {
                isInternal: true,
                name: 'footer',
            };
        }
    }

    if (process.client) {
        const el = document.querySelector('.nuxt-internal-wrapper[data-internal-type]');
        if (el) {
            return {
                isInternal: true,
                name: el.getAttribute('data-internal-type'),
            };
        }
    }

    return {
        isInternal: false,
        name: '',
    };
};

const state = determineInternalState();
isInternalResource = state.isInternal;
internalResourceName = state.name;

if (isInternalResource) {
    deLocalisedRoute = '/';
}

/**
 * The actual constructed configuration object, with all necessary information to retrieve the
 * current page's information from the resourceApi, along with debug and preview flags and our
 * httpClient of choice
 */
const configuration = {
    path: deLocalisedRoute,
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

/**
 * This object maps Bloomreach Components in the CMS data to a set of Vue components. It is
 * passed to the br-page object as a prop, and we can then render each of those components by
 * name as a br-component object, as in the template above.
 *
 * It would be possible to render every aspect of the site here with this mapping, but in most
 * of our projects the main CMS data isn't constructed using Bloomreach Components. As such, we
 * only get passed the 3 core components: menu, main and footer. Within each of those the component
 * receives a `component` prop, which can be interrogated for a set of child models, and within
 * those sit the menu data (in the case of the menu and footer) and the full set of `pageItems`
 * which contain our modules in the case of main.
 */
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

    .hydrate {
        z-index: 2;
        position: relative;
        background-color: white;
    }
</style>
