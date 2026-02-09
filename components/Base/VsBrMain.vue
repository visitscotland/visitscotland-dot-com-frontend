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

import forceHttps from '~/composables/forceHttps.ts';

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
    configStore.pageIntro = componentModels.pageIntro;
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
        configStore.cludoApiOperator = componentModels.pageConfiguration.cludoApiOperator;
        configStore.googleMapApiKey = componentModels.pageConfiguration.mapsAPI;
        configStore.isMainMapPageFlag = componentModels.pageConfiguration.mainMapPage;

        if (componentModels.pageConfiguration['dms-based']) {
            configStore.searchDmsBased = true;
        }

        if (componentModels.pageConfiguration.searchWidget) {
            configStore.showSearchWidget = true;
        }
    }

    const pageContent : any = page.value.getContent(page.value.model.root);
    const pageModels : any = pageContent.models;
    pageDocument = page.value.getContent(pageModels.document);

    configStore.pageDocument = pageModels.document;

    configStore.locale = componentModels.pageConfiguration.language;

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

    const hrefLangs = [];

    if (pageModels.orderedTranslations) {
        for (let x = 0; x < pageModels.orderedTranslations.length; x++) {
            const translation = page.value.getContent(pageModels.orderedTranslations[x].$ref);
            const translationLocale = translation?.model?.data?.localeString;

            if (translationLocale !== configStore.locale) {
                hrefLangs.push({
                    rel: 'alternate',
                    href: forceHttps(translation?.model?.links?.site?.href),
                    hreflang: translationLocale,
                });
            }
        }
    }

    const canonicalLink = forceHttps(useRequestURL().toString().split('?')[0]);

    let ogImageSrc = '';

    if (pageDocument.model.data.heroImage.$ref) {
        const ogImageValue = page.value.getContent(pageDocument.model.data.heroImage.$ref);
        ogImageSrc = ogImageValue.getOriginal().getUrl();
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
            {
                property: 'og:title',
                content: pageDocument.model.data.seoTitle,
            },
            {
                property: 'og:description',
                content: pageDocument.model.data.seoDescription,
            },
            {
                property: 'og:type',
                content: 'article',
            },
            {
                property: 'og:url',
                content: canonicalLink,
            },
            {
                property: 'og:site_name',
                content: configStore.getLabel('seo', 'site-name'),
            },
            {
                property: 'og:locale',
                content: configStore.locale,
            },
            {
                property: 'og:image',
                content: ogImageSrc,
            },
            {
                name: 'twitter:card',
                content: 'summary_large_image',
            },
            {
                name: 'twitter:site',
                content: configStore.getLabel('seo', 'og.twitter.site'),
            },
            {
                name: 'twitter:title',
                content: pageDocument.model.data.seoTitle,
            },
            {
                name: 'twitter:description',
                content: pageDocument.model.data.seoDescription,
            },
            {
                name: 'twitter:image',
                content: ogImageSrc,
            },
            {
                name: 'search:category',
                content: pageModels.searchCategory,
            },
            {
                name: 'search:contentType',
                content: pageModels.searchContentType,
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
                href: '/favicon.svg',
                type: 'image/svg+xml',
            },
            {
                rel: 'manifest',
                href: '/manifest.webmanifest',
            },
            {
                rel: 'canonical',
                href: canonicalLink,
            },
        ],
    });

    useHead({
        link: hrefLangs,
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
