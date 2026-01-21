<template>
    <VsContainer>
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
</script>
