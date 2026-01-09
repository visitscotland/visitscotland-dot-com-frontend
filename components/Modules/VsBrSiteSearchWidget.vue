<template>
    <VsContainer>
        <VsBrSectionHeader
            :heading="configStore.getLabel('search', 'search.widget-title')"
            :lede="configStore.getLabel('search', 'search.widget-label')"
        />

        <VsFederatedSearchInput
            :cludo-api-key="configStore.cludoExperienceId "
            :cludo-customer-id="customerId"
            :cludo-engine-id="engineId"
            is-home-page
            :filters="orderedCategories"
            :search-url="configStore.globalSearchPath"
            :labels="{
                refine: configStore.getLabel('search', 'refine'),
                search: configStore.getLabel('search', 'search'),
                searchLabel: configStore.getLabel('search', 'search-label'),
                searchResults: configStore.getLabel('search', 'search.results'),
                resultsFirst: configStore.getLabel('search', 'results.first-sentence'),
                resultsSecond: configStore.getLabel('search', 'results.second-sentence'),
                noJs: configStore.getLabel('search', 'no-js'),
            }"
        />
    </VsContainer>
</template>

<script setup lang="ts">
import {
    VsContainer,
    VsFederatedSearchInput,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import VsBrSectionHeader from './VsBrSectionHeader.vue';

const configStore = useConfigStore();

let engineId = 0;
let customerId = 0;

if (configStore.cludoEngineId) {
    engineId = parseInt(configStore.cludoEngineId, 10);
    customerId = parseInt(configStore.cludoCustomerId, 10);
}

const categories = configStore.getLabelMap('search-categories');
const orderedCategories : any[] = [];

Object.keys(categories).forEach((key) => {
    orderedCategories.push({
        Key: key,
        Label: categories[key],
    });
});

</script>
