import { computed, watch } from 'vue';

import type {
    FeaturedDestination,
    MapContext,
    UrlParameter,
} from '~/types/main-map-types.ts';
import useMainMapStore from '@/stores/mainMap.ts';
import useMapCategoryStore from '~/stores/mapCategory.ts';
import dataLayerComposable from '../dataLayer.ts';
import useMapAnalytics from './useMapAnalytics.ts';
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
    const dataLayerHelper = dataLayerComposable();
    const mapAnalytics = useMapAnalytics(context);
    const mapMarkers = useMapMarkers(context);
    const viewportController = useViewportController(context);

    /**
     * Clear the search term.
     */
    function resetTextQuery() {
        mainMapStore.searchTerm = undefined;
    }

    /**
     * Reset the map.
     * 
     * @param hardReset - whether to reset the search term and selected categories
     * @param resetLocation - whether to reset back to the initial map position.
     */
    function resetMap(hardReset: boolean, resetLocation: boolean) {
        const map = context.gMap.value;
        if (!map) return;
    
        // Hide the categories.
        mainMapStore.showCategories = false;

        // Clear any existing markers.
        mapMarkers.clearMarkers();

        // Clear the `searchType`.
        context.searchType.value = undefined;

        const nearbySearchQuery = context.nearbySearchQuery.value;
        const nearbySearch = context.nearbySearch.value;
        const textSearchQuery = context.textSearchQuery.value;
        const textSearch = context.textSearch.value;

        if (nearbySearchQuery && nearbySearch) {
            // Reset the nearby search element parameters.
            nearbySearchQuery.includedTypes = null;
            nearbySearchQuery.excludedTypes = null;
            nearbySearchQuery.locationRestriction = null;
            nearbySearch.style.display = 'none';
        }

        if (textSearchQuery && textSearch) {
            // Reset the text search element parameters.
            textSearchQuery.includedType = null;
            textSearchQuery.locationRestriction = null;
            textSearchQuery.locationBias = null;
            textSearchQuery.textQuery = null;
            textSearch.style.display = 'none';
        }

        mainMapStore.noResults = undefined;
        mainMapStore.showSearchAreaButton = false;

        // A `hard reset` will remove all text and categories.
        if (hardReset) {
            resetTextQuery();
            mapCategoryStore.selectCategory('');

            mapAnalytics.mapInteractionEvent('clear_all');

            // Add the featured destination markers and show the list of
            // featured destinations.
            mapMarkers.addDestinationMarkers();
            mainMapStore.showDestinations = true;
        }

        // Move the map back to the initial centre and zoom.
        if (resetLocation) {
            viewportController.runProgrammaticMove(() => {
                map.setCenter(DEFAULT_CENTER);
                map.setZoom(DEFAULT_ZOOM);
                map.fitBounds(SCOTLAND_BOUNDS);
            });

            mapAnalytics.mapInteractionEvent('reset_map');
        }

        // Remove all URL parameters.
        if (hardReset || resetLocation) {
            setUrlParameters({
            });
        }
    }

    /**
     * Run a Google text search.
     * 
     * @param useRestriction - force a locationRestriction search.
     */
    function searchByText(useRestriction = false) {
        const map = context.gMap.value;
        const textSearchQuery = context.textSearchQuery.value;
        const textSearch = context.textSearch.value;
        if (!map || !textSearch || !textSearchQuery) return;

        // Reset the map so that previous results are removed.
        resetMap(false, false);

        // Don't reset the categories if doing a "Self catering" search as
        // the "Accommodation" category and "Self catering" subcategory
        // need to be active.
        if (!mapCategoryStore.selfCateringClicked) {
            mapCategoryStore.selectCategory('');
        }

        // Make sure the drawer is open on mobile.
        mainMapStore.isSidebarOpen = true;

        context.currentSearchId.value += 1;
        const searchId = context.currentSearchId.value;
        mainMapStore.searchesCount += 1;
        context.searchType.value = 'text';

        // Don't search if there isn't a search term.
        if (!mainMapStore.searchTerm) return;
        mainMapStore.query = mainMapStore.searchTerm;

        // Search using locationRestriction when "Self catering" sub category has
        // been selected. Search using locationBias for all other text searches.
        if (mapCategoryStore.selfCateringClicked || useRestriction) {
            textSearchQuery.locationBias = null;
            textSearchQuery.locationRestriction =
                map.getBounds();
        } else {
            textSearchQuery.locationRestriction = null;
            textSearchQuery.locationBias =
                map.getCenter();
        }

        // Add the `includedType` of "lodging" when the query includes a keyword.
        // This is a workaround to improve results for "Self catering" searches.
        textSearchQuery.includedType =
            mainMapStore.keywords!.some((term) =>
                mainMapStore.searchTerm!.toLowerCase().includes(term),
            )
                ? 'lodging'
                : null;

        
        // Add 'in Scotland' to the end of the text query to help contain the
        // results to Scotland.
        if (mapCategoryStore.selfCateringClicked) {
            // If the user has clicked the "Self Catering" subcategory always
            // set the query as below. This is a workaround to ensure consistent
            // results when using different languages.
            textSearchQuery.textQuery =
                'self catering in Scotland';
        } else {
            textSearchQuery.textQuery = `${mainMapStore.searchTerm} in Scotland`;
        }

        textSearchQuery.maxResultCount = NUMBER_OF_RESULTS;
        textSearch.style.display = 'block';
        
        // Update the URL params.
        if (mapCategoryStore.selfCateringClicked) {
            // Set the coords and zoom if the user has clicked the
            // "Self catering" subcategory. 
            setUrlParameters({
                coords: true,
                zoom: true,
            });
        } else {
            setUrlParameters({
                searchTerm: true,
            });
        }

        // Create an analytics event once the search is complete.
        textSearch.addEventListener(
            'gmp-load',
            () => {
                if (searchId !== context.currentSearchId.value) return;

                mapMarkers.addMarkers(searchId);
                context.lastSearchViewport.value = viewportController.getViewport();
                mapCategoryStore.selfCateringClicked = false;
                
                dataLayerHelper.createDataLayerObject('googleMapSearchEvent', {
                    search_query: mainMapStore.searchTerm,
                    search_map_location: map.getCenter()?.toString(),
                    search_results_count: textSearch.places?.length,
                    search_usage_index: mainMapStore.searchesCount,
                });

                mapAnalytics.checkFirstInteraction('map_search');
            },
            {
                once: true,
            },
        );

        // Hide the featured destinations and display the categories.
        mainMapStore.showDestinations = false;
        mainMapStore.showCategories = true;
    }

    /**
     * Run a Google nearby search.
     * 
     */
    function searchByCategory() {
        const map = context.gMap.value;
        const nearbySearch = context.nearbySearch.value;
        const nearbySearchQuery = context.nearbySearchQuery.value;

        if (!map || !nearbySearch || !nearbySearchQuery) return;

        // Get the included and exclude types for the `selectedCategory` or
        // `selectedSubcategories`.
        const types =
            mapCategoryStore.selectedSubcategories.length > 0
                ? mapCategoryStore.selectedSubcategoryTypes
                : mapCategoryStore.selectedCategoryTypes;

        // Get the label(s) for the `selectedCategory` or
        // `selectedSubcategories.
        const label =
            mapCategoryStore.selectedSubcategories.length > 0
                ? mapCategoryStore.selectedSubcategoryLabels
                : mapCategoryStore.selectedCategoryLabel;

        // Reset the map so that previous results are removed.
        resetMap(false, false);

        // Only clear the search term if "Self catering" hasn't been clicked.
        if (!mapCategoryStore.selfCateringClicked) {
            resetTextQuery();
        }

        // Set the search term to match the label and add the
        // `selectedDestination`, if there is one.
        const newSearchTerm = (mapCategoryStore.selectedDestination)
            ? `${label} ${mapCategoryStore.selectedDestination}`
            : label;

        mainMapStore.searchTerm = newSearchTerm;
        mainMapStore.query = mainMapStore.searchTerm ?? '';
 
        // Make sure the categories are visible and the mobile drawer is open.
        mainMapStore.showCategories = true;
        mainMapStore.isSidebarOpen = true;

        context.currentSearchId.value += 1;
        const searchId = context.currentSearchId.value;
        mainMapStore.filterUsesCount += 1;
        context.searchType.value = 'nearby';

        // Calculate the search radius.
        const bounds = map.getBounds();
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

        // Add the includedTypes and excludedTypes to the `nearbySearchQuery`
        // element.
        if (types && nearbySearchQuery) {
            nearbySearchQuery.includedTypes = [...types.included];
            nearbySearchQuery.excludedTypes = [...types.excluded];
        }
    
        nearbySearchQuery.maxResultCount = NUMBER_OF_RESULTS;
        nearbySearchQuery.locationRestriction = {
            center: map.getCenter()!,
            radius: cappedRadius,
        };

        // Update `nearbySearchQuery` in the map context.
        context.nearbySearchQuery.value = nearbySearchQuery;

        nearbySearch.style.display = 'block';

        // Create an analytics event once the search is complete.
        nearbySearch.addEventListener(
            'gmp-load',
            () => {
                if (searchId !== context.currentSearchId.value) return;

                mapMarkers.addMarkers(searchId);
                context.lastSearchViewport.value = viewportController.getViewport();

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
                    results_count: nearbySearch.places?.length,
                    filter_usage_index: mainMapStore.filterUsesCount,
                });

                mapAnalytics.checkFirstInteraction('map_filter');
            },
            {
                once: true,
            },
        );

        // Update the URL parameters.
        if (mapCategoryStore.selectedDestination) {
            // If there's a `selectedDestination` then make sure the `location`
            // parameter is set.
            setUrlParameters({
                location: true,
                category: mapCategoryStore.selectedCategory ? true : false,
                subcategories: mapCategoryStore.selectedSubcategories.length
                    ? true
                    : false,
            });
        } else {
            // If there's not a `selectedDestination` then make sure the
            // `coords` and `zoom` parameters are set.
            setUrlParameters({
                category: mapCategoryStore.selectedCategory ? true : false,
                subcategories: mapCategoryStore.selectedSubcategories.length
                    ? true
                    : false,
                coords: true,
                zoom: true,
            });
        }
    }

    /**
     * Search the current viewport area re-running the previous search
     * or running a "Things to do" search if no previous search.
     */
    function searchArea() {
        mainMapStore.showDestinations = false;
        mainMapStore.isSidebarOpen = true;
        mapCategoryStore.selectedDestination = '';
        mainMapStore.showSearchAreaButton = false;

        // Check if the previous search was for the 'self-catering' subcategory.
        if (mapCategoryStore.selectedSubcategories.includes('self-catering')) {
            mainMapStore.searchTerm =
                mapCategoryStore.getSubcategoryLabel('self-catering');
            mapCategoryStore.selfCateringClicked = true;
            searchByText();
        // Check if the previous search was for a category search.
        } else if (
            mapCategoryStore.selectedCategory ||
            mapCategoryStore.selectedSubcategories.length > 0
        ) {
            searchByCategory();
        // Check if the previous search was a text search.
        } else if (mainMapStore.searchTerm) {
            searchByText(true);
        // If there wasn't a previous search, start a 'things-to-do' category
        // search.
        } else {
            mapCategoryStore.selectCategory('things-to-do');
        }
    }

    /**
     * Start a search when a category or subcategory has been selected.
     */
    function handleCategoryUpdate() {
        // If the 'self-catering' subcategory has been selected then start a
        // text search.
        if (mapCategoryStore.selectedSubcategories.includes('self-catering')) {
            mainMapStore.searchTerm =
                mapCategoryStore.getSubcategoryLabel('self-catering');
            mapCategoryStore.selectedDestination = '';
            searchByText();
        // If the 'self-catering' subcategory has not been selected then start a
        // category search.
        } else if (
            mapCategoryStore.selectedCategory ||
            mapCategoryStore.selectedSubcategories.length > 0
        ) {
            searchByCategory();
        }
    }

    /**
     * Set the URL query parameters base on the map settings.
     * 
     * @param options - which parameters to set.
     * @param options.searchTerm - whether to set the `search-term` parameter.
     * @param options.location - whether to set the `location` parameter.
     * @param options.category - whether to set the `category` parameter.
     * @param options.subcategories - whether to set the `subcategories` parameter.
     * @param options.coords - whether to set the `coords` parameter.
     * @param options.zoom - whether to set the `zoom` parameter.
     */
    async function setUrlParameters(options: UrlParameter) {
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

    /**
     * Checks if the subcategories pass in as a URL parameter are children
     * of the passed in category.
     * 
     * @param category - id of the category.
     * @param subcategories - string of subcategories.
     */
    function setSubcategories(category: string, subcategories: string) {
        if (!subcategories) return;

        // Remove any subcategories that aren't children of the category.
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

    /**
     * Handle any map parameters that appear in the URL.
     */
    function handleUrlParams() {
        const map = context.gMap.value;
        if (!map) return false;

        const route = useRoute();        

        // This is needed to correctly set the type of the URL parameter.
        const getValue = (id: string) =>
            typeof route.query[id] === 'string'
                ? route.query[id]
                : '';

        // Get the values for the URL map parameters.
        const category: string = getValue('category');
        const coords: string = getValue('coords');
        const location: string = getValue('location');
        const searchTerm: string = getValue('search-term');
        const subcategories: string = getValue('subcategories');
        const zoom: string = getValue('zoom');

        // Handle the location parameter.
        if (location) {
            // Check that the location matches one of our featured destinations.
            const placeData = mapCategoryStore.featuredDestinations.find((place: FeaturedDestination) => (
                place.properties.title.toLowerCase() === location.toLowerCase()
            ));

            // If the location matches a featured destination then zoom into
            // that location and start a category search.
            if (placeData) {
                mapMarkers.handleFeaturedLocationClick(placeData, category);
                // Set the `selectedCategory` and `selectedSubcategories` if
                // those parameters are set.
                setSubcategories(category, subcategories);
                return true;
            }
        }

        // Handle the `coords` and `zoom` parameters.
        // Both must be set or they will be ignored.
        if (coords && zoom) {
            mainMapStore.showDestinations = false;

            const providedZoom = Number(zoom);
            const providedCoords = coords.split(',');

            viewportController.runProgrammaticMove(() => {
                // Move the map to the coords and set the zoom level.
                map.setZoom(Number(providedZoom));
                map.setCenter(
                    new google.maps.LatLng(
                        Number(providedCoords[0]),
                        Number(providedCoords[1]),
                    ),
                );
            });

            // Set the `selectedCategory` and `selectedSubcategories` if
            // those parameters are set.
            if (category && subcategories) {
                setSubcategories(category, subcategories);
            }

            // Start a category search with that category.
            mapCategoryStore.selectCategory(category);
            return true;
        }

        // Handle the 'search-term' parameter
        if (searchTerm) {
            // Set the `searchTerm` value and start a text search.
            mainMapStore.searchTerm = searchTerm;
            searchByText();
            return true;
        }
    }

    // Create an object with the `selectedCategory` and `selectedSubcategories`
    // values. This will update whenever either of these are updated, which
    // means that this can be watched for changes and trigger a search.
    const searchCriteria = computed(() => ({
        category: mapCategoryStore.selectedCategory,
        subcategories: [...mapCategoryStore.selectedSubcategories],
    }));

    // Trigger a search when either the `selectedCategory` or
    // `selectedSubcategories` values change.
    watch(searchCriteria, (newValue, oldValue) => {
        if (newValue === oldValue) return;
        handleCategoryUpdate();
    });

    return {
        handleUrlParams,
        resetMap,
        searchArea,
        searchByText,
        setUrlParameters,
    };
}
