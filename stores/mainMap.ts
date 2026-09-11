import { ref } from 'vue';
import { defineStore } from 'pinia';

const useMainMapStore = defineStore('mainMap', () => {
    const filterUsesCount = ref(0);
    const firstInteraction = ref(false);
    const isSidebarOpen = ref(false);
    const isSidebarResultsOpen = ref(false);
    const keywords = ref<string[] | undefined>(undefined);
    const noResults = ref<boolean | undefined>(undefined);
    const query = ref('');
    const searchesCount = ref(0);
    const searchTerm = ref<string | undefined>(undefined);
    const showCategories = ref(false);
    const showDestinations = ref(true);
    const showSearchAreaButton = ref(false);
    const timeMounted = ref(Date.now());
    const visibleMarkerCount = ref(0);

    return {
        filterUsesCount,
        firstInteraction,
        isSidebarOpen,
        isSidebarResultsOpen,
        keywords,
        noResults,
        query,
        searchesCount,
        searchTerm,
        showDestinations,
        showCategories,
        showSearchAreaButton,
        timeMounted,
        visibleMarkerCount,
    };
});

export default useMainMapStore;
