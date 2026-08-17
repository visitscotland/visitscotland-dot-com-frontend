import { shallowRef, ref } from 'vue';

import type { MapContext } from '~/types/main-map-types.ts';

export default function createMapContext(): MapContext {
    return {
        currentSearchId: ref(0),
        gMap: shallowRef(null),
        lastSearchViewport: ref(null),
        mapLoaded: ref(false),
        markers: ref({
        }),
        moveSource: ref(null),
        nearbySearch: ref(null),
        nearbySearchQuery: ref(null),
        searchType: ref(undefined),
        selectedPlace: shallowRef(null),
        textSearch: ref(null),
        textSearchQuery: ref(null),
    };
}
