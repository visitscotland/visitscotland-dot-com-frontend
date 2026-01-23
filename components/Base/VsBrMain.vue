<template>
    <div
        class="vs-main-container"
        :class="{ 'has-edit-button': page.isPreview() }"
    >
        <BrManageContentButton
            :content="pageDocument"
        />

        <VsBrGtm />

        <VsBrPageViewEvent
            :data="pageDocument.model.data"
            :page-type="pageName"
        />

        <VsBrGeneral
            v-if="pageName === 'general-page' || pageName === 'pagenotfound'"
            :page="page"
            :component="component"
        />

        <VsBrDestination
            v-if="pageName === 'destination-page'"
            :page="page"
            :component="component"
        />

        <VsBrItinerary
            v-if="pageName === 'itinerary-page'"
            :page="page"
            :component="component"
        />

        <VsBrListicle
            v-if="pageName === 'listicle-page'"
            :page="page"
            :component="component"
        />

        <VsBr500
            v-else-if="pageName === 'servererror'"
            :page="page"
            :component="component"
        />
    </div>
</template>

<script lang="ts" setup>
/* eslint no-undef: 0 */

import { toRefs, provide } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';
import { BrManageContentButton } from '@bloomreach/vue3-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrGeneral from '~/components/PageTypes/VsBrGeneral.vue';
import VsBrItinerary from '~/components/PageTypes/VsBrItinerary.vue';
import VsBrDestination from '~/components/PageTypes/VsBrDestination.vue';
import VsBr500 from '~/components/PageTypes/VsBr500.vue';

import VsBrGtm from '~/components/Modules/VsBrGtm.vue';

import VsBrPageViewEvent from '~/components/Utils/VsBrPageViewEvent.vue';

const props = defineProps<{ component: Component, page: Page }>();

const { component, page } = toRefs(props);

let pageComponent : any = {
};
let pageName : string = '';

let pageDocument : any = {
};

const configStore = useConfigStore();

if (page.value) {
    pageComponent = page.value.getComponent();
    pageName = pageComponent.model.name;

    const event = useRequestEvent();

    if (pageName === 'pagenotfound') {
        setResponseStatus(event, 404, 'Page Not Found');
    }

    if (pageName === 'servererror') {
        setResponseStatus(event, 500, 'Something Went Wrong');
    }

    /**
     * As a quirk of the data structure in the resourceApi, this main component receives all
     * of the labels, as well as things like the is-business-events flag, the locale and gtm
     * information. As a lot of this is needed in the menu and footer components, the easiest
     * way to make it available globally is to place it in this configStore at the point this
     * component is mounted, which can then be queried anywhere.
     */

    const componentModels = component.value.getModels();

    configStore.activeSite = componentModels['site-id'];
    configStore.productSearch = componentModels.psrWidget;
    if (componentModels.otyml) {
        configStore.otyml = componentModels.otyml;
    }
    configStore.pageItems = componentModels.pageItems;
    configStore.heroImage = componentModels.heroImage;
    configStore.labels = componentModels.labels;
    configStore.newsletterSignpost = componentModels.newsletterSignpost;
    configStore.gtm = componentModels.gtm;
    configStore.pageMetaData = componentModels.metadata;

    if (componentModels.heroVideo) {
        configStore.heroVideo = componentModels.heroVideo;
    }

    if (componentModels.videoHeader) {
        configStore.isLocalVideoheader = true;
    }

    if (componentModels.pageConfiguration) {
        configStore.globalSearchPath = componentModels.pageConfiguration['global-search.path'];
        configStore.cludoCustomerId = componentModels.pageConfiguration['cludo.customer-id'];
        configStore.cludoExperienceId = componentModels.pageConfiguration['cludo.experience-id'];
        configStore.cludoEngineId = componentModels.pageConfiguration['cludo.engine-id'];
        configStore.cludoLanguage = componentModels.pageConfiguration.language;
        configStore.eventsApiUrl = componentModels.pageConfiguration['events-endpoint'];
        configStore.googleMapApiKey = componentModels.pageConfiguration['mapsAPI'];
        configStore.isMainMapPageFlag = componentModels.pageConfiguration['mainMapPage'];

        if (componentModels.pageConfiguration['dms-based']) {
            configStore.searchDmsBased = true;
        }

        if (componentModels.pageConfiguration.searchWidget) {
            configStore.showSearchWidget = true;
        }
    }

    pageDocument = page.value.getDocument();

    configStore.locale = pageDocument.model.data.localeString;

    let langString = '';

    switch (configStore.locale) {
    case 'fr':
        langString = 'fr-fr';
        break;
    case 'nl':
        langString = 'nl-nl';
        break;
    case 'de':
        langString = 'de-de';
        break;
    case 'it':
        langString = 'it-it';
        break;
    case 'es':
        langString = 'es-es';
        break;
    case 'en':
    default:
        langString = 'en-gb';
        break;
    }

    if (langString !== 'en-gb') {
        configStore.langString = langString;
    }

    const runtimeConfig = useRuntimeConfig();

    useHead({
        title: `${pageDocument.model.data.seoTitle} ${configStore.getLabel('seo', 'title-suffix')}`,
        meta: [
            {
                name: 'title',
                content: `${pageDocument.model.data.seoTitle} ${configStore.getLabel('seo', 'title-suffix')}`,
            },
            {
                name: 'description',
                content: pageDocument.model.data.seoDescription,
            },
            {
                name: 'robots',
                content: pageDocument.model.data.noIndex ? 'noindex' : '',
            },
        ],
        htmlAttrs: {
            lang: langString,
            'data-version': configStore.pageMetaData.version,
            'component-library-version': runtimeConfig.public.COMP_LIBRARY_VERSION,
        },
        link: [
            {
                rel: 'icon',
                href: '/favicon.ico',
                sizes: 'any',
            },
            {
                rel: 'icon',
                href: '/icons/favicon.svg',
                type: 'image/svg+xml',
            },
            {
                rel: 'manifest',
                href: '/manifest.webmanifest',
            },
            {
                rel: 'canonical',
                href: useRequestURL().toString().split('?')[0],
            },
        ],
    });

    if (configStore.searchDmsBased) {
        useHead({
            script: [
                {
                    innerHTML: `
                        var cludo_engineId = ${configStore.cludoEngineId};
                        var cludo_language = '${configStore.cludoLanguage}';
                        var cludo_searchUrl = '${configStore.globalSearchPath}';
                    `,
                    tagPosition: 'head',
                },
                {
                    src: 'https://customer.cludo.com/scripts/bundles/search-script.js',
                    onload: () => {
                        const helperScript = document.createElement('script');
                        helperScript.src = 'https://customer.cludo.com/assets/623/12809/cludo-helper.js';
                        document.head.appendChild(helperScript);
                    },
                    async: false,
                    defer: false,
                },
            ],
        });
    }
}

provide('page', page.value);
</script>

<style lang="scss">
    .vs-main-container {
        min-height: calc(100vh - 27rem);

        @media (min-width: 768px) {
            min-height: calc(100vh - 37rem);
        }

        @media (min-width: 992px) {
            min-height: calc(100vh - 28rem);
        }
    }
</style>
