import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

const useMainMapStore = defineStore('mainMap', () => {
    const sidebarOpen = ref(true);
    const timeMounted = ref(Date.now());
    const firstInteraction = ref(false);
    const searchesCount = ref(0);
    const filterUsesCount = ref(0);
    const showDestinations = ref(true);
    const showCategories = ref(false);
    const selectedDestinationType = ref<string | undefined>(undefined);
    const searchTerm = ref<string | undefined>(undefined);
    const selectedDestination = ref<string | undefined>(undefined);
    const isSidebarOpen = ref(false);
    const isSidebarResultsOpen = ref(false);
    const showSearchAreaButton = ref(false);
    const noResults = ref<boolean | undefined>(undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const featuredPlaces = ref<any[]>([]);
    const selectedTopLevelCategory = ref<string | undefined>(undefined);
    const selectedSubcategories = ref<string[]>([]);
    const keywords = ref<string[] | undefined>(undefined);
    const selectedCategory = ref<string | undefined>(undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subcategoryMap = ref<any>();
    const selfCateringClicked = ref(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryLabelData = ref<any>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryData = ref<any>();

    const filteredPlaces = computed(() => (
        featuredPlaces.value.filter((place) => (
            place.properties.category.id === selectedDestinationType.value
        ))
    ));

    return {
        sidebarOpen,
        timeMounted,
        firstInteraction,
        searchesCount,
        filterUsesCount,
        searchTerm,
        showDestinations,
        showCategories,
        selectedDestinationType,
        selectedDestination,
        isSidebarOpen,
        isSidebarResultsOpen,
        showSearchAreaButton,
        noResults,
        featuredPlaces,
        filteredPlaces,
        selectedTopLevelCategory,
        selectedSubcategories,
        keywords,
        categoryLabelData,
        categoryData,
        selectedCategory,
        subcategoryMap,
        selfCateringClicked,
    };
});

export default useMainMapStore;
