<template>
    <VsContainer class="mt-075 mt-lg-200">
        <VsRow>
            <VsCol
                cols="10"
                lg="8"
            >
                <VsBrBreadcrumb />
            </VsCol>
        </VsRow>
    </VsContainer>

    <VsBrHeroSection
        :content="documentData"
        :image="heroImage"
        :inset="true"
        :favourites-button="true"
    />

    <div
        class="mt-500"
        v-if="pageItems"
    >
        <VsBrModuleBuilder
            :modules="pageItems"
        />
    </div>

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
        <VsBrProductSearch
            v-if="productSearch"
            class="mt-300 mt-lg-600"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <section
            class="mt-500"
            v-if="otyml"
        >
            <VsBrHorizontalLinksModule
                :module="otyml"
                theme="light"
            />
        </section>
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

import VsBrHeroSection from '~/components/Modules/VsBrHeroSection.vue';
import VsBrModuleBuilder from '~/components/Modules/VsBrModuleBuilder.vue';
import VsBrProductSearch from '~/components/Modules/VsBrProductSearch.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';

import {
    VsContainer, VsRow, VsCol,
} from '@visitscotland/component-library/components';

const props = defineProps<{ component: Component, page: Page }>();

const { page } = toRefs(props);

let documentData : any = {
};
let pageItems : any[] = [];
let productSearch : any = {
};
let heroImage = {
};
let otyml : any = null;

const configStore = useConfigStore();

let firstModuleIsLink = false;

if (page.value) {
    const pageDocument = page.value.getContent(configStore.pageDocument);

    documentData = pageDocument.getData();
    pageItems = configStore.pageItems;
    productSearch = configStore.productSearch;
    heroImage = documentData.heroImage;
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
