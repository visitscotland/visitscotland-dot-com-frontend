<template>
    <VsContainer>
        <VsFederatedSearchInput
            :cludo-api-key="configStore.cludoExperienceId "
            :cludo-customer-id="configStore.cludoCustomerId"
            :cludo-engine-id="configStore.cludoEngineId"
            is-home-page
            :filters="[]"
            :search-url="configStore.globalSearchUrl"
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

const configStore = useConfigStore();

</script>
