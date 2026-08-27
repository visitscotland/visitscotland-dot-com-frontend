import type { MapContext, MapMarker } from '~/types/main-map-types.ts';
import useMainMapStore from '../../stores/mainMap.ts';
import useMapCategoryStore from '~/stores/mapCategory.ts';
import useMapAnalytics from './useMapAnalytics.ts';
import useViewportController from './useViewportController.ts';
import { MAX_ZOOM } from '~/main-map-constants.ts';

export default function useMapMarkers(context: MapContext) {
    const mainMapStore = useMainMapStore();
    const mapCategoryStore = useMapCategoryStore();
    const mapAnalytics = useMapAnalytics(context);
    const { runProgrammaticMove } = useViewportController(context);

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

    function handlePlaceClick(place: google.maps.places.Place) {
        const map = context.gMap.value;

        if (!map) return;

        context.selectedPlace.value = place;
        mainMapStore.isSidebarOpen = true;
        mainMapStore.isSidebarResultsOpen = true;

        runProgrammaticMove(() => map.setCenter(place.location!));

        google.maps.event.addListenerOnce(map, 'idle', () => {
            const zoom = map.getZoom()!;

            if (zoom != null && zoom > MAX_ZOOM) {
                runProgrammaticMove(() => map.setZoom(MAX_ZOOM));
            }

            mapAnalytics.mapInteractionEvent('card_open', place);
        });
    }

    function handleFeaturedLocationClick(place: any, category: string) {
        const map = context.gMap.value;
        if (!map) return;

        mainMapStore.showDestinations = false;
        mapCategoryStore.selectedDestination = place.properties.title;

        runProgrammaticMove(() => {
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

        const categoryExists = category in mapCategoryStore.categoryData;
        mapCategoryStore.selectedCategory = (categoryExists) ? category : 'things-to-do';
        mainMapStore.isSidebarOpen = true;
    }

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

    function createMarker({
        map,
        position,
        title,
        onClick,
    }: CreateMarkerOptions): google.maps.marker.AdvancedMarkerElement {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position,
            content: createMarkerIcon(),
            title,
        });

        // Zoom into the destination and perform "Things to do" search.
        marker.addListener('click', onClick);

        return marker;
    }

    function addDestinationMarkers() {
        const map = context.gMap.value;
        if (!map) return;

        clearMarkers();

        mapCategoryStore.filteredDestinations.forEach((place) => {
            console.log('place', place);
            if (place.properties.locationCentre) {
                const marker = createMarker({
                    map,
                    position: {
                        lat: place.properties.locationCentre.latitude,
                        lng: place.properties.locationCentre.longitude,
                    },
                    title: place.properties.title,
                    onClick: () => handleFeaturedLocationClick(place, ''),
                });

                markers[place.properties.id] = marker;
            }
        });

        console.log('add dest', markers);
        context.markers.value = markers;
    }

    async function addMarkers(searchId: number) {
        const map = context.gMap.value;

        if (!map) return;

        if (searchId !== context.currentSearchId.value) return;

        const searchRequest =
            context.searchType.value === 'nearby'
                ? context.nearbySearch.value
                : context.searchType.value === 'text'
                    ? context.textSearch.value
                    : null;

        if (!searchRequest) return;

        const places = searchRequest.places ?? [];

        if (places.length === 0) {
            mainMapStore.noResults = true;
            searchRequest.style.display = 'none';
        } else {
            mainMapStore.noResults = false;
            searchRequest.style.display = 'block';
        }

        const bounds = new google.maps.LatLngBounds();

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
            bounds.extend(place.location);
        }

        context.markers.value = markers;

        // Get the place display name and use it to set the marker title.
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

        runProgrammaticMove(() => {
            if (places.length === 1 && places[0]!.location) {
                map.setCenter(places[0]!.location);
                map.setZoom(14);
            } else {
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
