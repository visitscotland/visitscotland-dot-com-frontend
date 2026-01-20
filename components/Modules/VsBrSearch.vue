<template>
    <div>
        <VsBrSearchInput />

        <VsDivider />

        <VsBrSearchSort />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import useSearchStore from '~/stores/searchStore.ts';

import VsBrSearchInput from './VsBrSearchInput.vue';
import VsBrSearchSort from './VsBrSearchSort.vue';

const searchStore = useSearchStore();

const route = useRoute();

onMounted(() => {
    searchStore.searchTerm = route.query['search-term'] as string;
    searchStore.categoryKey = route.query.category as string;

    if (route.query.subcategories) {
        const routeSubcategories = route.query.subcategories as string;

        searchStore.subcategoryKeys = routeSubcategories.split(',');
    }

    searchStore.fromDate = route.query['from-date'] as string;
    searchStore.toDate = route.query['to-date'] as string;
    searchStore.sortBy = route.query['sort-by'] as string;
});
</script>
