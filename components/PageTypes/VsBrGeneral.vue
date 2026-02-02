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

    <VsBrHeroSection
        v-else-if="documentData.theme === 'Simple' && isSearchResultsPage"
        :content="documentData"
    />

    <VsBrPageIntro
        v-else-if="documentData.theme === 'Simple' && !configStore.isMainMapPageFlag"
        :content="documentData"
        :light-background="true"
    />

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <div
            v-if="documentData && documentData.categoryLinks"
            class="mt-175 mt-md-500 mb-175 mb-md-500"
        >
            <VsBrCategorySection
                :categories="documentData.categoryLinks"
            />
        </div>
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrProductSearch
            v-if="productSearch && productSearch.position === 'Top'"
            class="mb-300 mb-lg-600 pt-300"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
        v-if="configStore.showSearchWidget"
    >
        <div class="mt-175 mt-md-500 mb-175 mb-md-500">
            <VsBrSearchWidget />
        </div>
    </NuxtLazyHydrate>

    <template
        v-if="isSearchResultsPage"
    >
        <VsBrSearch
            :modules="pageItems"
        />
    </template>
    <template
        v-else
    >
        <VsBrModuleBuilder
            v-if="pageItems"
            :modules="pageItems"
        />
    </template>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
        v-if="!configStore.isMainMapPageFlag"
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
        v-if="!configStore.isMainMapPageFlag"
    >
        <VsBrHorizontalLinksModule
            v-if="otyml"
            :module="otyml"
            theme="light"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
        v-if="!configStore.isMainMapPageFlag"
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
import VsBrCategorySection from '~/components/Modules/VsBrCategorySection.vue';
import VsBrSearch from '~/components/Modules/VsBrSearch.vue';
import VsBrSearchWidget from '~/components/Modules/VsBrSearchWidget.vue';

const props = defineProps<{ component: Component, page: Page }>();

const { page } = toRefs(props);

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
let isSearchResultsPage = false;

if (page.value) {
    const pageDocument = page.value.getContent(configStore.pageDocument);

    documentData = pageDocument.getData();
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

    // Remove trailing slashes from the global search path to remove path ambiguity
    if (window
        && window.location.pathname.includes(configStore.globalSearchPath.replace(/\/+$/, ''))) {
        isSearchResultsPage = true;
    }
}
</script>
