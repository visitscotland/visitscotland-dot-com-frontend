<template>
    <div
        v-if="configStore.searchDmsBased"
        id="cludo-search-results"
        class="cludo-search-results"
    >
        <div class="cludo-search-results__layout mb-300 mb-md-500">
            <VsEmbedWrapper
                no-cookies-required
                no-cookie-text="You need cookies enabled to view this content"
                :error-text="configStore.getLabel('essentials.global', 'third-party-error')"
                :no-js-text="configStore.getLabel('search', 'no-js')"
            >
                <template #embed-widget>
                    <div class="row">
                        <div class="col-12 col-lg-10 offset-lg-1 mb-100 mb-lg-200">
                            <div class="cludo-search-results__search-result-count search-result-count" role="status" />
                            <div class="cludo-search-results__did-you-mean search-did-you-mean" role="Complementary" />
                            <div class="cludo-search-results__facets search-filters" aria-controls="search-results" />
                        </div>

                        <div class="col-12 col-lg-10 offset-lg-1" role="main">
                            <div class="cludo-search-results__results-wrapper">
                                <div class="cludo-search-results__results search-results" role="region" id="search-results" aria-live="polite" />
                            </div>
                        </div>
                    </div>
                </template>
            </VsEmbedWrapper>
        </div>
    </div>
    <VsContainer v-else>
        <div class="vs-search">
            <div class="vs-search__container">
                <VsBrSearchInput />

                <VsBrDivider />

                <template
                    v-for="(module, index) in modules"
                    :key="module.id"
                >
                    <VsBrModuleBuilder
                        v-if="moduleNames[index] === searchStore.categoryKey"
                        :modules="[module]"
                    />
                </template>

                <div class="vs-search__results">
                    <div>
                        <VsHeading
                            class="my-0"
                            heading-style="heading-m"
                            :level="2"
                        >
                            {{ configStore.getLabel('search', 'search.results') }}
                        </VsHeading>
                        <VsDetail>
                            {{ configStore.getLabel('search', 'results.first-sentence') }}
                            {{ searchStore.totalResults }}
                            {{ configStore.getLabel('search', 'results.second-sentence') }}
                        </VsDetail>
                    </div>
                    <VsBrSearchSort v-if="searchStore.categoryKey === 'events'" />
                </div>

                <VsLoadingSpinner v-if="searchStore.isLoading" />

                <VsBrSearchResultsDisplay v-else />
            </div>

            <VsWarning class="vs-search__error--no-js mb-300">
                {{ configStore.getLabel('search', 'no-js') }}
            </VsWarning>
        </div>
    </VsContainer>
</template>

<script setup lang="ts">
import type { Page } from '@bloomreach/spa-sdk';

import { inject, onMounted } from 'vue';
import {
    VsContainer,
    VsDetail,
    VsEmbedWrapper,
    VsHeading,
    VsLoadingSpinner,
    VsWarning,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import useSearchStore from '~/stores/searchStore.ts';

import dataLayerComposable from '~/composables/dataLayer.ts';

import VsBrDivider from './VsBrDivider.vue';
import VsBrModuleBuilder from './VsBrModuleBuilder.vue';
import VsBrSearchInput from './VsBrSearchInput.vue';
import VsBrSearchResultsDisplay from './VsBrSearchResultsDisplay.vue';
import VsBrSearchSort from './VsBrSearchSort.vue';

const page: Page | undefined = inject('page');
const configStore = useConfigStore();
const searchStore = useSearchStore();
const dataLayerHelper = dataLayerComposable();

// eslint-disable-next-line no-undef
const route = useRoute();

type Props = {
    modules: any[];
};

const { modules } = defineProps<Props>();

const moduleNames = [];

for (let x = 0; x < modules.length; x++) {
    const hippoBean = page?.getContent(modules[x].hippoBean.$ref);

    moduleNames.push(hippoBean?.model.data.name);
}

function pageCloseAnalytics() {
    // This event should only be fired if the user is leaving search without clicking a result.
    if (searchStore.eventHasBeenClicked) return;

    dataLayerHelper.createDataLayerObject('siteSearchCloseEvent', {
        search_query: searchStore.searchTerm,
        search_usage_index: searchStore.searchInSessionCount,
        query_input: searchStore.queryInput,
        page_number: searchStore.currentPage,
        results_count: searchStore.totalResults,
    });
}

onMounted(() => {
    // Set API query parameters using the URL parameters.
    searchStore.searchTerm = route.query['search-term'] as string;
    searchStore.categoryKey = route.query.category as string;

    if (route.query.subcategories) {
        const routeSubcategories = route.query.subcategories as string;

        searchStore.subcategoryKeys = routeSubcategories.split(',');
    }

    searchStore.currentPage = Number(route.query.page) || 1;
    searchStore.fromDate = route.query['from-date'] as string;
    searchStore.toDate = route.query['to-date'] as string;
    searchStore.sortBy = route.query['sort-by'] as string;
    searchStore.location = route.query.location as string;
    searchStore.postcode = route.query.postcode as string;
    searchStore.postcodeareas = route.query.postcodeareas as string;
    searchStore.radius = Number(route.query.radius) || 0;

    searchStore.getSearchResults();

    window.onbeforeunload = () => {
        pageCloseAnalytics();
    };

    if (route.query['search-term']) {
        dataLayerHelper.createDataLayerObject('siteSearchUsageEvent', {
            search_query: searchStore.searchTerm,
            query_input: searchStore.queryInput,
            results_count: searchStore.totalResults,
            search_usage_index: searchStore.searchInSessionCount,
            search_type: 'initial',
            search_origin: 'home_page',
        });
    }
});
</script>

<style lang="scss">
.vs-search {
    &__results {
        display: flex;
        justify-content: space-between;
        margin: 2rem 0;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: 2rem;
        }
    }

    &__error--no-js {
        display: none;
    }
}

.no-js {
    .vs-search {
        &__container {
            display: none;
        }

        &__error--no-js {
            display: block;
        }
    }
}
</style>
