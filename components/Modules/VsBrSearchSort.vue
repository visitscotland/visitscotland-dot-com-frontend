<template>
    <div class="vs-search-sort">
        <div
            class="vs-search-sort__location-filter"
        >
            <label
                class="vs-search-sort__label mb-025"
                for="vs-search-sort__location-filter"
            >
                {{ configStore.getLabel('search', 'events.location-filter-title') }}
            </label>
            <VsBrDropdownWithSearch
                :items="locations"
                :selectedItems="searchStore.selectedLocations"
                @search-location-updated="updateLocation"
            />
        </div>
        <fieldset
            @change="(event) => debounceInput(event)"
        >
            <div class="vs-search-sort__date-filters">
                <div class="vs-search-sort__date-picker">
                    <label
                        class="vs-search-sort__label"
                        for="vs-search-sort__from-date"
                    >
                        {{ configStore.getLabel('search', 'date.from') }}
                    </label>
                    <VsInput
                        :auto-complete="false"
                        field-name="vs-search-sort__from-date"
                        type="date"
                        :value="searchStore.fromDate || new Date().toJSON().slice(0, 10)"
                        :validation-rules="{
                            min: new Date().toJSON().slice(0, 10),
                        }"
                    />
                </div>
                <div class="vs-search-sort__date-picker">
                    <label
                        class="vs-search-sort__label"
                        for="vs-search-sort__to-date"
                    >
                        {{ configStore.getLabel('search', 'date.to') }}
                    </label>
                    <VsInput
                        :auto-complete="false"
                        field-name="vs-search-sort__to-date"
                        type="date"
                        :value="searchStore.toDate || ''"
                        :validation-rules="{
                            min: searchStore.fromDate,
                        }"
                    />
                </div>
            </div>
        </fieldset>
        <div class="vs-search-sort__sort-by">
            <VsDropdown
                id="vs-search-sort__dropdown"
                name="vs-search-sort__dropdown"
                :text="dropdownText"
                variant="secondary"
            >
                <VsDropdownItem
                    v-for="(sortOption) in sortOptions"
                    :key="sortOption.key"
                    :active="searchStore.sortBy === sortOption.key"
                    @click="updateSortBy(sortOption.key)"
                >
                    {{ sortOption.label }}
                </VsDropdownItem>
            </VsDropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

import {
    VsDropdown,
    VsDropdownItem,
    VsInput,
} from '@visitscotland/component-library/components';

import debounce from '~/utls/debounce.ts';

import useConfigStore from '~/stores/configStore.ts';
import useSearchStore from '~/stores/searchStore.ts';
import type { SearchFilterCategory } from '~/types/types';

const configStore = useConfigStore();
const searchStore = useSearchStore();

const locations: SearchFilterCategory[] | undefined = inject('location-filters');


type SortOption = {
    key: string;
    label: string;
};

const sortOptions: SortOption[] = [
    {
        key: 'dateAsc',
        label: configStore.getLabel('search', 'sort.dateAsc'),
    },
    {
        key: 'priceAsc',
        label: configStore.getLabel('search', 'sort.priceAsc'),
    },
];

const dropdownText = computed(() => {
    const sortLabel = configStore.getLabel('search', 'sort');

    if (searchStore.sortBy) {
        const activeOption = sortOptions.find((option) => option.key === searchStore.sortBy);
        return `${sortLabel}: ${activeOption?.label}`;
    }

    return sortLabel;
});

const selLocs = computed(() => {
    const locationKeys: string[] = [];

    searchStore.selectedLocations.forEach((location) => {
        locationKeys.push(location.Key);
    });

    return locationKeys;
});

function updateFromDate(value: string) {
    searchStore.fromDate = value;
    searchStore.currentPage = 1;
    searchStore.setUrlParameters();
}

function updateToDate(value: string) {
    searchStore.toDate = value;
    searchStore.currentPage = 1;
    searchStore.setUrlParameters();
}

function updateSortBy(value: string) {
    searchStore.sortBy = value;
    searchStore.currentPage = 1;
    searchStore.setUrlParameters();
}

const debounceInput = debounce((event: Event) => {
    const idStem = 'vs-search-sort';

    if (!event.target) return;

    const id = event.target.id;

    if (id === `${idStem}__from-date`) {
        updateFromDate(event.target.value);
    } else if (id === `${idStem}__to-date`) {
        updateToDate(event.target.value);
    };
}, 750);


function updateLocation(filter: SearchFilterCategory){
    if(searchStore.selectedLocations.includes(filter)){
        searchStore.removeSelectedLocationByLocation(filter);
    } else {
        locations?.forEach((location) => {
            if (location.Key === filter.Key) {
                searchStore.selectedLocations.push(filter);
            }
        });
        searchStore.currentPage = 1;
        searchStore.setUrlParameters();
    }
}
</script>

<style lang="scss">

.vs-search-sort {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 1em 1em;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        margin-top: 1em;
        justify-content: flex-start;

        fieldset {
            width: 100%;
        }
    }

    &__label {
        font-weight: 300;
    }

    &__date-filters {
        display: flex;
        flex-direction: row;
        column-gap: 1em;

        @media (max-width: 768px) {
            flex-basis: 100%;
        }
    }

    &__date-picker {
        width: 100%;
    }

    &__sort-by, &__location-filter {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        flex-direction: column;

        button {
            /*Gives sort dropdown extra height to visually balance
            * with the date-pickers next to it */
            height: 50px;
        }

        @media (max-width: 768px) {
            display: block;
            flex-basis: 100%;

            #vs-search-sort__dropdown, #vs-search-sort__location-filter {
                width: 100%;
                text-align: center;
            }
        }
    }
}
</style>
