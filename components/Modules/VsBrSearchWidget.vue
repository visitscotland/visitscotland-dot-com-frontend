<template>
    <VsContainer v-if="module">
        <VsBrSectionHeader
            :heading="module.title"
            :lede="module.description"
        />

        <VsBrSearchInput
            class="mt-200"
            is-search-widget
            :is-event-widget="module?.mainCategory === 'events' ? true : false"
            :autocomplete="module?.mainCategory === 'events' ? false : true"
            :search-url="configStore.globalSearchPath"
            :placeholder="module?.placeholder"
            :search-btn-text="module?.button"
            :search-categories="module?.mainCategory === 'events' ? module.subcategories : module.categories"
        />
    </VsContainer>
    <VsContainer v-else>
        <VsBrSectionHeader
            :heading="configStore.getLabel('search', 'search.widget-title')"
            :lede="configStore.getLabel('search', 'search.widget-label')"
        />

        <VsBrSearchInput
            class="mt-200"
            is-search-widget
            :search-url="configStore.globalSearchPath"
        />
    </VsContainer>
</template>

<script setup lang="ts">
import { VsContainer } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import VsBrSectionHeader from './VsBrSectionHeader.vue';
import VsBrSearchInput from './VsBrSearchInput.vue';

const configStore = useConfigStore();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
    module: {
        type: Object,
        default: () => {},
    },
});
</script>
