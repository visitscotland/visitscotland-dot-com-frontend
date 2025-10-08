<template>
    <template v-if="documentData.blog">
        <VsBrPageIntro
            :content="documentData"
            :light-background="true"
            :blog="documentData.blog"
        />

        <VsBrIntroImage
            :image="heroImage"
        />
    </template>

    <template v-else-if="documentData.theme === 'Top-Level'">
        <VsBrHeroSection
            v-if="configStore.heroVideo && configStore.isLocalVideoheader"
            :content="documentData"
            :video="configStore.heroVideo"
            :image="heroImage"
        />
        <VsBrPageIntro
            v-else
            :content="documentData"
            :hero-image="heroImage"
            :light-background="((productSearch && productSearch.position === 'Top') || !firstModuleIsLink) ? true : false"
        />
    </template>

    <template v-else-if="documentData.theme === 'Standard'">
        <VsBrPageIntro
            :content="documentData"
            :light-background="true"
        />

        <VsBrIntroImage
            :image="heroImage"
        />
    </template>

    <VsBrPageIntro
        v-else-if="documentData.theme === 'Simple'"
        :content="documentData"
        :light-background="true"
    />

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrProductSearch
            v-if="productSearch && productSearch.position === 'Top'"
            class="mb-300 mb-lg-600 pt-300"
        />
    </NuxtLazyHydrate>

    <VsBrModuleBuilder
        v-if="pageItems"
        :modules="pageItems"
    />

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrProductSearch
            v-if="productSearch && productSearch.position === 'Bottom'"
            class="mt-300 mt-lg-600"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrSocialShare
            :no-js="true"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrHorizontalLinksModule
            v-if="otyml"
            :module="otyml"
            theme="light"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrNewsletterSignpost
            v-if="!documentData.hideNewsletter && configStore.newsletterSignpost"
            :data="configStore.newsletterSignpost"
        />
    </NuxtLazyHydrate>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrPageIntro from '~/components/Modules/VsBrPageIntro.vue';
import VsBrHeroSection from '~/components/Modules/VsBrHeroSection.vue';
import VsBrIntroImage from '~/components/Modules/VsBrIntroImage.vue';
import VsBrModuleBuilder from '~/components/Modules/VsBrModuleBuilder.vue';
import VsBrProductSearch from '~/components/Modules/VsBrProductSearch.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';
import VsBrSocialShare from '~/components/Modules/VsBrSocialShare.vue';

const props = defineProps<{ component: Component, page: Page }>();

const { page } = toRefs(props);

let document : any = {
};
let documentData : any = {
};
let pageItems : any[] = [];
let productSearch : any = {
};
let heroImage = {
    coordinates: null,
};
let otyml : any = null;

const configStore = useConfigStore();

let firstModuleIsLink = false;

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    pageItems = configStore.pageItems;
    productSearch = configStore.productSearch;
    heroImage = documentData.heroImage;

    if (configStore.heroImage && configStore.heroImage.coordinates) {
        heroImage.coordinates = configStore.heroImage.coordinates;
    }

    if (configStore.otyml) {
        otyml = configStore.otyml;
    }

    if (pageItems && pageItems.length) {
        let firstNonPersonalisationModule = 0;
        if (pageItems.length > 1 && pageItems[0].type === 'PersonalisationModule') {
            firstNonPersonalisationModule = 1;
        }
        if (
            pageItems[firstNonPersonalisationModule].type === 'ListLinksModule'
            || pageItems[firstNonPersonalisationModule].type === 'MultiImageLinksModule'
            || pageItems[firstNonPersonalisationModule].type === 'SingleImageLinksModule'
        ) {
            firstModuleIsLink = true;
        }
    }
}
</script>
