<template>
    <VsRow class="vs-search-sort">
        <VsCol
            v-if="checkFlags('use-dropdown-location-filter')"
            class="vs-search-sort__location-filter"
            cols="12"
            md="3"
        >
            <VsRow>
                <label
                    class="vs-search-sort__label mb-025"
                    for="vs-search-sort__location-filter"
                >
                    Location
                </label>
                <VsBrDropdownWithSearch
                    @search-location-updated="updateLocation"
                />
            </VsRow>
        </VsCol>
        <VsCol
            class="vs-search-sort__date-picker-wrapper"
            cols="12"
            :md="checkFlags('use-dropdown-location-filter') ? 6 : 8"
        >
            <fieldset
                @change="(event) => debounceInput(event)"
            >
                <VsRow>
                    <VsCol
                        cols="6"
                    >
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
                    </VsCol>
                    <VsCol
                        cols="6"
                    >
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
                    </VsCol>
                </VsRow>
            </fieldset>
        </VsCol>
        <VsCol
            class="vs-search-sort__dropdown-wrapper"
            cols="12"
            :md="checkFlags('use-dropdown-location-filter') ? 3 : 4"
        >
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
        </VsCol>
    </VsRow>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';

import {
    VsCol,
    VsDropdown,
    VsDropdownItem,
    VsInput,
    VsRow,
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


function updateLocation(filter: any){
    console.log(filter);

    searchStore.selectedLocations = [];

    locations?.forEach((location) => {
        if (location.Key === filter.Key) {
            searchStore.selectedLocations.push(filter);
        }
    });

    searchStore.setUrlParameters();
}
</script>

<style lang="scss">
.vs-search-sort {
    &__label {
        font-weight: 300;
    }

    &__dropdown-wrapper, &__location-filter {
        display: flex;
        align-items: flex-end;

        button {
            /*Gives sort dropdown extra height to visually balance
            * with the date-pickers next to it */
            height: 50px;
        }

        @media (max-width: 768px) {
            display: block;
            margin-top: 1rem;

            button {
                width: 100%;
            }
        }
    }
}
</style>
