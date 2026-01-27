<template>
    <VsBrSectionHeader
        :heading="categories.title"
        :lede="categories.copy?.value"
    />
    <VsBrCategoryGrid
        v-if="configStore.pageIntro && configStore.pageIntro.categorySection"
        :links="configStore.pageIntro.categorySection.links"
    />
</template>

<script lang="ts" setup>
import useConfigStore from '~/stores/configStore.ts';

import VsBrSectionHeader from './VsBrSectionHeader.vue';
import VsBrCategoryGrid from './VsBrCategoryGrid.vue';

const configStore = useConfigStore();

const props = defineProps<{
    categories: any,
}>();

const { categories } = props;

</script>
