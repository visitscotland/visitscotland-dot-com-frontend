import type { ShallowRef, Ref } from 'vue';

export type MapMarker = Record<string, google.maps.marker.AdvancedMarkerElement>;

export type FeatureProperties = {
    id: string;
    title: string;
    description?: string;
    category: {
        id: string;
        label: string;
    };
    image?: string;
    link?: {
        label: string;
        link: string;
        type: 'INTERNAL' | 'EXTERNAL';
    };
    placeId?: string;
    viewport?: {
        low: {
            latitude: number;
            longitude: number;
        };
    };
    locationCentre?: {
        latitude: number;
        longitude: number;
    };
};

export type PointGeometry = {
    type: 'point';
    coordinates: [longitude: number, latitude: number];
};

export type MultiPolygonGeometry = {
    type: 'MultiPolygon';
    coordinates: number[][][][];
};

export type FeatureGeometry = PointGeometry | MultiPolygonGeometry;

export type FeaturedDestination = {
    type: 'feature',
    properties: FeatureProperties;
    geometry?: FeatureGeometry;
}

export type Viewport = {
    bounds: google.maps.LatLngBounds | null | undefined;
    center: google.maps.LatLng | undefined;
    zoom: number | undefined;
};

export type ViewportCenter = {
    lat: number;
    lng: number;
};

export type GmpPlaceNearbySearchRequestElement = HTMLElement & {
    excludedTypes?: string[] | null;
    includedType?: string | null;
    includedTypes?: string[] | null;
    locationRestriction?: google.maps.Circle
        | google.maps.CircleLiteral
        | null;
    maxResultCount: number;
    places?: google.maps.places.Place[];
}

export type GmpPlaceTextSearchRequestElement = HTMLElement & {
    excludedTypes?: string[] | null;
    includedType?: string | null;
    includedTypes?: string[] | null;
    locationBias?: 
        google.maps.LatLng
        | google.maps.LatLngLiteral
        | google.maps.LatLngBounds
        | google.maps.LatLngBoundsLiteral
        | null;
    locationRestriction?: google.maps.LatLngBounds
        | google.maps.LatLngBoundsLiteral
        | null;
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
    nearbySearch: Ref<GmpPlaceNearbySearchRequestElement | null>;
    nearbySearchQuery: Ref<GmpPlaceNearbySearchRequestElement | null>;
    searchType: Ref<'nearby' | 'text' | undefined>;
    selectedPlace: Ref<google.maps.places.Place | null>;
    textSearch: Ref<GmpPlaceTextSearchRequestElement | null>;
    textSearchQuery: Ref<GmpPlaceTextSearchRequestElement | null>;
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

export type CategoryId = 'accommodation' | 'food-drink' | 'things-to-do' | 'travel-information';

export type TypeKey = 'includedType' | 'excludedType';

export type Subcategory = {
    id: string;
    includedType: string[];
    excludedType?: string[];
};

export type SubcategoryMap = Subcategory & {
    categoryId: string;
};

export type Category = {
    id: CategoryId;
    icon: string;
    includedType?: string[];
    excludedType?: string[];
    subCategory: Subcategory[];
    keywords?: string[];
};

export type Categories = Record<CategoryId, Category>;

export type UrlParameter = {
    searchTerm?: boolean;
    location?: boolean;
    category?: boolean;
    subcategories?: boolean;
    coords?: boolean;
    zoom?: boolean;
}
