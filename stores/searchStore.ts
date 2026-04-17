import type {
    SearchApiResults,
    SearchApiResult,
    SearchFilterCategory,
} from '~/types/types.ts';
import { defineStore } from 'pinia';
import {
    computed,
    ref, 
    watchEffect,
} from 'vue';

import useConfigStore from './configStore.ts';

const useSearchStore = defineStore('search', () => {
    // General
    const cludoApiError = ref(false);
    const eventsApiError = ref(false);
    const configStore = useConfigStore();
    const isLoading = ref(false);
    const dateError = ref(false);

    // Search input
    const searchTerm = ref<string>();

    // Filter
    const categoryKey = ref<string>();
    const subcategoryKeys = ref<string[]>([]);
    const selectedLocations = ref<SearchFilterCategory[]>([]);
    const subcategorySelected = ref<SearchFilterCategory[]>([]);

    // Search sort
    const fromDate = ref<string>();
    const sortBy = ref<string>();
    const toDate = ref<string>();

    // Event specific parameters.
    const location = ref<string>();
    const postcode = ref<string>();
    const postcodeareas = ref<string>();
    const radius = ref<number>();
    const when = ref<string>();

    // Search results
    const currentPage = ref(1);
    const searchResults = ref<SearchApiResult[]>([]);
    const totalResults = ref(0);
    const totalResultsCludo = ref(0);
    const totalResultsEvents = ref(0);

    // Analytics
    const eventHasBeenClicked = ref(false);
    const searchInSessionCount = ref(-1);
    const queryInput = ref('');

    watchEffect(() => {
        // Validate dates.
        if (fromDate.value && toDate.value) {
            dateError.value = fromDate.value > toDate.value;
        }
    });

    const orderedSubcategories: SearchFilterCategory[] = computed(() => {
        const subcategories = configStore.getLabelMap('search-events-filters');
        const orderedList: SearchFilterCategory[] = [];
        Object.keys(subcategories).forEach((key) => {
            orderedList.push({
                Key: key,
                Label: subcategories[key],
            });
        });
        return orderedList;
    });


    async function getSearchResults(isAutoSearch = false) {
        isLoading.value = true;

        if (!isAutoSearch) {
            searchInSessionCount.value += 1;
        }

        const cludoResults: SearchApiResults = await $fetch('/api/frontend/search/cludo-search', {
            method: 'post',
            body: {
                apiOperator: configStore.cludoApiOperator,
                categoryKey: categoryKey.value,
                cludoApiKey: configStore.cludoExperienceId,
                cludoCustomerId: Number.parseInt(configStore.cludoCustomerId, 10),
                cludoEngineId: Number.parseInt(configStore.cludoEngineId, 10),
                langString: configStore.langString,
                searchTerm: searchTerm.value,
                page: currentPage.value,
            },
        });

        if (cludoResults.error) {
            cludoApiError.value = true;
            console.error(cludoResults.error);
        }

        const eventsResults: SearchApiResults = await $fetch('/api/frontend/search/events-search', {
            method: 'post',
            body: {
                categoryKey: categoryKey.value,
                endDate: toDate.value,
                eventsApiUrl: configStore.eventsApiUrl,
                location: location.value,
                page: currentPage.value,
                postcode: postcode.value,
                postcodeareas:  selectedLocations.value.length 
                    ? getSearchFilterParameters(selectedLocations.value).toString() 
                    : postcodeareas.value,
                radius: radius.value,
                searchTerm: searchTerm.value,
                siteLanguage: configStore.locale,
                sortBy: sortBy.value,
                startDate: fromDate.value,
                subcategoryKeys: subcategoryKeys.value,
                when: when.value,
            },
        });

        if (eventsResults.error) {
            eventsApiError.value = true;
            console.error(eventsResults.error);
        }

        searchResults.value = [...cludoResults.results, ...eventsResults.results];

        totalResultsCludo.value = cludoResults.totalResults;
        totalResultsEvents.value = eventsResults.totalResults;
        totalResults.value = totalResultsCludo.value + totalResultsEvents.value;

        isLoading.value = false;
    }

    async function setUrlParameters(fromAutosuggest?: boolean) {

        const route = useRoute();

        queryInput.value = (fromAutosuggest) ? 'Autosuggestion' : 'User input';

        // eslint-disable-next-line object-curly-newline
        route.query = {};

        await navigateTo({
            path: route.path,
            query: {
                ...(searchTerm.value && {
                    'search-term': searchTerm.value,
                }),
                ...(categoryKey.value && {
                    category: categoryKey.value,
                }),
                ...(subcategoryKeys.value.length > 0 && {
                    subcategories: subcategoryKeys.value.join(','),
                }),
                ...(currentPage.value && {
                    page: currentPage.value,
                }),
                ...(fromDate.value && {
                    'from-date': fromDate.value,
                }),
                ...(sortBy.value && {
                    'sort-by': sortBy.value,
                }),
                ...(toDate.value && {
                    'to-date': toDate.value,
                }),
                ...(location.value && {
                    location: location.value,
                }),
                ...(postcode.value && {
                    postcode: postcode.value,
                }),
                ...(postcodeareas.value && {
                    postcodeareas: postcodeareas.value,
                }),
                ...(selectedLocations.value.length > 0 && {
                    locations: getSearchFilterKeys(selectedLocations.value).toString(),
                }),
                ...(radius.value && {
                    radius: radius.value,
                }),
                ...(when.value) && {
                    when: when.value,
                },
            },
        });

        getSearchResults();
    }

    function getSearchFilterParameters(searchFilter: SearchFilterCategory[]) {
        return searchFilter.map((filter) => filter.Parameter);
    }

    function getSearchFilterKeys(searchFilter: SearchFilterCategory[]) {
        return searchFilter.map((filter) => filter.Key);
    }

    return {
        categoryKey,
        cludoApiError,
        currentPage,
        dateError,
        eventsApiError,
        eventHasBeenClicked,
        fromDate,
        getSearchFilterKeys,
        getSearchResults,
        isLoading,
        location,
        orderedSubcategories,
        postcode,
        postcodeareas,
        queryInput,
        radius,
        searchInSessionCount,
        searchResults,
        searchTerm,
        selectedLocations,
        setUrlParameters,
        sortBy,
        subcategoryKeys,
        subcategorySelected,
        toDate,
        totalResults,
        totalResultsCludo,
        totalResultsEvents,
        when,
    };
});

export default useSearchStore;
