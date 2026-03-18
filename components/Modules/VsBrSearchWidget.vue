<template>
    <VsContainer>
        <VsBrSectionHeader
            v-if="module"
            :heading="module.title"
            :lede="module.description"
        />

        <VsBrSectionHeader
            v-else
            :heading="configStore.getLabel('search', 'search.widget-title')"
            :lede="configStore.getLabel('search', 'search.widget-label')"
        />

        <VsBrSearchInput
            class="mt-200"
            is-search-widget
            :autocomplete="module.mainCategory === 'events' ? false : true"
            :search-url="configStore.globalSearchPath"
            :placeholder="module.placeholder"
            :search-categories="module.subcategories"
        />
    </VsContainer>
</template>

<script setup lang="ts">
import { VsContainer } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import VsBrSectionHeader from './VsBrSectionHeader.vue';
import VsBrSearchInput from './VsBrSearchInput.vue';

const configStore = useConfigStore();

const props = defineProps({
    module: {
        type: Object,
        default: () => {},
    },
});
</script>
