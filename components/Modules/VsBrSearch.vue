<template>
    <div>
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
</template>

<script setup lang="ts">
import type { Page } from '@bloomreach/spa-sdk';

import { inject, onMounted } from 'vue';
import {
    VsDetail,
    VsHeading,
    VsLoadingSpinner,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import useSearchStore from '~/stores/searchStore.ts';

import VsBrDivider from './VsBrDivider.vue';
import VsBrModuleBuilder from './VsBrModuleBuilder.vue';
import VsBrSearchInput from './VsBrSearchInput.vue';
import VsBrSearchResultsDisplay from './VsBrSearchResultsDisplay.vue';
import VsBrSearchSort from './VsBrSearchSort.vue';

const page: Page | undefined = inject('page');
const configStore = useConfigStore();
const searchStore = useSearchStore();

const route = useRoute();

type Props = {
    modules: any[];
};

const { modules } = defineProps<Props>();

const moduleNames = [];

for (let x = 0; x < modules.length; x++) {
    const hippoBean = page?.getContent(modules[x].hippoBean.$ref);

    moduleNames.push(hippoBean.model.data.name);
}

onMounted(() => {
    // Set API query parameters using the URL parameters.
    searchStore.searchTerm = route.query['search-term'] as string;
    searchStore.categoryKey = route.query.category as string;

    if (route.query.subcategories) {
        const routeSubcategories = route.query.subcategories as string;

        searchStore.subcategoryKeys = routeSubcategories.split(',');
    }

    searchStore.currentPage = Number(route.query.page);
    searchStore.fromDate = route.query['from-date'] as string;
    searchStore.toDate = route.query['to-date'] as string;
    searchStore.sortBy = route.query['sort-by'] as string;
    searchStore.location = route.query.location as string;
    searchStore.postcode = route.query.postcode as string;
    searchStore.postcodeareas = route.query.postcodeareas as string;
    searchStore.radius = Number(route.query.radius);

    searchStore.getSearchResults();
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
}
</style>
