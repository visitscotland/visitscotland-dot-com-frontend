import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

import type { MapContext } from '~/types/main-map-types.ts';
import useMainMapStore from '@/stores/mainMap.ts';
import dataLayerComposable from '../dataLayer.ts';
import useMapAnalytics from './useMapAnalytics.ts';
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
    const dataLayerHelper = dataLayerComposable();
    const mapAnalytics = useMapAnalytics(context);
    const {
        addDestinationMarkers,
        addMarkers,
        clearMarkers,
        handleFeaturedLocationClick,
    } =
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

            mapAnalytics.mapInteractionEvent('clear_all');

            addDestinationMarkers();
            mainMapStore.showDestinations = true;
        }

        if (resetLocation) {
            runProgrammaticMove(() => {
                context.gMap.value!.setCenter(DEFAULT_CENTER);
                context.gMap.value!.setZoom(DEFAULT_ZOOM);
                context.gMap.value!.fitBounds(SCOTLAND_BOUNDS);
            });

            mapAnalytics.mapInteractionEvent('reset_map');
        }

        if (hardReset || resetLocation) {
            setUrlParameters({
            });
        }
    }

    function searchByText(useRestriction = false) {
        const map = context.gMap.value;
        if (!map) return;

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
        mainMapStore.query = mainMapStore.searchTerm;

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

        if (mapCategoryStore.selfCateringClicked) {
            setUrlParameters({
                coords: map.getCenter()?.toUrlValue(2),
                zoom: map.getZoom()?.toFixed(2),
            });
        } else {
            setUrlParameters({
                searchTerm: true,
            });
        }

        context.textSearch.value!.addEventListener(
            'gmp-load',
            () => {
                if (searchId !== context.currentSearchId.value) return;

                addMarkers(searchId);
                context.lastSearchViewport.value = getViewport();
                mapCategoryStore.selfCateringClicked = false;
                
                dataLayerHelper.createDataLayerObject('googleMapSearchEvent', {
                    search_query: mainMapStore.searchTerm,
                    search_map_location: map.getCenter()?.toString(),
                    search_results_count: context.textSearch.value?.places?.length,
                    search_usage_index: mainMapStore.searchesCount,
                });

                mapAnalytics.checkFirstInteraction('map_search');
            },
            {
                once: true,
            },
        );

        mainMapStore.showDestinations = false;
        mainMapStore.showCategories = true;
    }

    function searchByCategory() {
        const map = context.gMap.value;
        if (!map) return;

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
        mainMapStore.searchTerm = (mapCategoryStore.selectedDestination)
            ? `${mainMapStore.searchTerm} ${mapCategoryStore.selectedDestination}`
            : mainMapStore.searchTerm ;
        mainMapStore.query = mainMapStore.searchTerm ?? '';
 
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
            (mapCategoryStore.selectedDestinationType === 'regions' &&
                mapCategoryStore.selectedDestination !== 'Fife') ||
            (mapCategoryStore.selectedDestinationType === 'islands' &&
                mapCategoryStore.selectedDestination === 'Shetland') ||
            (mapCategoryStore.selectedDestinationType === 'islands' &&
                mapCategoryStore.selectedDestination === 'Orkney')
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
                const filterType = ref<'main' | 'sub'>('main');
                const filterSelection = ref(mapCategoryStore.selectedCategory);

                if (mapCategoryStore.selectedSubcategories.length) {
                    filterType.value = 'sub';
                    filterSelection.value = mapCategoryStore.selectedSubcategories.join(', ');
                }

                dataLayerHelper.createDataLayerObject('googleMapFilterEvent', {
                    filter_type: filterType.value,
                    search_map_location: map.getCenter()?.toString(),
                    filter_selection: filterSelection.value,
                    results_count: context.nearbySearch.value?.places?.length,
                    filter_usage_index: mainMapStore.filterUsesCount,
                });

                mapAnalytics.checkFirstInteraction('map_filter');
            },
            {
                once: true,
            },
        );

        if (mapCategoryStore.selectedDestination) {
            setUrlParameters({
                location: true,
                category: mapCategoryStore.selectedCategory || false,
                subcategories: mapCategoryStore.selectedSubcategories.length
                    ? mapCategoryStore.selectedSubcategories
                    : false,
            });
        } else {
            setUrlParameters({
                category: mapCategoryStore.selectedCategory || false,
                subcategories: mapCategoryStore.selectedSubcategories.length
                    ? mapCategoryStore.selectedSubcategories
                    : false,
                coords: true,
                zoom: true,
            });
        }
    }

    /**
     * Search the current viewport area re-running the previous search
     * or running a "Things to do" if no previous search.
     */
    function searchArea() {
        mainMapStore.showDestinations = false;
        mainMapStore.sidebarOpen = true;
        mapCategoryStore.selectedDestination = '';
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
    }

    function handleCategoryUpdate() {
        if (selectedSubcategories.value.includes('self-catering')) {
            mainMapStore.searchTerm =
                mapCategoryStore.getSubcategoryLabel('self-catering');
            mapCategoryStore.selectedDestination = '';
            searchByText();
        } else if (
            selectedCategory.value ||
            selectedSubcategories.value.length > 0
        ) {
            searchByCategory();
        }
    }

    async function setUrlParameters(options) {
        const map = context.gMap.value;
        if (!map) return;

        const route = useRoute();
        const router = useRouter();

        // Build the URL query.
        const query = mapCategoryStore.selfCateringClicked
            // Use a hardcoded query if self catering is selected.
            ? {
                category: 'accommodation',
                subcategories: 'self-catering',
                coords: options.coords ? map.getCenter()?.toUrlValue(2) : undefined,
                zoom: options.zoom ? map.getZoom()?.toFixed(2) : undefined,
            }
            : {
                'search-term': options.searchTerm ? mainMapStore.searchTerm?.toLowerCase() : undefined,
                location: options.location ? mapCategoryStore.selectedDestination?.toLowerCase() : undefined,   
                category: options.category ? mapCategoryStore.selectedCategory : undefined,
                subcategories: options.subcategories ? mapCategoryStore.selectedSubcategories.join(',') : undefined,
                coords: options.coords ? map.getCenter()?.toUrlValue(2) : undefined,
                zoom: options.zoom ? map.getZoom()?.toFixed(2) : undefined,
            };

        await router.replace({
            path: route.path,
            query,
        });
    }

    function setSubcategories(category: string, subcategories: string) {
        if (!subcategories) return;

        const providedSubcategories = subcategories
            .split(',')
            .filter((subcategoryId: string) => {
                const subcategory = mapCategoryStore.subcategoryMap[subcategoryId];
                return subcategory && subcategory.categoryId === category;
            });

        if (providedSubcategories.includes('self-catering')) {
            mapCategoryStore.selfCateringClicked = true;
            mapCategoryStore.selectedSubcategories = ['self-catering'];
        } else {
            mapCategoryStore.selectedSubcategories = providedSubcategories;
        }
    };

    function handleUrlParams() {
        const map = context.gMap.value;
        if (!map) return false;

        const route = useRoute();        

        // This is needed to correctly set the type of the URL parameter.
        const getValue = (id: string) =>
            typeof route.query[id] === 'string'
                ? route.query[id]
                : '';

        // Get the URL parameter values.
        const category: string = getValue('category');
        const coords: string = getValue('coords');
        const location: string = getValue('location');
        const searchTerm: string = getValue('search-term');
        const subcategories: string = getValue('subcategories');
        const zoom: string = getValue('zoom');

        if (location) {
            const placeData = mapCategoryStore.featuredDestinations.find((place) => (
                place.properties.title.toLowerCase() === location.toLowerCase()
            ));

            if (placeData) {
                handleFeaturedLocationClick(placeData, category);
                setSubcategories(category, subcategories);
                return true;
            }
        }

        if (coords && zoom) {
            mainMapStore.showDestinations = false;

            const providedZoom = Number(zoom);
            const providedCoords = coords.split(',');

            runProgrammaticMove(() => {
                // Zoom into location
                map.setZoom(Number(providedZoom));
                map.setCenter(
                    new google.maps.LatLng(
                        Number(providedCoords[0]),
                        Number(providedCoords[1]),
                    ),
                );
            });

            if (category && subcategories) {
                setSubcategories(category, subcategories);
            }

            const categoryExists = category in mapCategoryStore.categoryData;

            mapCategoryStore.selectedCategory = (categoryExists) ? category : 'things-to-do';
            return true;
        }

        if (searchTerm) {
            mainMapStore.searchTerm = searchTerm;
            searchByText();
            return true;
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
        handleUrlParams,
        resetCategories,
        resetMap,
        resetTextQuery,
        searchArea,
        searchByCategory,
        searchByText,
        setUrlParameters,
    };
}
