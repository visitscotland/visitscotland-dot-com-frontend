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
    <VsContainer
        v-else
    >
        <VsFederatedSearch
            :cludo-api-key="configStore.cludoExperienceId "
            :cludo-customer-id="customerId"
            :cludo-engine-id="engineId"
            :events-api="configStore.eventsApiUrl"
            :filters="orderedCategories"
            :sub-filters="orderedFilters"
            :card-category-labels="configStore.getLabelMap('content.categories')"
            :pagination-labels="{
                nextButtonLabel: configStore.getLabel('essentials.pagination', 'page.next'),
                previousButtonLabel: configStore.getLabel('essentials.pagination', 'page.previous'),
                pageLabel: configStore.getLabel('essentials.pagination', 'page.page'),
                ofLabel: configStore.getLabel('essentials.pagination', 'page.of'),
            }"
            :search-labels="{
                refine: configStore.getLabel('search', 'refine'),
                search: configStore.getLabel('search', 'search'),
                searchLabel: configStore.getLabel('search', 'search-label'),
                searchResults: configStore.getLabel('search', 'search.results'),
                resultsFirst: configStore.getLabel('search', 'results.first-sentence'),
                resultsSecond: configStore.getLabel('search', 'results.second-sentence'),
                noJs: configStore.getLabel('search', 'no-js'),
            }"
            :sort-labels="{
                dateFrom: configStore.getLabel('search', 'date.from'),
                dateTo: configStore.getLabel('search', 'date.to'),
                sort: configStore.getLabel('search', 'sort'),
                sortOptions: [
                    {
                        key: 'dateAsc',
                        label: configStore.getLabel('search', 'sort.dateAsc'),
                    },
                    {
                        key: 'priceAsc',
                        label: configStore.getLabel('search', 'sort.priceAsc'),
                    },
                ],
            }"
            :error-messages="{
                noResults: configStore.getLabel('search', 'no-results'),
                incorrectDateOrder: configStore.getLabel('search', 'error.date'),
                cludoError: configStore.getLabel('search', 'error.cludo'),
                eventError: configStore.getLabel('search', 'error.events'),
            }"
            :from-text="configStore.getLabel('search', 'price.from')"
        >
            <!-- <template
                v-for="(index, item) in modules"
                :key="index"
                #:[`federated-search__spotlight-${module.hippoBean.name}`]
            >
                <VsBrModuleBuilder
                    :modules="item"
                />
            </template> -->
        </VsFederatedSearch>
    </VsContainer>
</template>

<script setup>

import {
    VsEmbedWrapper, VsContainer, VsFederatedSearch,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

let engineId = 0;
let customerId = 0;

if (configStore.cludoEngineId) {
    engineId = parseInt(configStore.cludoEngineId, 10);
    customerId = parseInt(configStore.cludoCustomerId, 10);
}

const categories = configStore.getLabelMap('search-categories');
const orderedCategories = [];

Object.keys(categories).forEach((key) => {
    orderedCategories.push({
        Key: key,
        Label: categories[key],
    });
});

const filters = configStore.getLabelMap('search-events-filters');
const orderedFilters = [];

Object.keys(filters).forEach((key) => {
    orderedFilters.push({
        Key: key,
        Label: filters[key],
    });
});

</script>
