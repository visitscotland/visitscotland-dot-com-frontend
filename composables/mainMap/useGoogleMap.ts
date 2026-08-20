import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { ref } from 'vue';

import type { GmpSelectEvent, MapContext } from '~/types/main-map-types.ts';
import useConfigStore from '~/stores/configStore.ts';
import useMainMapStore from '~/stores/mainMap.ts';
import useMapCategoryStore from '~/stores/mapCategory.ts';
import useMapMarkers from './useMapMarkers.ts';
import useViewportController from './useViewportController.ts';
import {
    CATEGORY_VISIBLE_ZOOM,
    FULL_SHADED_PLACES,
    SEARCH_AREA_MIN_ZOOM,
    SCOTLAND_BOUNDS,
    SHADED_AREA_STYLE,
    ZOOMED_IN_SHADED_PLACES,
} from '~/main-map-constants.ts';

export default function useGoogleMap(context: MapContext) {
    const configStore = useConfigStore();
    const mainMapStore = useMainMapStore();
    const mapCategoryStore = useMapCategoryStore();
    const mapMarkers = useMapMarkers(context);
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            layer.style = (options: any) => {
                if (shadedPlaces.includes(options.feature.placeId)) {
                    return SHADED_AREA_STYLE;
                }
            };
        });
    }

    function handleZoomChanged(map: google.maps.Map) {
        const zoom = map.getZoom();

        if (!zoom) return;

        const zoomedIn = zoom >= CATEGORY_VISIBLE_ZOOM;

        if (zoomedIn !== previousZoomedIn.value) {
            shadeMapAreas(map, zoomedIn);
            previousZoomedIn.value = zoomedIn;
        }

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
    }

    function handleDragStart() {
        context.moveSource.value = 'user';
    }

    function handleTilesLoaded() {
        if (context.mapLoaded.value) return;
        context.mapLoaded.value = true;

        mapMarkers.addDestinationMarkers();
    }

    function handleIdle() {
        const source = context.moveSource.value;

        context.moveSource.value = null;

        if (source !== 'user') return;

        const viewport = viewportController.getViewport();

        // Show the "Search this area" button if the user has moved the map.
        if (viewport && viewportController.hasViewportChanged(viewport)) {
            mainMapStore.showSearchAreaButton = true;
            mapCategoryStore.selectedDestinationType = mapCategoryStore
                .featuredDestinationTypes![0]!.id;
            mainMapStore.selectedDestination = '';
        }

        // TODO: analytics
        // visibleMarkerCount = getVisibleMarkerCount();
    }

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

        map.addListener('zoom_changed', () => {
            handleZoomChanged(context.gMap.value!);
        });

        map.addListener('dragstart', handleDragStart);
        map.addListener('tilesloaded', handleTilesLoaded);
        map.addListener('idle', handleIdle);

        // Handles click events in the Places UI Kit search panel for
        // both nearby and text searches.
        context.nearbySearch.value!.addEventListener(
            'gmp-select',
            handleGmpSelect,
        );
        context.textSearch.value!.addEventListener(
            'gmp-select',
            handleGmpSelect,
        );
    }

    return {
        initMap,
        loadGoogleMaps,
    };
}
