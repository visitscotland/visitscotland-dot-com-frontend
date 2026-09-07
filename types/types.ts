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

/** Travel Information module */
export type Copy = {
    contentType: string;
    value: string;
};

export type TransportRow = {
    transport: {
        key: string;
        label: string;
    };
    copy: Copy;
}

export type TravelTabContent = {
    title: string;
    travelInformationTransportRows?: TransportRow[];
    copy?: Copy;
}
