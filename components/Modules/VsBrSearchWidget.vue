<template>
    <VsContainer>
        <VsBrSectionHeader
            v-if="module?.title && !isSiteSearchPage"
            :heading="module?.title"
            :lede="module?.introduction.value"
        />

        <VsBrSearchInput
            class="mt-200"
            :is-search-widget="!isSiteSearchPage"
            :is-event-widget="module?.mainCategory === 'events' ? true : false"
            :autocomplete="module?.mainCategory === 'events' ? false : true"
            :search-url="configStore.globalSearchPath"
            :placeholder="module?.placeholder"
            :search-btn-text="module?.button"
            :search-categories="module?.mainCategory === 'events' ? module?.subcategories : module?.categories"
        />
    </VsContainer>
</template>

<script setup lang="ts">
import { useRoute } from '#app';
import { computed } from 'vue';
import { VsContainer } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import VsBrSectionHeader from './VsBrSectionHeader.vue';
import VsBrSearchInput from './VsBrSearchInput.vue';

const configStore = useConfigStore();

const route = useRoute();
const isSiteSearchPage = computed(
    () => !!configStore.globalSearchPath && route.path === configStore.globalSearchPath,
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
    module: {
        type: Object,
        default: () => {},
    },
});
</script>
