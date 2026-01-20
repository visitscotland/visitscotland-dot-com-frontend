// import useFederatedSearchStore from '~/stores/federatedSearch.store.ts';

type CludoSearchResult = {
    id: string;
    title: string;
    description: string;
    imgSrc: string;
    url: string;
    dataSrc: 'cludo' | 'events';
    categoryCard: string;
}

function cleanData(data: any) {
    const documents = data.TypedDocuments;

    const results: CludoSearchResult[] = documents.map((document: any) => ({
        id: document.Fields.Id.Value || '',
        title: document.Fields.Title.Value || '',
        description: document.Fields.Description.Value || '',
        imgSrc: document.Fields.Image?.Value || '',
        url: document.Fields.Url.Value || '',
        dataSrc: 'cludo',
        categoryCard: document.Fields.categoryCard.Value || '',
    }));

    return results;
}

// eslint-disable-next-line no-undef
export default defineEventHandler(async(event) => {
    // eslint-disable-next-line no-undef
    const body = await readBody(event);

    const cludoBaseURL = 'https://api.cludo.com/api/v3';
    const cludoApiCallUrl = `${cludoBaseURL}/${body.cludoCustomerId}/${body.cludoEngineId}/search`;
    const cludoAuth = `${body.cludoCustomerId}:${body.cludoApiKey}`;

    // const federatedSearchStore = useFederatedSearchStore();
    // federatedSearchStore.eventsApiError = false;
    // federatedSearchStore.cludoError = false;

    // If no Cludo Credentials passed, show error message instead.
    // if (!cludoCredentials) {
    //     federatedSearchStore.cludoError = true;
    //     federatedSearchStore.isLoading = false;
    //     return {
    //         results: [],
    //         totalResults: 0,
    //     };
    // }

    // Don't query the Cludo API when the "Events & Festivals" is selected
    // as this data only comes from the Events API (DataThistle).
    if (body.categoryKey === 'events') {
        return {
            results: [],
            totalResults: 0,
        };
    }

    try {
        const response = await fetch(cludoApiCallUrl, {
            method: 'POST',
            body: JSON.stringify({
                query: body.searchTerm || '*',
                operator: 'or',
                responseType: 'JsonObject',
                perPage: body.categoryKey ? 12 : 6,
                page: body.page,
                facets: {
                    Category: body.categoryKey ? [body.categoryKey] : null,
                },
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${btoa(cludoAuth)}`,
            },
        });

        if (!response.ok) {
            // federatedSearchStore.cludoError = true;
            // federatedSearchStore.isLoading = false;
            throw new Error(`Cludo response message: ${response.status}`);
        }

        const results = await response.json();

        const cleanResults = cleanData(results);

        return {
            results: cleanResults,
            totalResults: results.TotalDocument,
        };
    } catch (error) {
        // federatedSearchStore.cludoError = true;
        // federatedSearchStore.isLoading = false;
        return {
            results: [],
            totalResults: 0,
        };
    }
});
