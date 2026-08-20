import type { ShallowRef, Ref } from 'vue';

export type MapMarker = Record<string, google.maps.marker.AdvancedMarkerElement>;

export type Viewport = {
    bounds: google.maps.LatLngBounds | null | undefined;
    center: google.maps.LatLng | undefined;
    zoom: number | undefined;
};

export type ViewportCenter = {
    lat: number;
    lng: number;
};

export type GmpPlaceSearchRequestElement = HTMLElement & {
    excludedTypes?: string[] | null;
    includedType?: string | null;
    includedTypes?: string[] | null;
    locationBias?: 
        google.maps.LatLng
        | google.maps.LatLngLiteral
        | google.maps.LatLngBounds
        | google.maps.LatLngBoundsLiteral
        | null;
    locationRestriction?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral | null;
    maxResultCount: number;
    places?: google.maps.places.Place[];
    textQuery?: string | null;
}

export type GmpSelectEvent = Event & {
    place: google.maps.places.Place;
};

export type MoveSource = 'user' | 'programmatic' | null;

export type MapContext = {
    currentSearchId: Ref<number>;
    gMap: ShallowRef<google.maps.Map | null>;
    lastSearchViewport: Ref<Viewport | null>;
    mapLoaded: Ref<boolean>;
    markers: Ref<MapMarker>;
    moveSource: Ref<MoveSource>;
    nearbySearch: Ref<GmpPlaceSearchRequestElement | null>;
    nearbySearchQuery: Ref<GmpPlaceSearchRequestElement | null>;
    searchType: Ref<'nearby' | 'text' | undefined>;
    selectedPlace: Ref<google.maps.places.Place | null>;
    textSearch: Ref<GmpPlaceSearchRequestElement | null>;
    textSearchQuery: Ref<GmpPlaceSearchRequestElement | null>;
}

export type SubcategoryLabel = {
    id: string;
    label: string;
};

export type MapLabels = {
    id: string;
    label: string;
    cmsData?: boolean;
    subCategory: SubcategoryLabel[];
}