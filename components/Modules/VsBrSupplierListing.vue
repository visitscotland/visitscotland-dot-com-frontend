<template>
    <VsRow class="vs-br-supplier-listing">
        <VsCol
            cols="12"
            lg="4"
            xxl="3"
        >
            <div
                ref="resultsHeading"
                tabindex="-1"
                role="status"
                class="vs-br-supplier-listing__result-count"
            >
                <span v-if="pending">Loading suppliers…</span>
                <span v-else-if="error">Suppliers could not be loaded.</span>
                <span v-else-if="data">Results ({{ data.total }})</span>
            </div>
            <VsBrFilter
                :filter-id="`${id}-filters`"
                ref="filterPanel"
                :filters="typeFilters"
                @filter-updated="changeType"
            >
                <VsFilterSection type="list">
                    <label class="vs-br-supplier-listing__filter-field" :for="`${id}-search`">
                        Search suppliers
                        <input
                            :id="`${id}-search`"
                            :value="query.q"
                            @input="search"
                            type="search"
                            placeholder="Search supplier name"
                        >
                    </label>
                </VsFilterSection>
            </VsBrFilter>
        </VsCol>

        <VsCol
            cols="12"
            lg="8"
            xxl="9"
        >
            <div class="vs-br-supplier-listing__controls">
                <div
                    v-if="selectedFilters.length"
                    class="vs-br-supplier-listing__selected-filters"
                    aria-label="Selected filters"
                    role="group"
                >
                    <VsButton
                        type="button"
                        :rounded="false"
                        variant="primary"
                        size="md"
                        @click="clearAllFilters"
                    >
                        Clear all
                    </VsButton>

                    <VsButton
                        v-for="selectedFilter in selectedFilters"
                        :key="`${selectedFilter.key}-${selectedFilter.value}`"
                        type="button"
                        :rounded="false"
                        variant="secondary"
                        size="md"
                        icon="fa-regular fa-xmark"
                        icon-position="right"
                        :aria-label="`Remove filter: ${selectedFilter.label}`"
                        @click="removeSelectedFilter(selectedFilter)"
                    >
                        {{ selectedFilter.label }}
                    </VsButton>
                </div>
                <div class="vs-br-supplier-listing__sort">
                    <VsDropdown variant="secondary">
                        <template #button-content>
                            Sort by: {{ selectedSortLabel }}
                        </template>

                        <VsDropdownItem
                            v-for="option in sortOptions"
                            :key="option.key"
                            @click="changeSort(option.key)"
                        >
                            {{ option.label }}
                        </VsDropdownItem>
                    </VsDropdown>
                </div>
            </div>

            <div v-if="error">
                <button
                    type="button"
                    class="vs-br-supplier-listing__retry-button"
                    @click="refresh()"
                >
                    Try again
                </button>
            </div>

            <div
                v-else
                :aria-busy="pending"
            >
                <VsContainer
                    v-if="data?.results.length"
                    class="vs-br-supplier-listing__results"
                >
                    <VsRow>
                        <VsCol
                            v-for="supplier in data.results"
                            :key="supplier.id"
                            cols="12"
                            xl="6"
                            class="mb-150"
                        >
                            <VsBrSupplierCard :supplier="supplier" />
                        </VsCol>
                    </VsRow>
                </VsContainer>

                <p v-else-if="!pending">
                    No suppliers match your filters.
                </p>

                <VsPagination
                    v-if="numberOfPages > 1"
                    class="mt-300"
                    :model-value="data?.page || 1"
                    :number-of-pages="numberOfPages"
                    of-label="of"
                    page-label="Page"
                    next-button-label="Next"
                    previous-button-label="Previous"
                    :inert="pending"
                    @update:model-value="changePage"
                />
            </div>
        </VsCol>
    </VsRow>
</template>

<script setup lang="ts">

// TODO -- replace hard coded text with labels when hooked up to the CMS

import {
    computed, ref, useId, watch,
} from 'vue';

import { useFetch } from '#imports';

import {
    VsButton,
    VsDropdown,
    VsDropdownItem,
    VsFilterSection,
    VsPagination,
    VsContainer,
    VsRow,
    VsCol,
} from '@visitscotland/component-library/components';

import VsBrFilter from './VsBrFilter.vue';
import VsBrSupplierCard from './VsBrSupplierCard.vue';

import type { SupplierListingResponse } from '~/types/suppliers';


const id = useId();

const query = ref({
    q: '',
    type: [] as string[],
    sort: 'date',
    page: 1,
});

const sortOptions = [
    {
        key: 'date',
        label: 'New suppliers', 
    },
    {
        key: 'name',
        label: 'Alphabetical', 
    },
] as const;

const selectedSortLabel = computed(() => sortOptions.find((option) => option.key === query.value.sort)?.label);

const filterPanel = ref<InstanceType<typeof VsBrFilter>>();
const resultsHeading = ref<HTMLElement>();
const supplierTypes = ref<string[]>([]);

const { data, pending, error, refresh } = useFetch<SupplierListingResponse>('/api/suppliers', {
    key: `suppliers-${id}`,
    query,
});

watch(data, (response) => {
    if (response) supplierTypes.value = response.supplierTypes;
}, {
    immediate: true,
});

const typeFilters = computed(() => [{
    group: 'supplier-types',
    key: 'type',
    label: 'Supplier types',
    type: 'MULTISELECT',
    open: true,
    values: supplierTypes.value.map((type, index) => ({
        key: `supplier-type-${index}`,
        label: type,
    })),
}]);

type SelectedFilter = {
    key: 'q' | 'type';
    value: string;
    label: string;
};

const selectedFilters = computed<SelectedFilter[]>(() => [
    ...(query.value.q.trim() ? [{
        key: 'q' as const,
        value: query.value.q,
        label: `Name: ${query.value.q.trim()}`,
    }] : []),
    ...query.value.type.map((type) => ({
        key: 'type' as const,
        value: type,
        label: type,
    })),
]);

function removeSelectedFilter(selectedFilter: SelectedFilter) {
    if (selectedFilter.key === 'q') {
        query.value = {
            ...query.value,
            q: '',
            page: 1,
        };
        return;
    }

    const index = supplierTypes.value.indexOf(selectedFilter.value);
    if (index !== -1) filterPanel.value?.resetOne(`${id}-filters-supplier-type-${index}`);
    query.value = {
        ...query.value,
        type: query.value.type.filter((type) => type !== selectedFilter.value),
        page: 1,
    };
}

function clearAllFilters() {
    filterPanel.value?.resetAll();
    query.value = {
        q: '',
        type: [],
        sort: 'date',
        page: 1,
    };
}

const numberOfPages = computed(() => data.value ? Math.ceil(data.value.total / data.value.pageSize) : 0);

function search(event: Event) {
    query.value = {
        ...query.value,
        q: (event.target as HTMLInputElement).value,
        page: 1,
    };
}

function changeType(filter: { key: string, label: string }) {
    if (filter.key !== 'type') return;
    const selected = query.value.type;
    query.value = {
        ...query.value,
        type: selected.includes(filter.label)
            ? selected.filter((type) => type !== filter.label)
            : [...selected, filter.label],
        page: 1,
    };
}

function changeSort(sort: 'date' | 'name') {
    query.value = {
        ...query.value,
        sort,
        page: 1,
    };
}

function changePage(page: number) {
    if (pending.value || page === data.value?.page) return;
    query.value = {
        ...query.value,
        page,
    };
    resultsHeading.value?.focus({
        preventScroll: true,
    });
    resultsHeading.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
}
</script>

<style scoped>
.vs-br-supplier-listing__result-count {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0.25rem 0 1.75rem;
}

@media (max-width: 991.98px) {
    .vs-br-supplier-listing__result-count {
        margin: 1rem 0;
    }
}

.vs-br-supplier-listing__selected-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.vs-br-supplier-listing__controls {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.vs-br-supplier-listing__sort {
    grid-column: 2;
}

@media (max-width: 991px) {
    .vs-br-supplier-listing__controls {
        grid-template-columns: 1fr;
    }

    .vs-br-supplier-listing__sort {
        grid-column: 1;
    }
}

.vs-br-supplier-listing__filter-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.vs-br-supplier-listing input[type="search"],
.vs-br-supplier-listing select,
.vs-br-supplier-listing__retry-button {
    min-height: 2.75rem;
    padding: 0.5rem;
    font: inherit;
}

.vs-br-supplier-listing__filter-field input,
.vs-br-supplier-listing__filter-field select {
    width: 100%;
    min-width: 0;
}

.vs-br-supplier-listing__results {
    display: grid;
    gap: 1rem;
}
</style>
