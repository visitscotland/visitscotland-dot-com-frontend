<template>
    <template v-if="favourites.isDisplayPage">
        <VsContainer class="mt-075 py-150 py-lg-300 ">
            <VsRow>
                <VsBrHeroHeading
                    :content="documentData"
                >
                    <template
                        v-if="favourites.isDisplayPage && !favourites.isSharePage"
                        #button
                    >
                        <VsBrFavouriteShare />
                    </template>
                </VsBrHeroHeading>
            </VsRow>
        </VsContainer>
    </template>
    <template v-else-if="documentData.theme === 'Top-Level'">
        <template v-if="configStore.heroVideo && configStore.isLocalVideoheader">
            <VsContainer
                v-if="!configStore.isHome"
                class="mt-075 mt-lg-200"
            >
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
                :video="configStore.heroVideo"
                :image="heroImage"
            />
        </template>
        <template v-else>
            <VsContainer
                class="mt-075 mt-lg-200"
            >
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
                :split="true"
                :favourites-button="true"
            />
        </template>
    </template>
    <template v-else-if="documentData.theme === 'Simple'">
        <VsContainer
            class="mt-075 mt-lg-200"
        >
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
            :favourites-button="true"
        />
    </template>

    <template v-else-if="!configStore.isMainMapPageFlag">
        <VsContainer
            v-if="!isSearchResultsPage"
            class="mt-075 mt-lg-200"
        >
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
            :inset="true"
            :image="isSearchResultsPage ? null : heroImage"
            class="mb-400"
            :blog="documentData.blog"
            :favourites-button="true"
        />
    </template>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <div
            v-if="documentData && documentData.categoryLinks"
            class="mt-500"
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
        <div
            :class="!configStore.isMainMapPageFlag ? 'mt-500' : ''"
        >
            <VsBrModuleBuilder
                v-if="pageItems"
                :modules="pageItems"
            />
        </div>
    </template>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
        v-if="!configStore.isMainMapPageFlag"
    >
        <VsBrProductSearch
            v-if="productSearch && productSearch.position === 'Bottom'"
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
import { useFavourites } from '#imports';

import VsBrHeroSection from '~/components/Modules/VsBrHeroSection.vue';
import VsBrModuleBuilder from '~/components/Modules/VsBrModuleBuilder.vue';
import VsBrProductSearch from '~/components/Modules/VsBrProductSearch.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';
import VsBrSocialShare from '~/components/Modules/VsBrSocialShare.vue';
import VsBrCategorySection from '~/components/Modules/VsBrCategorySection.vue';
import VsBrSearch from '~/components/Modules/VsBrSearch.vue';
import VsBrBreadcrumb from '~/components/Modules/VsBrBreadcrumb.vue';

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
    coordinates: null,
};
let otyml : any = null;

const configStore = useConfigStore();
const favourites = useFavourites();

let firstModuleIsLink = false;
let isSearchResultsPage = false;

let isSearchWidgetPresent = false;

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
