<template>
    <VsContainer>
        <VsFederatedSearch
            :cludo-api-key="configStore.cludoExperienceId "
            :cludo-customer-id="configStore.cludoCustomerId"
            :cludo-engine-id="configStore.cludoEngineId"
            :events-api="configStore.eventsApiUrl"
            :filters="[]"
            :sub-filters="[]"
            :card-category-labels="[]"
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
        />
    </VsContainer>
</template>

<script setup>
// eslint-disable-next-line import/no-unresolved
import {
    VsContainer,
    VsFederatedSearch,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

</script>
