<template>
    <VsRow class="vs-search-sort">
        <VsCol
            cols="6"
            md="4"
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
                @input="updateFromDate($event.target.value)"
            />
        </VsCol>
        <VsCol
            cols="6"
            md="4"
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
                @input="updateToDate($event.target.value)"
            />
        </VsCol>
        <VsCol
            class="vs-search-sort__dropdown-wrapper"
            cols="12"
            md="4"
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
import { computed, onMounted } from 'vue';

import {
    VsCol,
    VsDropdown,
    VsDropdownItem,
    VsInput,
    VsRow,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import useSearchStore from '~/stores/searchStore.ts';

const configStore = useConfigStore();
const searchStore = useSearchStore();

const route = useRoute();

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
    searchStore.navigationSomething();
}

function updateToDate(value: string) {
    searchStore.toDate = value;
    searchStore.navigationSomething();
}

function updateSortBy(value: string) {
    searchStore.sortBy = value;
    searchStore.navigationSomething();
}

onMounted(() => {
    searchStore.fromDate = route.query['from-date'] as string;
    searchStore.toDate = route.query['to-date'] as string;
    searchStore.sortBy = route.query['sort-by'] as string;
});
</script>

<style lang="scss">
.vs-search-sort {
    &__label {
        font-weight: 300;
    }

    &__dropdown-wrapper {
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
