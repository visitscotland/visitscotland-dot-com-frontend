import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axios from 'axios';

import type {
    Category,
    Categories,
    FeaturedDestination,
    MapLabels,
    Subcategory,
    SubcategoryLabel,
    TypeKey,
} from '~/types/main-map-types.ts';
import useMainMapStore from './mainMap.ts';

/**
 * This store manages everything to do with the categories, subcategories
 * and featured destinations that are used on the main map.
 */
const useMapCategoryStore = defineStore('mapCategory', () => {
    const mainMapStore = useMainMapStore();

    const categoryData = ref<any>();
    const categoryLabelData = ref<MapLabels[]>([]);
    const featuredDestinations = ref<any>();
    const featuredDestinationTypes = ref<SubcategoryLabel[] | null>([]);
    const selectedCategory = ref<string>();
    const selectedDestination = ref<string>();
    const selectedDestinationType = ref<string>();
    const selectedSubcategories = ref<string[]>([]);
    const selfCateringClicked = ref(false);
    const subcategoryMap = ref<any>();

    /**
     * Load the map category data from the static server.
     */
    async function loadMapCategories() {
        try {
            const { data } = await axios.get<Categories>('https://static.visitscotland.com/maps-resources/main-map/map-categories-v2.json');

            categoryData.value = data;
            mainMapStore.keywords = data.accommodation.keywords;

            // Create a subcategory map so to make it easier to get the 
            // data for each subcategory.
            subcategoryMap.value = Object.values(data)
                .flatMap((category) =>
                    (category.subCategory ?? []).map((subcategory) =>({
                        ...subcategory,
                        categoryId: category.id,
                    })),
                )
                .reduce<Record<string, Subcategory>>((map, subcategory) => {
                    map[subcategory.id] = subcategory;
                    return map;
                }, {
                });
        } catch(error) {
            console.error('Error getting category data', error);
        }
    }

    /**
     * Get the label of the selected category.
     */
    const selectedCategoryLabel = computed(() => {
        const category = categoryLabelData.value
            .find((category) => category.id === selectedCategory.value);
        
        return (!category) ? '' : category.label;
    });

    /**
     * Get the label(s) for the selected subcategories.
     */
    const selectedSubcategoryLabels = computed(() => {
        const category = categoryLabelData.value.find(
            ({ id }) => id === selectedCategory.value,
        );

        if (!category) return;

        const labels = selectedSubcategories.value
            .map((subcategory) => Object.values(category.subCategory)
                .find(({ id }) => id === subcategory)
                ?.label);

        return labels.join(', ');
    });

    /**
     * Get the label data for the subcategory.
     * 
     * @param subcategoryId - ID of the subcategory.}
     */
    function getSubcategoryLabel(subcategoryId: string) {
        // Get the category data from the label data.
        const category = categoryLabelData.value.find(
            ({ id }) => id === selectedCategory.value,
        );

        if (!category) return;

        // Get find the subcategory label within the category data.
        return Object.values(category.subCategory)
            .find(({ id }: { id: string }) => id === subcategoryId)
            ?.label;
    }

    /**
     * Get the included/excluded types for the selected category.
     * 
     * @param category - data for the `selectedCategory`
     * @param type - whether to get the included or excluded types.
     * @returns - Set of types
     */
    function getTypes(category: Category, type: TypeKey): Set<string> {
        return new Set([
            ...(category[type] ?? []),
            ...(category.subCategory?.flatMap(
                (subcategory) => subcategory[type] ?? [],
            ) ?? []),
        ]);
    }
    
    /**
     * Get the types for the selected category.
     */
    const selectedCategoryTypes = computed(() => {
        if (!categoryData.value || !selectedCategory.value) return;

        const category = categoryData.value[selectedCategory.value];
        if (!category) return;

        const included = getTypes(category, 'includedType');
        const excluded = getTypes(category, 'excludedType');

        included.forEach((type) => excluded.delete(type));

        return {
            included,
            excluded,
        };
    });

    /**
     * Get the types for the selected subcategories.
     */
    const selectedSubcategoryTypes = computed(() => {
        const included: Set<string> = new Set();
        const excluded: Set<string> = new Set();
        
        selectedSubcategories.value.forEach((id) => {
            const subcategory = subcategoryMap.value[id];
            if (!subcategory) return;

            subcategory.includedType?.forEach((type: string) => included.add(type));
            subcategory.excludedType?.forEach((type: string) => excluded.add(type));
        });

        included.forEach((type) => excluded.delete(type));

        return {
            included,
            excluded,
        };
    });

    /**
     * Set the `selectedCategory`.
     * 
     * @param id - ID of the category.
     */
    function selectCategory(id: string) {
        selectedCategory.value = id;
        clearSubcategories();
    }

    /**
     * 
     * Toggle the selected subcategories.
     * 
     * @param id - ID of the subcategory.
     */
    function toggleSubcategory(id: string) {

        // if Self Catering selected then selectedSubcategories should only
        // be 'self-carting' as this subcategory cannot be used alongside
        // other subcategories.
        if (id === 'self-catering') {
            selectedSubcategories.value = ['self-catering'];
            selfCateringClicked.value = true;
            return;
        }

        // Remove "self-catering" from the selectedSubcategories.
        selectedSubcategories.value =
            selectedSubcategories.value.filter((i: string) => i !== 'self-catering');
        selfCateringClicked.value = false;
        
        // Check if the subcategory is within selectedSubcategories
        // Remove it if its already included.
        // Add it if its not included.
        if (selectedSubcategories.value.includes(id)) {
            selectedSubcategories.value =
                selectedSubcategories.value.filter((i: string) => i !== id);
        } else {
            selectedSubcategories.value.push(id);
        }
    }

    /**
     * Reset the selectedSubcategories.
     */
    function clearSubcategories() {
        selectedSubcategories.value = [];
    }

    /**
     * Filter the featured destinations so that them match the
     * `selectedDestinationType`.
     */
    const filteredDestinations = computed(() => {
        if (!featuredDestinations.value) return;
        
        return featuredDestinations.value.filter((place: FeaturedDestination) => (
            place.properties.category.id === selectedDestinationType.value
        ));
    });

    onMounted(() => {
        // Get the featured destinations types from the `categoryLabelData`.
        featuredDestinationTypes.value = categoryLabelData.value
            .find((category) => category.id === 'destinations')
            ?.subCategory ?? [];

        // Temporarily hide "Towns" from the destinations categories.
        featuredDestinationTypes.value = featuredDestinationTypes.value
            .filter((category) => category.id !== 'towns');

        // Set the initial selected destination.
        if (!featuredDestinationTypes.value[0]) return;
        selectedDestinationType.value = featuredDestinationTypes.value[0].id;
    });

    return {
        categoryData,
        categoryLabelData,
        clearSubcategories,
        featuredDestinations,
        featuredDestinationTypes,
        filteredDestinations,
        getSubcategoryLabel,
        loadMapCategories,
        selectCategory,
        selectedCategory,
        selectedCategoryLabel,
        selectedCategoryTypes,
        selectedDestination,
        selectedDestinationType,
        selectedSubcategories,
        selectedSubcategoryLabels,
        selectedSubcategoryTypes,
        selfCateringClicked,
        subcategoryMap,
        toggleSubcategory,
    };
});

export default useMapCategoryStore;
