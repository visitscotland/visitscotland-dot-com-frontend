import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

import type { MapContext } from '~/types/main-map-types.ts';
import useMainMapStore from '@/stores/mainMap.ts';
import useMapCategoryStore from '~/stores/mapCategory.ts';
import useMapMarkers from './useMapMarkers.ts';
import useViewportController from './useViewportController.ts';
import {
    DEFAULT_CENTER,
    DEFAULT_ZOOM,
    NUMBER_OF_RESULTS,
    SCOTLAND_BOUNDS,
} from '~/main-map-constants.ts';

export default function useMapSearch(context: MapContext) {
    const mainMapStore = useMainMapStore();
    const mapCategoryStore = useMapCategoryStore();
    const { selectedCategory, selectedSubcategories } =
        storeToRefs(mapCategoryStore);
    const { addDestinationMarkers, addMarkers, clearMarkers } =
        useMapMarkers(context);
    const { getViewport, runProgrammaticMove } = useViewportController(context);

    function resetTextQuery() {
        mainMapStore.searchTerm = undefined;
    }

    function resetCategories() {
        mapCategoryStore.clearSubcategories();
        mapCategoryStore.selectedCategory = '';
    }

    function resetMap(hardReset: boolean, resetLocation: boolean) {
        mainMapStore.showCategories = false;

        // Clear any existing markers.
        clearMarkers();

        // Reset searchType
        context.searchType.value = undefined;

        // Reset nearby search.
        context.nearbySearchQuery.value!.includedTypes = null;
        context.nearbySearchQuery.value!.excludedTypes = null;
        context.nearbySearchQuery.value!.locationRestriction = null;
        context.nearbySearch.value!.style.display = 'none';

        // Reset text search.
        context.textSearchQuery.value!.includedType = null;
        context.textSearchQuery.value!.locationRestriction = null;
        context.textSearchQuery.value!.locationBias = null;
        context.textSearchQuery.value!.textQuery = null;
        context.textSearch.value!.style.display = 'none';

        mainMapStore.noResults = undefined;

        if (hardReset) {
            // A `hard reset` will remove all text and categories
            resetTextQuery();
            resetCategories();

            // TODO: analytics
            // mapInteractionEvent('clear_all');

            addDestinationMarkers();
            mainMapStore.showDestinations = true;
        }

        if (resetLocation) {
            runProgrammaticMove(() =>
                context.gMap.value!.setCenter(DEFAULT_CENTER),
            );
            runProgrammaticMove(() =>
                context.gMap.value!.setZoom(DEFAULT_ZOOM),
            );
            runProgrammaticMove(() =>
                context.gMap.value!.fitBounds(SCOTLAND_BOUNDS),
            );

            // TODO: analytics
            // mapInteractionEvent('reset_map');
        }
    }

    function searchByText(useRestriction = false) {
        resetMap(false, false);

        // Don't reset the categories if doing a "Self catering" search as
        // the "Accommodation" category and "Self catering" subcategory
        // need to be active.
        if (!mapCategoryStore.selfCateringClicked) {
            resetCategories();
        }

        mainMapStore.isSidebarOpen = true;

        context.currentSearchId.value += 1;

        const searchId = context.currentSearchId.value;

        mainMapStore.searchesCount += 1;

        context.searchType.value = 'text';

        // Don't search if no query
        if (!mainMapStore.searchTerm) return;

        /**
         * Search using locationRestriction when "Self catering" sub category has
         * been selected. Search using locationBias for other text searches.
         */
        if (mapCategoryStore.selfCateringClicked || useRestriction) {
            context.textSearchQuery.value!.locationBias = null;
            context.textSearchQuery.value!.locationRestriction =
                context.gMap.value!.getBounds();
        } else {
            context.textSearchQuery.value!.locationRestriction = null;
            context.textSearchQuery.value!.locationBias =
                context.gMap.value!.getCenter();
        }

        // Add the `includedType` of "lodging" when the query includes a keyword.
        context.textSearchQuery.value!.includedType =
            mainMapStore.keywords!.some((term) =>
                mainMapStore.searchTerm!.toLowerCase().includes(term),
            )
                ? 'lodging'
                : null;

        /**
         * Add 'in Scotland' to the end of the text query to help contain the
         * results to Scotland.
         */
        if (mapCategoryStore.selfCateringClicked) {
            context.textSearchQuery.value!.textQuery =
                'self catering in Scotland';
        } else {
            context.textSearchQuery.value!.textQuery = `${mainMapStore.searchTerm} in Scotland`;
        }

        context.textSearchQuery.value!.maxResultCount = NUMBER_OF_RESULTS;

        context.textSearch.value!.style.display = 'block';

        context.textSearch.value!.addEventListener(
            'gmp-load',
            () => {
                if (searchId !== context.currentSearchId.value) return;

                addMarkers(searchId);
                context.lastSearchViewport.value = getViewport();
                mapCategoryStore.selfCateringClicked = false;

                // TODO: Analytics
                // dataLayerHelper.createDataLayerObject('googleMapSearchEvent', {
                //     search_query: mainMapStore.searchTerm,
                //     search_map_location: mapContext.gMap.value.getCenter().toString(),
                //     search_results_count: mapContext.textSearch.value.places.length,
                //     search_usage_index: mainMapStore.searchesCount,
                // });

                // checkFirstInteraction('map_search');
            },
            {
                once: true,
            },
        );

        mainMapStore.showDestinations = false;
        mainMapStore.showCategories = true;
    }

    function searchByCategory() {
        const types =
            selectedSubcategories.value.length > 0
                ? mapCategoryStore.selectedSubcategoryTypes
                : mapCategoryStore.selectedCategoryTypes;

        const label =
            selectedSubcategories.value.length > 0
                ? mapCategoryStore.selectedSubcategoryLabels
                : mapCategoryStore.selectedCategoryLabel;

        resetMap(false, false);

        if (!mapCategoryStore.selfCateringClicked) {
            resetTextQuery();
        }

        mainMapStore.searchTerm = label;

        mainMapStore.showCategories = true;
        mainMapStore.isSidebarOpen = true;

        context.currentSearchId.value += 1;

        const searchId = context.currentSearchId.value;

        mainMapStore.filterUsesCount += 1;

        context.searchType.value = 'nearby';

        const bounds = context.gMap.value!.getBounds();
        const ne = bounds!.getNorthEast();
        const sw = bounds!.getSouthWest();

        const diameter = google.maps.geometry.spherical.computeDistanceBetween(
            ne,
            sw,
        );

        // Set search distance to 50km for region and "Shetland" and "Orkney" islands
        // searches and 25km for all other searches.
        let cappedDistance = 25000;

        if (
            (mainMapStore.selectedDestinationType === 'regions' &&
                mainMapStore.selectedDestination !== 'Fife') ||
            (mainMapStore.selectedDestinationType === 'islands' &&
                mainMapStore.selectedDestination === 'Shetland') ||
            (mainMapStore.selectedDestinationType === 'islands' &&
                mainMapStore.selectedDestination === 'Orkney')
        ) {
            cappedDistance = 50000;
        }

        const cappedRadius = Math.min(diameter / 2, cappedDistance);

        context.nearbySearchQuery.value!.includedTypes = [...types.included];
        context.nearbySearchQuery.value!.excludedTypes = [...types.excluded];
        context.nearbySearchQuery.value!.maxResultCount = NUMBER_OF_RESULTS;
        context.nearbySearchQuery.value!.locationRestriction = {
            center: context.gMap.value!.getCenter(),
            radius: cappedRadius,
        };

        context.nearbySearch.value!.style.display = 'block';
        context.nearbySearch.value!.addEventListener(
            'gmp-load',
            () => {
                if (searchId !== context.currentSearchId.value) return;

                addMarkers(searchId);
                context.lastSearchViewport.value = getViewport();

                // TODO: analytics
                // let filterType = 'main';
                // let filterSelection = mainMapStore.selectedTopLevelCategory;

                // if (mainMapStore.selectedSubcategories.size) {
                //     filterType = 'sub';
                //     filterSelection = Array.from(mainMapStore.selectedSubcategories).join(', ');
                // }

                // dataLayerHelper.createDataLayerObject('googleMapFilterEvent', {
                //     filter_type: filterType,
                //     search_map_location: context.gMap.value.getCenter().toString(),
                //     filter_selection: filterSelection,
                //     results_count: context.nearbySearch.value.places.length,
                //     filter_usage_index: mainMapStore.filterUsesCount,
                // });

                // checkFirstInteraction('map_filter');
            },
            {
                once: true,
            },
        );
    }

    /**
     * Search the current viewport area re-running the previous search
     * or running a "Things to do" if no previous search.
     */
    function searchArea() {
        mainMapStore.showDestinations = false;
        mainMapStore.sidebarOpen = true;
        mainMapStore.selectedDestination = '';
        mainMapStore.showSearchAreaButton = false;

        if (selectedSubcategories.value.includes('self-catering')) {
            mainMapStore.searchTerm =
                mapCategoryStore.getSubcategoryLabel('self-catering');
            mapCategoryStore.selfCateringClicked = true;
            searchByText();
        } else if (
            selectedCategory.value ||
            selectedSubcategories.value.length > 0
        ) {
            searchByCategory();
        } else if (mainMapStore.searchTerm) {
            searchByText(true);
        } else {
            selectedCategory.value = 'things-to-do';
        }

        // // Check for selected subcategory and start nearby search.
        // if (mainMapStore.selectedSubcategories.length > 0) {
        //     if (mainMapStore.selectedSubcategories.has('self-catering')) {
        //         mainMapStore.selectedSubcategories.delete('self-catering');
        //         searchBySubCategory('self-catering');
        //     } else {
        //         searchByCategory({
        //             includedTypes: [...selectedSubcategoryTypes.value.included],
        //             excludedTypes: [...selectedSubcategoryTypes.value.excluded],
        //         });

        //         // Get labels for the selected subcategories.
        //         const subcatLabels = [];
        //         mainMapStore.selectedSubcategories.forEach((subcat) => {
        //             subcatLabels.push(
        //                 searchSubcategoriesForLabel(subcat),
        //             );
        //         });
        //         mainMapStore.searchTerm = subcatLabels.join(', ');
        //         // searchInput.value = mainMapStore.selectedSubcategories.join(', ');
        //         mainMapStore.showCategories = true;
        //     }
        //     return;
        // }

        // // Check for selected category and start nearby search.
        // if (mainMapStore.selectedTopLevelCategory) {
        //     selectCategory(mainMapStore.selectedTopLevelCategory);
        //     return;
        // }

        // // Check for searchInput value and start text search.
        // if (mainMapStore.searchTerm) {
        //     searchByText(true);
        //     return;
        // }

        // // Start "Things to do" search if no categories selected or search terms entered.
        // selectCategory('things-to-do');
    }

    function handleCategoryUpdate() {
        if (selectedSubcategories.value.includes('self-catering')) {
            mainMapStore.searchTerm =
                mapCategoryStore.getSubcategoryLabel('self-catering');
            searchByText();
        } else if (
            selectedCategory.value ||
            selectedSubcategories.value.length > 0
        ) {
            searchByCategory();
        }
    }

    const searchCriteria = computed(() => ({
        category: mapCategoryStore.selectedCategory,
        subcategories: [...mapCategoryStore.selectedSubcategories],
    }));

    watch(searchCriteria, (newValue, oldValue) => {
        if (newValue === oldValue) return;
        handleCategoryUpdate();
    });

    return {
        resetCategories,
        resetMap,
        resetTextQuery,
        searchArea,
        searchByCategory,
        searchByText,
    };
}
