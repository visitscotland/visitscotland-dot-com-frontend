import { defineStore } from 'pinia';
import { ref } from 'vue';

const useSearchStore = defineStore('search', () => {
    // Filter
    const categoryKey = ref<string>();
    const subcategoryKeys = ref<string[]>([]);

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
            },
        });

        getSearchResults();
    }

    return {
        categoryKey,
        fromDate,
        sortBy,
        subcategoryKeys,
        toDate,
        navigationSomething,
    };
});

export default useSearchStore;
