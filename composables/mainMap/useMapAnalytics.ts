import type { MapContext } from '~/types/main-map-types.ts';
import useMainMapStore from '~/stores/mainMap.ts';
import dataLayerComposable from '../dataLayer.ts';

export default function useMapAnalytics(context: MapContext) {
    const mainMapStore = useMainMapStore();
    const dataLayerHelper = dataLayerComposable();

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
    
    async function mapInteractionEvent(interactionType: string, place?) {
        const map = context.gMap.value;
        if (!map) return;

        let cardName = '';
        let cardRating = '';
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

            cardName = place.displayName;
            cardRating = place.rating;
            cardUrl = place.websiteURI;
            cardPrimaryType = place.primaryType;
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

    function getVisibleMarkerCount() {
        const map = context.gMap.value;
        if (!map) return;

        const bounds = map.getBounds();

        if (!bounds) return 0;

        let visibleCount = 0;

        const markers = context.markers.value;

        for (let x = 0; x < Object.keys(markers).length; x++) {
            const marker = markers[Object.keys(markers)[x]];

            const position = marker.position;

            if (bounds.contains(position)) {
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