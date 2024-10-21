<template>
    <div
        class="vs-main-container"
        :class="{ 'has-edit-button': page.isPreview() }"
    >
        <BrManageContentButton
            :content="document"
        />

        <VsBrGtm />

        <h1>Main component</h1>
    </div>
</template>

<script lang="ts" setup>
/* eslint no-undef: 0 */

import { toRefs, provide } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';
import { BrManageContentButton } from '@bloomreach/vue3-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrGtm from '~/components/Modules/VsBrGtm.vue';

const props = defineProps<{ component: Component, page: Page }>();

const { component, page } = toRefs(props);

let pageComponent : any = {
};
let pageName : string = '';

let document : any = {
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

    const componentModels = component.value.getModels();

    /**
     * As a quirk of the data structure in the resourceApi, this main component receives all
     * of the labels, as well as things like the is-business-events flag, the locale and gtm
     * information. As a lot of this is needed in the menu and footer components, the easiest
     * way to make it available globally is to place it in this configStore at the point this
     * component is mounted, which can then be queried anywhere.
     */

    configStore.pageMetaData = componentModels.metadata;

    // configStore.isBusinessEvents = componentModels['business-events'];
    // configStore.pageItems = componentModels.pageItems;
    configStore.labels = componentModels.labels;

    document = page.value.getDocument();

    configStore.locale = document.model.data.localeString;

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

    const runtimeConfig = useRuntimeConfig();

    useHead({
        title: document.model.data.seoTitle,
        meta: [
            {
                name: 'title',
                content: document.model.data.seoTitle,
            },
            {
                name: 'description',
                content: document.model.data.seoDescription,
            },
            {
                name: 'robots',
                content: document.model.data.noIndex ? 'noindex' : '',
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
                rel: 'apple-touch-icon',
                href: '/icons/apple-touch-icon-180-180.svg',
                sizes: 'any',
            },
            {
                rel: 'manifest',
                href: '/manifest.webmanifest',
            },
        ],
    });
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
