export type SearchFilterCategory = {
    Key: string;
    Parameter?: string;
    Label: string;
    icon?: string;
};

export type SearchApiError = {
    message: string;
    status: number;
};

export type SearchApiResult = {
    categoryCard?: string;
    dataSrc: 'cludo' | 'data-thistle';
    description?: string;
    endDate?: string;
    id: string;
    imgSrc?: string;
    venueName?: string,
    location?: string;
    minPrice?: string | number;
    startDate?: string;
    title?: string;
    parentId?: string;
    placeUrl?: string;
    url?: string;
};

export type SearchApiResults = {
    error: SearchApiError;
    results: SearchApiResult[];
    totalResults: number;
};

/* Travel Information Module */
export type Copy = {
    contentType: string;
    value: string;
};

type PracticalInformationContentTransport = {
    transport: {
        key: string;
        label: string;
    };
    copy: Copy;
    // Don't need to type the rest of the module properties.
    [key: string]: unknown;
};

type TransportInformation = {
    type: 'transport';
    title: string;
    practicalInformationContent: PracticalInformationContentTransport[];
};

type ArticleInformation = {
    type: 'article';
    title: string;
    practicalInformationContent: Copy;
};

export type TravelInformation = TransportInformation | ArticleInformation;

/* GoogleMapWithSidebar Module */

export type BrxmFeatureProperties = {
    category?: {
        id: string;
        label: string;
    };
    stopCount?: number;
    id: number | string;
    title: string;
    description?: string;
    image?: string;
    link?: {
        label: string;
        link: string;
        type: string;
    };
    subtitle?: string;
    subcategory?: object[];
};

export type BrxmFeature = {
    type: string;
    properties: BrxmFeatureProperties;
    geometry: {
        type: string;
        coordinates: number[];
    };
};

export type MapSidebarFilter = {
    id: string,
    label: string,
} 