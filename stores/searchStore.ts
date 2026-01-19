import { defineStore } from 'pinia';
import { ref } from 'vue';

const useSearchStore = defineStore('search', () => {
    // Search sort
    const fromDate = ref<string>();
    const sortBy = ref<string>();
    const toDate = ref<string>();

    function getSearchResults() {
        console.log('searching...');
    }

    async function navigationSomething() {
        const route = useRoute();

        delete route.query;

        await navigateTo({
            path: route.path,
            query: {
                ...(fromDate.value && {
                    'from-date': fromDate.value,
                }),
                ...(sortBy.value && {
                    'sort-by': sortBy.value,
                }),
                ...(toDate.value && {
                    'to-date': toDate.value,
                }),
            },
        });

        getSearchResults();
    }

    return {
        fromDate,
        sortBy,
        toDate,
        navigationSomething,
    };
});

export default useSearchStore;
