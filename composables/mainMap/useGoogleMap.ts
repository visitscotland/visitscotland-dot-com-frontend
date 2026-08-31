import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { ref } from 'vue';

import type { GmpSelectEvent, MapContext } from '~/types/main-map-types.ts';
import useConfigStore from '~/stores/configStore.ts';
import useMainMapStore from '~/stores/mainMap.ts';
import useMapCategoryStore from '~/stores/mapCategory.ts';
import useMapAnalytics from './useMapAnalytics.ts';
import useMapMarkers from './useMapMarkers.ts';
import useMapSearch from './useMapSearch.ts';
import useViewportController from './useViewportController.ts';
import {
    CATEGORY_VISIBLE_ZOOM,
    FULL_SHADED_PLACES,
    SEARCH_AREA_MIN_ZOOM,
    SCOTLAND_BOUNDS,
    SHADED_AREA_STYLE,
    ZOOMED_IN_SHADED_PLACES,
} from '~/main-map-constants.ts';

/**
 * Set up of the map.
 * 
 * @param context - context of the map.
 */
export default function useGoogleMap(context: MapContext) {
    const configStore = useConfigStore();
    const mainMapStore = useMainMapStore();
    const mapCategoryStore = useMapCategoryStore();

    const mapAnalytics = useMapAnalytics(context);
    const mapMarkers = useMapMarkers(context);
    const mapSearch = useMapSearch(context);
    const viewportController = useViewportController(context);

    const previousZoomedIn = ref(false);

    /**
     * Load the required Google map libraries.
     */
    async function loadGoogleMaps() {
        setOptions({
            key: configStore.googleMapApiKey,
            v: 'quarterly',
            libraries: ['maps', 'places', 'marker', 'core', 'geometry'],
            region: 'GB',
            language: configStore.locale,
        });

        await Promise.all([
            importLibrary('maps'),
            importLibrary('places'),
            importLibrary('marker'),
            importLibrary('core'),
            importLibrary('geometry'),
        ]);
    }

    /**
     * Shade non-Scottish countries so that Scotland stands out more.
     *
     * @param {google.maps.Map} map - The map instance.
     * @param {boolean} zoomedIn - Is the map zoomed in or not.
     */
    function shadeMapAreas(map: google.maps.Map, zoomedIn: boolean) {
        const shadedPlaces = zoomedIn
            ? ZOOMED_IN_SHADED_PLACES
            : FULL_SHADED_PLACES;

        const layers = [
            map.getFeatureLayer(google.maps.FeatureType.COUNTRY),
            map.getFeatureLayer(
                google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1,
            ),
        ];

        layers.forEach((layer) => {
            layer.style = (options: any) => {
                if (shadedPlaces.includes(options.feature.placeId)) {
                    return SHADED_AREA_STYLE;
                }
            };
        });
    }

    /**
     * Handle the zoom level change.
     * 
     * @param map - the map instance.
     */
    function handleZoomChanged(map: google.maps.Map) {
        if (!context.mapLoaded.value) return;
    
        const zoom = map.getZoom();
        if (!zoom) return;

        // Set the shaded map areas depending on the current zoom level
        const zoomedIn = zoom >= CATEGORY_VISIBLE_ZOOM;
        if (zoomedIn !== previousZoomedIn.value) {
            shadeMapAreas(map, zoomedIn);
            previousZoomedIn.value = zoomedIn;
        }

        // Switch the `moveSource` to 'user' if it's not 'programmatic'.
        context.moveSource.value =
            context.moveSource.value !== 'programmatic'
                ? 'user'
                : 'programmatic';

        // Show the "Search this area" button if the user has zoomed in passed level 7.
        if (
            zoom > SEARCH_AREA_MIN_ZOOM &&
            context.moveSource.value === 'user'
        ) {
            mainMapStore.showSearchAreaButton = true;
        }

        // If the user has zoomed the map then update the URL parameters.
        if (context.moveSource.value == 'user') {
            mapSearch.setUrlParameters({
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
     * Set the `moveSource` to 'user' when the user drags the map.
     */
    const handleDragStart = () => context.moveSource.value = 'user';

    /**
     * Handle the map tiles being fully loaded.
     */
    function handleTilesLoaded() {
        // Prevent the function from running more than once.
        if (context.mapLoaded.value) return;
        context.mapLoaded.value = true;

        // Handle any URL parameters.
        const mapUpdated = mapSearch.handleUrlParams();

        // If the URL parameters haven't started a search then display the
        // destination markers and clear the URL parameters.
        if (!mapUpdated) {
            mapMarkers.addDestinationMarkers();
            
            mapSearch.setUrlParameters({
            });
        }
    }

    /**
     * Handle the map being in an idle state.
     */
    function handleIdle() {
        const visibleMarkerCount = mapAnalytics.getVisibleMarkerCount();
        mainMapStore.visibleMarkerCount = visibleMarkerCount ?? 0;

        const source = context.moveSource.value;
        const map = context.gMap.value;

        // Reset `moveSource`.
        context.moveSource.value = null;

        if (source !== 'user' || !map) return;

        const viewport = viewportController.getViewport();

        // Show the "Search this area" button if the user has moved the map.
        // Also reset the `selectedDestination` and `selectedDestinationType`.
        if (viewport && viewportController.hasViewportChanged(viewport)) {
            mainMapStore.showSearchAreaButton = true;
            mapCategoryStore.selectedDestinationType = mapCategoryStore
                .featuredDestinationTypes![0]!.id;
            mapCategoryStore.selectedDestination = '';

            // Update the URL parameters.
            mapSearch.setUrlParameters({
                category: mapCategoryStore.selectedCategory || false,
                subcategories: mapCategoryStore.selectedSubcategories.length
                    ? mapCategoryStore.selectedSubcategories
                    : false,
                coords: true,
                zoom: true,
            });
        }

        // Update the visible marker count for analytics.
        mainMapStore.visibleMarkerCount = mapAnalytics.getVisibleMarkerCount() ?? 0;
    }

    /**
     * Handle when a user clicks a search result.
     * This needs to be a separate function in order to correctly set the type.
     * 
     * @param event - gmp select event.
     */
    function handleGmpSelect(event: Event) {
        const { place } = event as GmpSelectEvent;

        if (context.markers.value[place.id]) {
            mapMarkers.handlePlaceClick(place);
        }
    }

    /**
     * Initialise the Google map.
     *
     * @param {HTMLElement} container - the map container element
     */
    function initMap(container: HTMLElement) {
        const mapOptions = {
            center: {
                lat: 56.490153,
                lng: -4.10959,
            },
            renderingType: google.maps.RenderingType.VECTOR,
            zoom: 6,
            isFractionalZoomEnabled: true,
            mapId: 'b55b94a250e70307420a5743',
            restriction: {
                latLngBounds: SCOTLAND_BOUNDS,
            },
            zoomControl: true,
            fullscreenControl: false,
            mapTypeControl: false,
            cameraControl: false,
            streetViewControl: false,
            gestureHandling: 'greedy',
        };

        const map = new google.maps.Map(container, mapOptions);
        map.fitBounds(SCOTLAND_BOUNDS);
        context.gMap.value = map;

        shadeMapAreas(map, false);
        
        // Add the event listeners to the map.
        map.addListener('zoom_changed', () => {
            handleZoomChanged(map);
        });

        map.addListener('dragstart', handleDragStart);
        map.addListener('tilesloaded', handleTilesLoaded);
        map.addListener('idle', handleIdle);

        // Handles click events in the Places UI Kit search panel for
        // both nearby and text searches.
        context.nearbySearch.value?.addEventListener(
            'gmp-select',
            handleGmpSelect,
        );
    
        context.textSearch.value?.addEventListener(
            'gmp-select',
            handleGmpSelect,
        );
    }

    return {
        initMap,
        loadGoogleMaps,
    };
}
