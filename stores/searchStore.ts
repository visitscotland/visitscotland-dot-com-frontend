import { defineStore } from 'pinia';
import { ref } from 'vue';

import useConfigStore from './configStore.ts';

const useSearchStore = defineStore('search', () => {
    // General
    const configStore = useConfigStore();
    const isLoading = ref(false);

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
    const searchResults = ref<any>([]);
    const totalResults = ref(0);
    const totalResultsCludo = ref(0);
    const totalResultsEvents = ref(0);

    // Analytics
    const searchInSessionCount = ref(-1);

    async function getSearchResults(isAutoSearch = false) {
        isLoading.value = true;

        if (!isAutoSearch) {
            searchInSessionCount.value += 1;
        }

        const cludoResults: any = await $fetch('/api/search/cludo-search', {
            method: 'post',
            body: {
                categoryKey: categoryKey.value,
                cludoApiKey: configStore.cludoExperienceId,
                cludoCustomerId: parseInt(configStore.cludoCustomerId, 10),
                cludoEngineId: parseInt(configStore.cludoEngineId, 10),
                searchTerm: searchTerm.value,
                page: currentPage.value,
            },
        });

        const eventsResults: any = await $fetch('/api/search/events-search', {
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

        searchResults.value = [...cludoResults.results, ...eventsResults.results];

        totalResultsCludo.value = cludoResults.totalResults;
        totalResultsEvents.value = eventsResults.totalResults;
        totalResults.value = totalResultsCludo.value + totalResultsEvents.value;

        isLoading.value = false;
    }

    async function navigationSomething() {
        const route = useRoute();

        delete route.query;

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
        currentPage,
        fromDate,
        getSearchResults,
        isLoading,
        location,
        postcode,
        postcodeareas,
        radius,
        searchResults,
        searchTerm,
        sortBy,
        subcategoryKeys,
        toDate,
        totalResults,
        totalResultsCludo,
        totalResultsEvents,
        navigationSomething,
    };
});

export default useSearchStore;
