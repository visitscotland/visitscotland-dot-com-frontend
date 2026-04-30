<template>
    <div
        v-if="checkFlags('dropdown-search-filter') && items.length > 0"
    > 
        <!-- New Dropdown with Search -->
        <VsButton
            variant="secondary"
            :rounded="false"
            class="vs-dropdown-with-search__trigger-button"
        >
            <VsIcon
                icon="fa-regular fa-location-dot"
                size="xs"
                class="me-025"
            />
            {{ dropdownText }}
            <VsIcon
                icon="fa-regular fa-chevron-down"
                size="xs"
            />
        </VsButton>
        <div class="vs-dropdown-with-search__dropdown">
            <div class="vs-dropdown-with-search__header">
                <label
                    class="vs-dropdown-with-search__search-label"
                    for="dropdown-search"
                >
                    <span class="visually-hidden">
                        Search for locations
                    </span>
                    <VsIcon
                        icon="fa-regular fa-magnifying-glass"
                        size="xs"
                    />
                </label>
                <VsInput
                    id="dropdown-search"
                    name="dropdown-search"
                    field-name="dropdown-search"
                    @updated="inputChanged"
                    class="vs-dropdown-with-search__input w-100"
                    placeholder="Search locations..."
                />
            </div>
            <VsBrDivider />
            <div class="vs-dropdown-with-search__body">
                <div
                    v-for="item in searchedItems"
                    :key="item.Key"
                    class="vs-dropdown-with-search__item"
                    @click="$emit('search-location-updated', item)"
                >
                    <VsCheckbox
                        :field-name="item.Key"
                        size="sm"
                        :value="selectedItems.includes(item) ? undefined : 'checked'"
                        @click="$emit('search-location-updated', item)"
                    />
                    <VsDetail
                        no-margins
                        size="small"
                        class="vs-dropdown-with-search__item-label"
                    >
                        {{ item.Label }}
                    </VsDetail>
                    <VsBadge
                        v-if="item.Count"
                        size="small"
                        variant="information"
                        class="vs-drodown-with-search__item-count ms-150"
                    >
                        0
                    </VsBadge>
                </div>
                <div v-if="searchedItems.length === 0">
                    <VsWarning size="small">
                        Couldn't find any locations, <br>
                        try searching for something else
                    </VsWarning>
                </div>
            </div>
            <div class="vs-dropdown-with-search__footer">
                <div class="vs-dropdown-with-search__selection-no">
                    <VsDetail
                        size="small"
                        color="secondary"
                        no-margins
                    >
                        <b>0</b> selected
                    </VsDetail>
                </div>
                <div class="vs-dropdown-with-search__footer-buttons">
                    <VsButton
                        variant="secondary"
                        size="sm"
                        disabled
                    >Clear</VsButton>
                    <VsButton
                        variant="primary"
                        size="sm"
                    >Apply</VsButton>
                </div>
            </div>    
        </div>
    </div>
    <VsDropdown
        v-else
        id="vs-search-sort__location-filter"
        name="vs-search-sort__dropdown"
        :text="dropdownText"
        variant="secondary"
        @click.prevent
    >
        <!-- Old Dropdown -->
        <VsDropdownItem
            v-for="filter in locations"
            :key="filter.Key"
            :active="searchStore.selectedLocations.includes(filter)"
            @click="$emit('search-location-updated', filter)"
        >
            <VsCheckbox
                :field-name="filter.Key"
                :label="filter.Label"
                size="sm"
                :value="searchStore.selectedLocations.includes(filter) ? undefined : 'checked'"
                @click.prevent
            />
        </VsDropdownItem>
    </VsDropdown>
</template>

<script setup lang="ts">
import {
    computed,
    inject,
    ref,
    watch,
} from 'vue';

import {
    VsBadge,
    VsButton,
    VsCheckbox,
    VsDetail,
    VsDropdown,
    VsDropdownItem,
    VsIcon,
    VsInput,
    VsWarning,
} from '@visitscotland/component-library/components';

import VsBrDivider from './VsBrDivider.vue';

import type { SearchFilterCategory } from '~/types/types';

import useSearchStore from '~/stores/searchStore.ts';
import useConfigStore from '~/stores/configStore.ts';

const searchStore = useSearchStore();
const configStore = useConfigStore();

// Legacy
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

// New
type Props = {
    items?: Array<SearchFilterCategory[]>;
    selectedItems?: Array<SearchFilterCategory[]>;
}

const {
    items = [],
    selectedItems = [],
} = defineProps<Props>();

const dropdownSearchInput = ref('');
const searchedItems = ref(items);

function inputChanged(event) {
    console.log(event);

    searchedItems.value = [];

    const isFound = items.some((item) => {
        if (item.Label.toLowerCase().includes(event.value.trim().toLowerCase())) {
            searchedItems.value.push(item);
        }
    });

    console.log(searchedItems.value);
}
</script>

<style lang="scss">
    // LEGACY
    .vs-search-sort__location-filter .dropdown-menu {
        max-height: 20em!important;
    } 

    // New
    .vs-dropdown-with-search {
        &__trigger-button {
            anchor-name: --dropdown-trigger;
        }

        &__dropdown {
            position: fixed;
            position-anchor: --dropdown-trigger;
            top: anchor(--dropdown-trigger bottom);
            left: anchor(left);
            z-index: 10;
            background: white;
            border: 1px solid grey;
            border-radius: 0.5em;
            margin-top: 0.25em;
            min-width: 20em;
        }

        &__header {
            display: flex;
            position: relative;
            z-index: 1;
            padding: 0.5em 0.5em 0 0.5em;

            & .vs-dropdown-with-search__header {
                flex-grow: 1;

                @media (min-width: 992px) {
                    margin-right: 1rem;
                }

                & label {
                    position: absolute;
                    top: 50%;
                    left: 0.75rem;
                    transform: translate(0, -50%);
                    z-index: 2;

                    @media (min-width: 992px) {
                        left: 1.5rem;
                    }
                }
            }
        }

        &__input {
            .vs-input.form-control {
                border-radius: 1000rem;
                margin: 0;
                padding: 0.75rem 1.25rem 0.75rem 2.5rem;

                &:focus {
                    border-color: #3369FF;
                    box-shadow: 0 0 0 2px #3369FF inset;
                    outline: none;
                }

                @media (min-width: 992px) {
                    font-size: 1rem;
                    height: 1.5rem;
                    padding: 1rem 1rem 1rem 3rem;
                }
            }
        }

        &__body {
            padding: 0;
            max-height: 10em;
            overflow-y: scroll;

            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-track {
                background: #F2F2F8;
                border-radius: 0.25rem;
                border-right: grey 1px solid;
            }

            &::-webkit-scrollbar-thumb {
                background: #1F49D6;
                border-radius: 0.25rem;
            }
        }

        &__item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.25em 0.75em;
            cursor: pointer;
            
            &-label {
                flex-grow: 1;
            }

            &:hover {
                background: #D6E5FF;
                color: #3369FF;
            }
        }

        &__footer {
            background: #E5E5F0; //vs-heather-10
            display: flex;
            justify-content: space-between;
            padding: 0.5em;
            align-items: center;
            border-radius: 0 0 0.5em 0.5em;

            &-buttons {
                display: flex;
                gap: 0.25em;

                button {
                    height: 2em!important;
                }
            }
        }
    }

</style>