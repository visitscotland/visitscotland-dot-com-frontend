<template>
    <VsDropdown
        id="vs-search-sort__location-filter"
        name="vs-search-sort__dropdown"
        :text="dropdownText"
        variant="secondary"
    >
        <VsDropdownItem
            v-for="filter in locations"
            :key="filter.Key"
            :active="searchStore.selectedLocations.includes(filter)"
            @click="$emit('search-location-updated', filter)"
        >
            <VsCheckbox
                field-name="filter.Key"
                :label="filter.Label"
                size="sm"
                :value="searchStore.selectedLocations.includes(filter) ? undefined : 'checked'"
                @click.prevent
            />
        </VsDropdownItem>
    </VsDropdown>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

import {
    VsCheckbox,
    VsDropdown,
    VsDropdownItem,
} from '@visitscotland/component-library/components';
import type { SearchFilterCategory } from '~/types/types';

import useSearchStore from '~/stores/searchStore';
import useConfigStore from '~/stores/configStore';

const searchStore = useSearchStore();
const configStore = useConfigStore();

defineEmits(['search-location-updated']);

const locations: SearchFilterCategory[] | undefined = inject('location-filters');

const dropdownText = computed(() => {
    if(searchStore.selectedLocations.length === 1) {
        return searchStore.selectedLocations[0]?.Label;
    } else if(searchStore.selectedLocations.length > 1) {
        return `${searchStore.selectedLocations[0]?.Label} +${searchStore.selectedLocations.length - 1}`;
    }
    return configStore.getLabel('search', 'events.all-locations');
});
</script>

<style lang="scss">
    .dropdown-menu {
        max-height: 33dvh!important;
    } 
</style>