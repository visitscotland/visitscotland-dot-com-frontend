import type { SearchApiResults, SearchApiResult } from '~/types/types.ts';
import { defineStore } from 'pinia';
import { ref, watchEffect } from 'vue';

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

    // Search sort
    const fromDate = ref<string>();
    const sortBy = ref<string>();
    const toDate = ref<string>();

    // Event specific parameters.
    const location = ref<string>();
    const postcode = ref<string>();
    const postcodeareas = ref<string>();
    const radius = ref<number>();

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

    async function getSearchResults(isAutoSearch = false) {
        isLoading.value = true;

        if (!isAutoSearch) {
            searchInSessionCount.value += 1;
        }

        // eslint-disable-next-line no-undef
        const cludoResults: SearchApiResults = await $fetch('/api/frontend/search/cludo-search', {
            method: 'post',
            body: {
                categoryKey: categoryKey.value,
                cludoApiKey: configStore.cludoExperienceId,
                cludoCustomerId: parseInt(configStore.cludoCustomerId, 10),
                cludoEngineId: parseInt(configStore.cludoEngineId, 10),
                searchTerm: searchTerm.value,
                page: currentPage.value,
                apiOperator: configStore.cludoApiOperator,
            },
        });

        if (cludoResults.error) {
            cludoApiError.value = true;
            console.error(cludoResults.error);
        }

        // eslint-disable-next-line no-undef
        const eventsResults: SearchApiResults = await $fetch('/api/frontend/search/events-search', {
            method: 'post',
            body: {
                categoryKey: categoryKey.value,
                endDate: toDate.value,
                eventsApiUrl: configStore.eventsApiUrl,
                location: location.value,
                page: currentPage.value,
                postcode: postcode.value,
                postcodeareas: postcodeareas.value,
                radius: radius.value,
                searchTerm: searchTerm.value,
                siteLanguage: configStore.locale,
                sortBy: sortBy.value,
                startDate: fromDate.value,
                subcategoryKeys: subcategoryKeys.value,
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
        // eslint-disable-next-line no-undef
        const route = useRoute();

        queryInput.value = (fromAutosuggest) ? 'Autosuggestion' : 'User input';

        // eslint-disable-next-line object-curly-newline
        route.query = {};

        // eslint-disable-next-line no-undef
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
                ...(radius.value && {
                    radius: radius.value,
                }),
            },
        });

        getSearchResults();
    }

    return {
        categoryKey,
        cludoApiError,
        currentPage,
        dateError,
        eventsApiError,
        eventHasBeenClicked,
        fromDate,
        getSearchResults,
        isLoading,
        location,
        postcode,
        postcodeareas,
        queryInput,
        radius,
        searchInSessionCount,
        searchResults,
        searchTerm,
        setUrlParameters,
        sortBy,
        subcategoryKeys,
        toDate,
        totalResults,
        totalResultsCludo,
        totalResultsEvents,
    };
});

export default useSearchStore;
