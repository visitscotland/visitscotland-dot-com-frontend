<template>
    <div class="vs-search-input">
        <div class="vs-search__input">
            <div class="vs-search__text-input">
                <label
                    class="vs-search__label"
                    for="site-search"
                >
                    <span class="visually-hidden">
                        {{ configStore.getLabel('search', 'search-label') }}
                    </span>
                    <VsIcon
                        icon="fa-regular fa-magnifying-glass"
                        size="xs"
                    />
                </label>
                <VsInput
                    :auto-complete="false"
                    class="vs-search__input w-100"
                    field-name="site-search"
                    name="searchrequest"
                    :placeholder="configStore.getLabel('search', 'search-label')"
                    type="search"
                    :value="searchStore.searchTerm"
                    @input="updateSearchTerm($event.target.value)"
                    @keyup.enter="search"
                />
            </div>
            <VsButton
                class="d-none d-lg-block px-200"
                :disabled="isLoading"
                :href="searchLink"
                @click="search"
            >
                {{ configStore.getLabel('search', 'search') }}
            </VsButton>
        </div>

        <div
            v-if="searchSuggestions && searchSuggestions.length > 0"
            class="position-relative mt-050"
        >
            <div class="vs-search-input__autocomplete">
                <VsList unstyled>
                    <li
                        v-for="suggestion in searchSuggestions"
                        :key="suggestion"
                        class="vs-search-input__autocomplete__suggestion"
                        @click="suggestedSearch(suggestion)"
                        @keyup.enter="suggestedSearch(suggestion)"
                        tabindex="0"
                        v-html="highlightAutocompleteSuggestion(suggestion)"
                    />
                </VsList>
            </div>
        </div>

        <VsBrSearchFilter
            :active-filter="searchStore.categoryKey"
            class="mt-200"
            :filter-categories="orderedCategories"
            :is-search-widget
            ref="categoryFilter"
            wrap
            @filter-updated="updateCategoryKey"
        />

        <VsBrSearchFilter
            v-if="searchStore.categoryKey === 'events' && !isSearchWidget"
            :active-filter="searchStore.subcategoryKeys"
            class="mt-200"
            :filter-categories="orderedSubcategories"
            :heading="configStore.getLabel('search', 'refine')"
            ref="subcategoryFilter"
            @filter-updated="updateSubcategoryKey"
        />
    </div>
</template>

<script setup lang="ts">
import type { SearchApiError, SearchFilterCategory } from '~/types/types';

import {
    computed,
    ref,
    watch,
} from 'vue';
import { storeToRefs } from 'pinia';

import useConfigStore from '~/stores/configStore.ts';
import useSearchStore from '~/stores/searchStore.ts';

import dataLayerComposable from '~/composables/dataLayer.ts';

import {
    VsButton,
    VsIcon,
    VsInput,
    VsList,
} from '@visitscotland/component-library/components';

import VsBrSearchFilter from './VsBrSearchFilter.vue';

const configStore = useConfigStore();
const searchStore = useSearchStore();
const dataLayerHelper = dataLayerComposable();

// eslint-disable-next-line no-undef
const route = useRoute();
const categoryFilter = ref<any>(null);
const subcategoryFilter = ref<any>(null);

type Props = {
    isSearchWidget?: boolean;
}

const { isSearchWidget = false } = defineProps<Props>();

const { isLoading } = storeToRefs(searchStore);

const searchSuggestions = ref<string[]>([]);

async function updateSearchTerm(term: string) {
    searchStore.searchTerm = term.trim();

    if (searchStore.searchTerm && route.query['search-term'] !== searchStore.searchTerm) {
        // eslint-disable-next-line no-undef
        const response: { suggestions: string[], error: SearchApiError } = await $fetch('/api/search/cludo-autocomplete', {
            method: 'post',
            body: {
                searchTerm: searchStore.searchTerm,
                cludoApiKey: configStore.cludoExperienceId,
                cludoCustomerId: parseInt(configStore.cludoCustomerId, 10),
                cludoEngineId: parseInt(configStore.cludoEngineId, 10),
            },
        });

        searchSuggestions.value = response.suggestions;

        if (response.error) {
            console.error(response.error.message);
        }
    }

    if (!searchStore.searchTerm) {
        searchSuggestions.value = [];
    }
}

async function search() {
    searchSuggestions.value = [];
    searchStore.currentPage = 1;
    searchStore.fromDate = searchStore.categoryKey === 'events'
        ? new Date().toJSON().slice(0, 10)
        : undefined;
    searchStore.toDate = undefined;
    searchStore.sortBy = undefined;

    await searchStore.setUrlParameters();

    dataLayerHelper.createDataLayerObject('siteSearchUsageEvent', {
        search_query: searchStore.searchTerm,
        query_input: searchStore.queryInput,
        results_count: searchStore.totalResults,
        search_usage_index: searchStore.searchInSessionCount,
        search_type: searchStore.searchInSessionCount === 1 ? 'initial' : 'follow-up',
    });
}

function autoSuggestAnalytics(suggestion: string) {
    dataLayerHelper.createDataLayerObject('siteSearchClickEvent', {
        interaction_type: 'search_autosuggest',
        search_query: searchStore.searchTerm,
        page_number: searchStore.currentPage,
        search_usage_index: searchStore.searchInSessionCount,
        results_count: searchStore.totalResults,
        click_text: suggestion,
        query_input: searchStore.queryInput,
    });
}

async function suggestedSearch(suggestion: string) {
    searchStore.searchTerm = suggestion;
    searchSuggestions.value = [];

    if (isSearchWidget) {
        // `external: true` is required here to force a full page reload.
        await navigateTo(`${configStore.globalSearchPath}?search-term=${suggestion}`, {
            external: true,
        });
    } else {
        searchStore.setUrlParameters(true);
    }

    autoSuggestAnalytics(suggestion);
}

function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(str: string) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function highlightAutocompleteSuggestion(suggestion: string) {
    const term = (searchStore.searchTerm || '').trim();
    if (!term) return escapeHtml(suggestion);
    const reg = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    return escapeHtml(suggestion).replace(reg, '<strong>$1</strong>');
}

function categoryClickAnalytics(category: SearchFilterCategory) {
    dataLayerHelper.createDataLayerObject('siteSearchClickEvent', {
        interaction_type: 'facet_click',
        search_query: searchStore.searchTerm,
        page_number: searchStore.currentPage,
        search_usage_index: searchStore.searchInSessionCount,
        results_count: searchStore.totalResults,
        click_text: category.Label || category.Key,
    });
}

const categories = configStore.getLabelMap('search-categories');
const orderedCategories = ref<SearchFilterCategory[]>([]);

Object.keys(categories).forEach((key) => {
    orderedCategories.value.push({
        Key: key,
        Label: categories[key],
    });
});

const subcategories = configStore.getLabelMap('search-events-filters');
const orderedSubcategories = ref<SearchFilterCategory[]>([]);

Object.keys(subcategories).forEach((key) => {
    orderedSubcategories.value.push({
        Key: key,
        Label: subcategories[key],
    });
});

async function updateCategoryKey(category: SearchFilterCategory) {
    searchStore.currentPage = 1;
    searchStore.subcategoryKeys = [];
    searchStore.fromDate = category.Key === 'events'
        ? new Date().toJSON().slice(0, 10)
        : undefined;
    searchStore.toDate = undefined;
    searchStore.sortBy = undefined;

    searchStore.categoryKey = searchStore.categoryKey !== category.Key
        ? category.Key
        : undefined;

    await searchStore.setUrlParameters();

    categoryClickAnalytics(category);
}

async function updateSubcategoryKey(category: SearchFilterCategory) {
    if (!searchStore.subcategoryKeys.includes(category.Key)) {
        searchStore.subcategoryKeys.push(category.Key);
    } else {
        const index = searchStore.subcategoryKeys.indexOf(category.Key);

        if (index >= 0) {
            searchStore.subcategoryKeys.splice(index, 1);
        }
    }
    await searchStore.setUrlParameters();

    categoryClickAnalytics(category);
}

const searchLink = computed(() => {
    if (!isSearchWidget) return null;

    return searchStore.searchTerm
        ? `${configStore.globalSearchPath}?search-term=${searchStore.searchTerm}`
        : configStore.globalSearchPath;
});

// Reset the filter scroll when a search has run (isLoading is set from true to false).
watch(isLoading, (newValue) => {
    if (!newValue) {
        categoryFilter.value?.resetScroll();
        subcategoryFilter.value?.resetScroll();
    }
});
</script>

<style lang="scss">
.vs-search-input {
    margin-bottom: 2rem;

    .vs-search__input {
        display: flex;
        position: relative;
        z-index: 1;

        & .vs-search__text-input {
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
                font-size: 1.25rem;
                height: 3rem;
                padding: 1rem 1rem 1rem 4rem;
            }
        }
    }

    &__autocomplete {
        background-color: #FFFFFF;
        border: 1px solid #E9E9E9;
        margin: 0 auto;
        position: absolute;
        width: 90%;
        z-index: 10;

        @media (max-width: 992px) {
            right: 0;
            width: 100%;
        }

        &__suggestion {
            cursor: pointer;
            padding: 0.50rem 0.50rem;
            text-decoration: none;

            &:hover {
                background: #D6E5FF;
            }

            &:focus{
                border-color: #3369FF;
                box-shadow: 0 0 0 2px #3369FF inset;
                outline: none;
            }
        }
    }
}
</style>
