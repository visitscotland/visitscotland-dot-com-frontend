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
                    debounce="500"
                    @updated="updateSearchTerm"
                    @keyup.enter="search"
                />
            </div>
            <VsButton
                class="d-none d-lg-block px-200"
                :disabled="isLoading"
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
            wrap
            @filter-updated="updateCategoryKey"
        />

        <VsBrSearchFilter
            v-if="searchStore.categoryKey === 'events'"
            :active-filter="searchStore.subcategoryKeys"
            class="mt-200"
            :filter-categories="orderedSubcategories"
            :heading="configStore.getLabel('search', 'refine')"
            @filter-updated="updateSubcategoryKey"
        />
    </div>
</template>

<script setup lang="ts">
import {
    onMounted, ref, watch,
} from 'vue';
import { storeToRefs } from 'pinia';

import useConfigStore from '~/stores/configStore.ts';
import useSearchStore from '~/stores/searchStore.ts';

import {
    VsButton,
    VsIcon,
    VsInput,
    VsList,
} from '@visitscotland/component-library/components';

import VsBrSearchFilter from './VsBrSearchFilter.vue';

// import dataLayerComposable from '../composables/dataLayerComposable';

// const dataLayerHelper = dataLayerComposable();
const configStore = useConfigStore();
const searchStore = useSearchStore();

const route = useRoute();

type Props = {
    cludoApiKey?: string;
    cludoCustomerId?: number;
    cludoEngineId?: number;
    isSearchWidget?: boolean;
    searchUrl?: string;
}

const {
    cludoApiKey,
    cludoCustomerId,
    cludoEngineId,
    isSearchWidget = false,
    searchUrl,
} = defineProps<Props>();

const { isLoading } = storeToRefs(searchStore);

const searchSuggestions = ref([]);
// const categoryFilter = ref(null);
// const subcategoryFilter = ref(null);

async function updateSearchTerm(event: { field: string; value: string }) {
    // Should the page be reset here??
    searchStore.currentPage = 1;
    searchStore.searchTerm = event.value.trim();

    if (searchStore.searchTerm && route.query['search-term'] !== searchStore.searchTerm) {
        searchSuggestions.value = await $fetch('/api/search/cludo-autocomplete', {
            method: 'post',
            body: {
                searchTerm: searchStore.searchTerm,
                cludoApiKey: configStore.cludoExperienceId,
                cludoCustomerId: parseInt(configStore.cludoCustomerId, 10),
                cludoEngineId: parseInt(configStore.cludoEngineId, 10),
            },
        });
    }

    // const url = window.location.search;
    // const params = new URLSearchParams(url);

    // if (federatedSearchStore.searchTerm && params.get('search-term') !== federatedSearchStore.searchTerm) {
    //     searchSuggestions.value = await federatedSearchStore.getAutoComplete();
    // }

    // if (!federatedSearchStore.searchTerm) {
    //     searchSuggestions.value = null;
    // }
}

async function search() {
    searchSuggestions.value = [];
    await searchStore.navigationSomething();

    // dataLayerHelper.createDataLayerObject('siteSearchUsageEvent', {
    //     search_query: federatedSearchStore.searchTerm,
    //     query_input: federatedSearchStore.queryInput,
    //     results_count: federatedSearchStore.totalResults,
    //     search_usage_index: federatedSearchStore.searchInSessionCount,
    //     search_type: federatedSearchStore.searchInSessionCount === 1 ? 'initial' : 'follow-up',
    // });
}

function autoSuggestAnalytics(suggestion) {
    // dataLayerHelper.createDataLayerObject('siteSearchClickEvent', {
    //     interaction_type: 'search_autosuggest',
    //     search_query: federatedSearchStore.searchTerm,
    //     page_number: federatedSearchStore.currentPage,
    //     search_usage_index: federatedSearchStore.searchInSessionCount,
    //     results_count: federatedSearchStore.totalResults,
    //     click_text: suggestion,
    //     query_input: federatedSearchStore.queryInput,
    // });
}

function suggestedSearch(query) {
    console.log('suggestedSearch');
    // federatedSearchStore.searchTerm = query;
    // searchSuggestions.value = null;
    // federatedSearchStore.navigateToResultsPage(false, true);
    // autoSuggestAnalytics(query);
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

function categoryClickAnalytics(category) {
    // dataLayerHelper.createDataLayerObject('siteSearchClickEvent', {
    //     interaction_type: 'facet_click',
    //     search_query: federatedSearchStore.searchTerm,
    //     page_number: federatedSearchStore.currentPage,
    //     search_usage_index: federatedSearchStore.searchInSessionCount,
    //     results_count: federatedSearchStore.totalResults,
    //     click_text: category.Label || category.Key,
    // });
}

type FilterCategory = {
    Key: string;
    Label: string;
    icon?: string;
};

const categories = configStore.getLabelMap('search-categories');
const orderedCategories = ref<FilterCategory[]>([]);

Object.keys(categories).forEach((key) => {
    orderedCategories.value.push({
        Key: key,
        Label: categories[key],
    });
});

const subcategories = configStore.getLabelMap('search-events-filters');
const orderedSubcategories = ref<FilterCategory[]>([]);

Object.keys(subcategories).forEach((key) => {
    orderedSubcategories.value.push({
        Key: key,
        Label: subcategories[key],
    });
});

function updateCategoryKey(category: FilterCategory) {
    searchStore.currentPage = 1;
    searchStore.subcategoryKeys = [];
    searchStore.fromDate = undefined;
    searchStore.toDate = undefined;
    searchStore.sortBy = undefined;

    searchStore.categoryKey = searchStore.categoryKey !== category.Key
        ? category.Key
        : undefined;

    searchStore.navigationSomething();
}

function updateSubcategoryKey(category: FilterCategory) {
    if (!searchStore.subcategoryKeys.includes(category.Key)) {
        searchStore.subcategoryKeys.push(category.Key);
    } else {
        const index = searchStore.subcategoryKeys.indexOf(category.Key);

        if (index >= 0) {
            searchStore.subcategoryKeys.splice(index, 1);
        }
    }
    searchStore.navigationSomething();
}

// async function updateSelectedCategory(category) {
//     const url = new URL(window.location);

//     // Reset to page 1
//     url.searchParams.delete('page');
//     federatedSearchStore.currentPage = 1;

//     // Reset dates
//     url.searchParams.delete('start-date');
//     url.searchParams.delete('end-date');
//     federatedSearchStore.startDate = '';
//     federatedSearchStore.endDate = '';

//     // Reset sort options
//     federatedSearchStore.sortBy = undefined;

//     // Reset sub category
//     federatedSearchStore.selectedSubCategory = [];
//     federatedSearchStore.selectedSubCategoryKey = [];

//     federatedSearchStore.selectedCategory = (federatedSearchStore.selectedCategory
//         !== category.Label)
//         ? category.Label
//         : '';

//     federatedSearchStore.selectedCategoryKey = (federatedSearchStore.selectedCategoryKey
//         !== category.Key)
//         ? category.Key
//         : '';

//     await federatedSearchStore.navigateToResultsPage(true);

//     categoryClickAnalytics(category);
// }

// function updateSelectedSubCategoryKey(category) {
//     if (!federatedSearchStore.selectedSubCategoryKey.includes(category.Key)) {
//         federatedSearchStore.selectedSubCategory.push(category.Label);
//         federatedSearchStore.selectedSubCategoryKey.push(category.Key);
//     } else {
//         const index = federatedSearchStore.selectedSubCategoryKey.indexOf(category.Key);

//         if (index >= 0) {
//             federatedSearchStore.selectedSubCategory.splice(index, 1);
//             federatedSearchStore.selectedSubCategoryKey.splice(index, 1);
//         }
//     }

//     federatedSearchStore.navigateToResultsPage(true);

//     categoryClickAnalytics(category);
// }

onMounted(() => {
    // federatedSearchStore.cludoCredentials = {
    //     apiKey: props.cludoApiKey,
    //     customerId: props.cludoCustomerId,
    //     engineId: props.cludoEngineId,
    // };
    // federatedSearchStore.isHomePage = props.isHomePage;

    // if (props.searchUrl) {
    //     federatedSearchStore.searchUrl = props.searchUrl;
    // }

    // const url = window.location.search;
    // const params = new URLSearchParams(url);

    // if (params.has('search-term')) {
    //     federatedSearchStore.searchTerm = params.get('search-term');
    // }

    // if (params.has('category')) {
    //     federatedSearchStore.selectedCategoryKey = decodeURIComponent(params.get('category'));
    // }

    // if (params.has('sub-category')) {
    //     const subCategories = decodeURIComponent(params.get('sub-category')).split(',');
    //     subCategories.forEach((subCategory) => (
    //         federatedSearchStore.selectedSubCategoryKey.push(subCategory)
    //     ));
    // }

    // if (params.has('category') && params.get('category') === 'events' && params.has('sort-by')) {
    //     federatedSearchStore.sortBy = params.get('sort-by');
    // }

    // if (params.has('start-date')) {
    //     federatedSearchStore.startDate = params.get('start-date');
    // }

    // if (params.has('end-date')) {
    //     federatedSearchStore.endDate = params.get('end-date');
    // }

    // if (params.has('postcode')) {
    //     federatedSearchStore.postcode = params.get('postcode');
    // }

    // if (params.has('location')) {
    //     federatedSearchStore.location = params.get('location');
    // }

    // if (params.has('radius')) {
    //     federatedSearchStore.radius = params.get('radius');
    // }

    // if (params.has('postcodeareas')) {
    //     federatedSearchStore.postcodeareas = params.get('postcodeareas');
    // }

    // if (params.has('search-term') || params.has('category')) {
    //     federatedSearchStore.getSearchResults();
    // }
});

// Reset the filter scroll when a search has run (isLoading is set from true to false).
// watch(isLoading, (newValue) => {
//     if (!newValue) {
//         categoryFilter.value?.resetScroll();
//         subCategoryFilter.value?.resetScroll();
//     }
// });
</script>

<style lang="scss">
.vs-search-input {
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

                @media (min-width: 992px) {
                    left: 1.5rem;

                    // .vs-icon {
                    //     font-size: $icon-size-sm;
                    // }
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
