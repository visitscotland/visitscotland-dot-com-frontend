import type {
    FeaturedDestination,
    MapContext,
    MapMarker,
} from '~/types/main-map-types.ts';
import useMainMapStore from '../../stores/mainMap.ts';
import useMapCategoryStore from '~/stores/mapCategory.ts';
import useMapAnalytics from './useMapAnalytics.ts';
import useViewportController from './useViewportController.ts';
import { MAX_ZOOM } from '~/main-map-constants.ts';

/**
 * Handles the map markers.
 * 
 * @param context - context of the map.
 */
export default function useMapMarkers(context: MapContext) {
    const mainMapStore = useMainMapStore();
    const mapCategoryStore = useMapCategoryStore();
    const mapAnalytics = useMapAnalytics(context);
    const viewportController = useViewportController(context);

    const markers: MapMarker = {
    };

    /**
     * Remove all existing markers.
     */
    function clearMarkers() {
        for (const marker of Object.values(context.markers.value)) {
            marker.map = null;
        }

        context.markers.value = {
        };
    }

    /**
     * Make sure the sidebar and results panels are open when a user clicks a
     * search result.
     * 
     * @param place - selected Google search result.
     */
    function handlePlaceClick(place: google.maps.places.Place) {
        const map = context.gMap.value;
        if (!map) return;

        context.selectedPlace.value = place;
        mainMapStore.isSidebarOpen = true;
        mainMapStore.isSidebarResultsOpen = true;

        // Centre the map on the selected result.
        viewportController.runProgrammaticMove(() => map.setCenter(place.location!));

        google.maps.event.addListenerOnce(map, 'idle', () => {
            const zoom = map.getZoom()!;

            // Zoom out if the map is zoomed in too much.
            if (zoom != null && zoom > MAX_ZOOM) {
                viewportController.runProgrammaticMove(() => map.setZoom(MAX_ZOOM));
            }

            mapAnalytics.mapInteractionEvent('card_open', place);
        });
    }

    /**
     * When a user clicks on one of the featured destination cards,
     * pan/zoom to that destination and start a category search.
     * 
     * @param place - selected Google search result.
     * @param category - the search category.
     */
    function handleFeaturedLocationClick(place: any, category?: string) {
        const map = context.gMap.value;
        if (!map) return;

        // Hide the featured destinations.
        mainMapStore.showDestinations = false;
        mapCategoryStore.selectedDestination = place.properties.title;

        // Move to the selected destination.
        viewportController.runProgrammaticMove(() => {
            map.fitBounds(
                new google.maps.LatLngBounds(
                    new google.maps.LatLng(
                        place.properties.viewport.low.latitude,
                        place.properties.viewport.low.longitude,
                    ),
                    new google.maps.LatLng(
                        place.properties.viewport.high.latitude,
                        place.properties.viewport.high.longitude,
                    ),
                ),
            );

            map.setCenter(
                new google.maps.LatLng(
                    place.properties.locationCentre.latitude,
                    place.properties.locationCentre.longitude,
                ),
            );
        });

        // Run a category search with the passed in category,
        mapCategoryStore.selectCategory(category);

        // Make sure the sidebar is open. Used for the drawer on mobile.
        mainMapStore.isSidebarOpen = true;
    }

    /**
     * Create the custom icon for the markers.
     */
    function createMarkerIcon() {
        const markerIcon = document.createElement('div');
        markerIcon.classList.add('vs-map-marker');

        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-location-dot');

        markerIcon.appendChild(icon);

        return markerIcon;
    }

    type CreateMarkerOptions = {
        map: google.maps.Map;
        position: google.maps.LatLng | google.maps.LatLngLiteral;
        title: string;
        onClick: () => void;
    };

    /**
     * Creates the marker.
     * 
     * @param options - configuration options fo the marker 
     * @param options.map - the map instance.
     * @param options.position - the position of the marker.
     * @param options.title - the place title.
     * @param options.onClick - the handler function for the onClick event.
     * @returns The configured marker element.
     */
    function createMarker({
        map,
        position,
        title,
        onClick,
    }: CreateMarkerOptions): google.maps.marker.AdvancedMarkerElement {
        // Create the marker and add it to the map at the provided position.
        const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position,
            content: createMarkerIcon(),
            title,
        });

        // Create an event listener with the provided handling function. Allowing
        // for different click handling behaviour for different types of marker.
        marker.addListener('click', onClick);

        return marker;
    }

    /**
     * Add markers for the featured destinations.
     */
    function addDestinationMarkers() {
        const map = context.gMap.value;
        if (!map) return;

        // Clear any existing markers.
        clearMarkers();

        // Create a marker for each destination and add it to the map.
        mapCategoryStore.filteredDestinations.forEach((place: FeaturedDestination) => {
            if (place.properties.locationCentre) {
                const marker = createMarker({
                    map,
                    position: {
                        lat: place.properties.locationCentre.latitude,
                        lng: place.properties.locationCentre.longitude,
                    },
                    title: place.properties.title,
                    onClick: () => handleFeaturedLocationClick(place),
                });

                markers[place.properties.id] = marker;
            }
        });

        // Add all of the markers to the map context.
        context.markers.value = markers;
    }

    /**
     * Add marker for each of the Google search results.
     * 
     * @param searchId - the id of the current search.
     */
    async function addMarkers(searchId: number) {
        const map = context.gMap.value;
        if (!map) return;

        // Make sure this is for the current search.
        if (searchId !== context.currentSearchId.value) return;

        // Determine which search element (nearbySearch or textSearch)
        // we need to use based on the search type. We have separate HTML elements
        // for each type of search, this is a Google requirement.
        const searchRequest =
            context.searchType.value === 'nearby'
                ? context.nearbySearch.value
                : context.searchType.value === 'text'
                    ? context.textSearch.value
                    : null;

        if (!searchRequest) return;

        const places = searchRequest.places ?? [];

        // Display and error message if there's no results.
        if (places.length === 0) {
            mainMapStore.noResults = true;
            searchRequest.style.display = 'none';
        } else {
            mainMapStore.noResults = false;
            searchRequest.style.display = 'block';
        }

        const bounds = new google.maps.LatLngBounds();

        // Create a marker for each result and add it to the map.
        for (const place of places) {
            if (!place.location) continue;

            // Add `content: markerIcon` to enable custom markers
            const marker = createMarker({
                map,
                position: place.location,
                title: 'Map pin',
                onClick: () => handlePlaceClick(place),
            });

            markers[place.id] = marker;

            // Extend the map bounds to that the marker is visible.
            bounds.extend(place.location);
        }

        context.markers.value = markers;

        // Get the display name for each search result and use it to set
        // the result's marker title.
        await Promise.all(
            places.map(async(place) => {
                if (!place.location) return;

                await place.fetchFields({
                    fields: ['displayName'],
                });

                const marker = markers[place.id];

                if (marker && place.displayName) {
                    marker.title = place.displayName;
                }
            }),
        );

        context.markers.value = markers;

        viewportController.runProgrammaticMove(() => {
            if (places.length === 1 && places[0]!.location) {
                // If there's only one result then centre the map and zoom
                // in to that result position.
                map.setCenter(places[0]!.location);
                map.setZoom(14);
            } else {
                // Make sure all of the makers are visible.
                map.fitBounds(bounds);
                map.setCenter(bounds.getCenter());
            }
        });
    }

    return {
        addDestinationMarkers,
        addMarkers,
        clearMarkers,
        handleFeaturedLocationClick,
        handlePlaceClick,
    };
}
