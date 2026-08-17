import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import useMainMapStore from './mainMap.ts';

const useMapCategoryStore = defineStore('mapCategory', () => {
    const selectedCategory = ref<string>();
    const selectedSubcategories = ref<string[]>([]);
    const selfCateringClicked = ref(false);

    const mainMapStore = useMainMapStore();

    // Get the label of the selected category.
    const selectedCategoryLabel = computed(() => {
        const category = mainMapStore.categoryLabelData
            .find((category) => category.id === selectedCategory.value);
        return category.label;
    });

    const selectedSubcategoryLabels = computed(() => {
        const category = mainMapStore.categoryLabelData.find(
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
        const category = mainMapStore.categoryLabelData.find(
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
        const category = mainMapStore.categoryData[selectedCategory.value!];
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
            const subcategory = mainMapStore.subcategoryMap[id];
            if (!subcategory) return;

            subcategory.includedType?.forEach((type) => included.add(type));
            subcategory.excludedType?.forEach((type) => excluded.add(type));
        });

        return {
            included,
            excluded,
        };
    });

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

    return {
        clearSubcategories,
        getSubcategoryLabel,
        selectedCategory,
        selectedCategoryLabel,
        selectedCategoryTypes,
        selectedSubcategories,
        selectedSubcategoryLabels,
        selectedSubcategoryTypes,
        selfCateringClicked,
        toggleSubcategory,
    };
});

export default useMapCategoryStore;
