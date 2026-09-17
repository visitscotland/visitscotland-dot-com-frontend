import type { MapContext } from '~/types/main-map-types.ts';
import useMainMapStore from '~/stores/mainMap.ts';
import dataLayerComposable from '../dataLayer.ts';

/**
 * Analytic function specific to the main map.
 * 
 * @param context - context of the map.
 */
export default function useMapAnalytics(context: MapContext) {
    const mainMapStore = useMainMapStore();
    const dataLayerHelper = dataLayerComposable();

    /**
     * Check to see if the interaction is the user's first interaction with
     * the map instance.
     * 
     * @param interactionType - type of interaction
     */
    function checkFirstInteraction(interactionType: string) {
        if (!mainMapStore.firstInteraction) {
            const timeNow = Date.now();
            const timeToFirstInteraction = timeNow - mainMapStore.timeMounted;

            dataLayerHelper.createDataLayerObject('googleMapTimeToFirstInteractionEvent', {
                time_to_first_interaction_ms: timeToFirstInteraction,
                first_interaction_type: interactionType,
            });

            mainMapStore.firstInteraction = true;
        }
    }
    
    /**
     * Creates a dataLayer object for a map interaction event.
     * 
     * @param interactionType - type of interaction
     * @param place - [optional] - google search result.
     */
    async function mapInteractionEvent(interactionType: string, place?: google.maps.places.Place) {
        const map = context.gMap.value;
        if (!map) return;

        let cardName = '';
        let cardRating = 0;
        let cardUrl = '';
        let cardPrimaryType = '';

        if (place) {
            await place.fetchFields({
                fields: [
                    'displayName',
                    'primaryType',
                    'rating',
                    'websiteURI',
                ],
            });

            cardName = place.displayName ?? '';
            cardRating = place.rating ?? 0;
            cardUrl = place.websiteURI ?? '';
            cardPrimaryType = place.primaryType ?? '';
        }

        dataLayerHelper.createDataLayerObject('googleMapInteractionEvent', {
            interaction_type: interactionType,
            search_query: mainMapStore.searchTerm,
            map_location: map.getCenter()?.toString(),
            visible_attractions_count: mainMapStore.visibleMarkerCount,
            card_attraction_name: cardName,
            card_attraction_category: cardPrimaryType,
            card_attraction_rating: cardRating,
            card_attraction_url: cardUrl,
            interaction_timestamp_ms: Date.now(),
        });

        checkFirstInteraction(interactionType);
    };

    /**
     * Gets the current number of visible markers.
     */
    function getVisibleMarkerCount() {
        const map = context.gMap.value;
        if (!map) return;

        const bounds = map.getBounds();

        if (!bounds) return 0;

        let visibleCount = 0;

        const markers = context.markers.value;

        for (const marker of Object.values(markers)) {
            const position = marker.position;

            if (position && bounds.contains(position)) {
                visibleCount += 1;
            }
        }

        return visibleCount;
    }
    
    return {
        checkFirstInteraction,
        getVisibleMarkerCount,
        mapInteractionEvent,
    };
}