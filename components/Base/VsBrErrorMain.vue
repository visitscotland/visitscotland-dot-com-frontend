<template>
    <div
        class="vs-main-container"
        :class="{ 'has-edit-button': page.isPreview() }"
    >
        <VsBrGtm />

        <VsBrPageViewEvent
            :data="pageDocument.model.data"
            :page-type="pageName"
        />

        <VsBrPageIntro
            :content="errorData"
            :light-background="true"
        />
    </div>
</template>

<script lang="ts" setup>
/* eslint no-undef: 0 */

import { toRefs, provide } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrPageIntro from '~/components/Modules/VsBrPageIntro.vue';
import VsBrGtm from '~/components/Modules/VsBrGtm.vue';

import VsBrPageViewEvent from '~/components/Utils/VsBrPageViewEvent.vue';

const props = defineProps<{ component: Component, page: Page }>();

const { component, page } = toRefs(props);

let pageComponent : any = {
};
let pageName : string = '';

let pageDocument : any = {
};

const errorData = {
    introduction: {
    },
};

const configStore = useConfigStore();

if (page.value) {
    pageComponent = page.value.getComponent();
    pageName = pageComponent.model.name;

    const event = useRequestEvent();
    setResponseStatus(event, 500, 'Something Went Wrong');

    const componentModels = component.value.getModels();

    configStore.activeSite = componentModels['site-id'];
    configStore.labels = componentModels.labels;
    configStore.gtm = componentModels.gtm;
    configStore.pageMetaData = componentModels.metadata;

    errorData.introduction.value = `<p>${configStore.getLabel('essentials.global', 'third-party-error')}</p>`;

    const pageContent : any = page.value.getContent(page.value.model.root);
    const pageModels : any = pageContent.models;
    pageDocument = page.value.getContent(pageModels.document);

    configStore.pageDocument = pageModels.document;

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

    const runtimeConfig = useRuntimeConfig();

    useHead({
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
