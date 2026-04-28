<template>
    <VsDropdown
        id="vs-search-sort__dropdown"
        name="vs-search-sort__dropdown"
        :text="searchStore.selectedLocations[0] ? searchStore.selectedLocations[0].Label : 'All of Scotland'"
        variant="secondary"
    >
        <VsDropdownItem
            v-for="filter in locations"
            :key="filter.Key"
            :active="searchStore.selectedLocations[0]?.Key === filter.Key"
            @click="$emit('search-location-updated', filter)"
        >
            {{ filter.Label }}
        </VsDropdownItem>
    </VsDropdown>
</template>

<script setup lang="ts">
import { inject } from 'vue';

import {
    VsDropdown,
    VsDropdownItem,
} from '@visitscotland/component-library/components';
import type { SearchFilterCategory } from '~/types/types';

import useSearchStore from '~/stores/searchStore';

const searchStore = useSearchStore();

defineEmits(['search-location-updated']);

const locations: SearchFilterCategory[] | undefined = inject('location-filters');
</script>

<style lang="scss">
    .dropdown-menu {
        max-height: 33dvh!important;
    } 
</style>