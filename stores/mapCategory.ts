import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axios from 'axios';

import type { MapLabels, SubcategoryLabel } from '~/types/main-map-types.ts';
import useMainMapStore from './mainMap.ts';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subcategoryMap = ref<any>();

    async function loadMapCategories() {
        try {
            const { data } = await axios.get('https://static.visitscotland.com/maps-resources/main-map/map-categories-v2.json');

            categoryData.value = data;
            mainMapStore.keywords = data.accommodation.keywords;

            subcategoryMap.value = Object.values(data)
                .flatMap((category) =>
                    (category.subCategory ?? []).map((subcategory) =>({
                        ...subcategory,
                        categoryId: category.id,
                    })),
                )
                .reduce((map, subcategory) => {
                    map[subcategory.id] = subcategory;
                    return map;
                }, {
                });
        } catch(error) {
            console.error('Error getting category data', error);
        }
    }

    // Get the label of the selected category.
    const selectedCategoryLabel = computed(() => {
        const category = categoryLabelData.value
            .find((category) => category.id === selectedCategory.value);
        
        return (!category) ? '' : category.label;
    });

    const selectedSubcategoryLabels = computed(() => {
        const category = categoryLabelData.value.find(
            ({ id }) => id === selectedCategory.value,
        );

        if (!category) return;

        const labels = selectedSubcategories.value
            .map((subcategory) => Object.values(category.subCategory)
                .find(({ id }) => id === subcategory)
                .label);

        return labels.join(', ');
    });

    function getSubcategoryLabel(subcategoryId: string) {
        // Get the label data for the selected category.
        const category = categoryLabelData.value.find(
            ({ id }) => id === selectedCategory.value,
        );

        if (!category) return;

        return Object.values(category.subCategory)
            .find(({ id }: { id: string }) => id === subcategoryId)
            .label;
    }

    // Get the included/excluded types for the selected category.
    function getTypes(category, type: 'includedType' | 'excludedType') {
        return new Set([
            ...(category[type] ?? []),
            ...(category.subCategory?.flatMap(
                (subcategory) => subcategory[type] ?? [],
            )),
        ]);
    }
    
    const selectedCategoryTypes = computed(() => {
        if (!categoryData.value) return;

        const category = categoryData.value[selectedCategory.value!];
        if (!category) return;

        const included = getTypes(category, 'includedType');
        const excluded = getTypes(category, 'excludedType');

        included.forEach((type) => excluded.delete(type));

        return {
            included,
            excluded,
        };
    });

    const selectedSubcategoryTypes = computed(() => {
        const included = new Set();
        const excluded = new Set();
        
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

    function selectCategory(id: string) {
        selectedCategory.value = id;
        clearSubcategories();
    }

    function toggleSubcategory(id: string) {
        if (id === 'self-catering') {
            selectedSubcategories.value = ['self-catering'];
            selfCateringClicked.value = true;
            return;
        }

        selectedSubcategories.value =
            selectedSubcategories.value.filter((i: string) => i !== 'self-catering');
        selfCateringClicked.value = false;
        
        if (selectedSubcategories.value.includes(id)) {
            selectedSubcategories.value =
                selectedSubcategories.value.filter((i: string) => i !== id);
        } else {
            selectedSubcategories.value.push(id);
        }
    }

    function clearSubcategories() {
        selectedSubcategories.value = [];
    }

    const filteredDestinations = computed(() => {
        if (!featuredDestinations.value) return;
        
        return featuredDestinations.value!.filter((place) => (
            place.properties.category.id === selectedDestinationType.value
        ));
    });

    onMounted(() => {
        // Get the featured destinations types.
        featuredDestinationTypes.value = categoryLabelData.value
            .find((category) => category.id === 'destinations')
            ?.subCategory ?? [];

        // Temporary hide "Towns" from the destinations categories.
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
