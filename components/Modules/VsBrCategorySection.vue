<template>
    <VsBrSectionHeader
        :heading="categories.title"
        :lede="categories.copy?.value"
    />
    <VsBrCategoryGrid
        :links="categories.links"
    />
</template>

<script lang="ts" setup>

import VsBrSectionHeader from './VsBrSectionHeader.vue';
import VsBrCategoryGrid from './VsBrCategoryGrid.vue';

const props = defineProps<{
    categories: any,
}>();

const { categories } = props;

console.log(categories);

</script>
