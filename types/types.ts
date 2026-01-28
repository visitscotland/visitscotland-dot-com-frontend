export type SearchFilterCategory = {
    Key: string;
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
