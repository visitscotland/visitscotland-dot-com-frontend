<template>
    <div class="d-flex flex-column gap-500">
        <VsBrHeroSection
            :content="documentData"
            :image="heroImage"
            img-credit="Creddy McCredface"
            inset
        />
        <VsBrDaySection
            v-for="(item, index) in pageItems"
            :key="`item-${index}`"
            :day="item"
            :day-number="index + 1"
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

import VsBrProductSearch from '~/components/Modules/VsBrProductSearch.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';

import VsBrDaySection from '~/components/Modules/VsBrDaySection.vue';

const props = defineProps<{ component: Component, page: Page }>();

const { page, component } = toRefs(props);

let document : any = {
};
let documentData : any = {
};
let productSearch : any = {
};
let heroImage = {
};
let otyml : any = null;

const configStore = useConfigStore();

let pageItems = {
};

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    productSearch = configStore.productSearch;
    heroImage = documentData.heroImage;

    if (configStore.otyml) {
        otyml = configStore.otyml;
    }

    if (component.value) {
        pageItems = component.value.model.models.pageItems;
    }
}

</script>
