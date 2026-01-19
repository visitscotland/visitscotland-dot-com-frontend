<template>
    <div>
        <VsBrSearchFilter
            :active-filter="searchStore.categoryKey"
            :filter-categories="orderedCategories"
            wrap
            @filter-updated="updateCategoryKey"
        />

        <VsBrSearchFilter
            v-if="searchStore.categoryKey === 'events'"
            :active-filter="searchStore.subcategoryKeys"
            class="mt-200"
            :filter-categories="orderedSubcategories"
            :heading="configStore.getLabel('search', 'refine')"
            @filter-updated="updateSubcategoryKey"
        />

        <VsDivider />

        <VsBrSearchSort />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import useConfigStore from '~/stores/configStore.ts';
import useSearchStore from '~/stores/searchStore.ts';

import VsBrSearchSort from './VsBrSearchSort.vue';
import VsBrSearchFilter from './VsBrSearchFilter.vue';

const configStore = useConfigStore();
const searchStore = useSearchStore();

const route = useRoute();

type FilterCategory = {
    Key: string;
    Label: string;
    icon?: string;
};

const categories = configStore.getLabelMap('search-categories');
const orderedCategories = ref<FilterCategory[]>([]);

Object.keys(categories).forEach((key) => {
    orderedCategories.value.push({
        Key: key,
        Label: categories[key],
    });
});

const subcategories = configStore.getLabelMap('search-events-filters');
const orderedSubcategories = ref<FilterCategory[]>([]);

Object.keys(subcategories).forEach((key) => {
    orderedSubcategories.value.push({
        Key: key,
        Label: subcategories[key],
    });
});

function updateCategoryKey(category: FilterCategory) {
    searchStore.subcategoryKeys = [];
    searchStore.fromDate = undefined;
    searchStore.toDate = undefined;
    searchStore.sortBy = undefined;

    searchStore.categoryKey = searchStore.categoryKey !== category.Key
        ? category.Key
        : undefined;

    searchStore.navigationSomething();
}

function updateSubcategoryKey(category: FilterCategory) {
    if (!searchStore.subcategoryKeys.includes(category.Key)) {
        searchStore.subcategoryKeys.push(category.Key);
    } else {
        const index = searchStore.subcategoryKeys.indexOf(category.Key);

        if (index >= 0) {
            searchStore.subcategoryKeys.splice(index, 1);
        }
    }
    searchStore.navigationSomething();
}

onMounted(() => {
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
