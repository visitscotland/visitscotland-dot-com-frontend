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
