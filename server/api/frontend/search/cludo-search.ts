import type { SearchApiResult } from '~/types/types.ts';

// Add the site language to the tours result URL as this does not come from Cludo.
function setToursResultUrl(url: string, category: string, langString: string) {
    if (!url) return '';

    if (category !== 'tours' || !langString) return url;

    return url.replace('/info/tours', `/${langString}/info/tours`);
}

function cleanData(data: any, langString: string) {
    const documents = data.TypedDocuments;

    const results: SearchApiResult[] = documents.map((document: any) => ({
        id: document.Fields.Id.Value || '',
        title: document.Fields.Title.Value || '',
        description: document.Fields.Description.Value || '',
        imgSrc: document.Fields.Image?.Value || '',
        url: setToursResultUrl(
            document.Fields.Url.Value,
            document.Fields.categoryCard.Value,
            langString,
        ),
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

    try {
        const response = await fetch(cludoApiCallUrl, {
            method: 'POST',
            body: JSON.stringify({
                query: body.searchTerm || '*',
                operator: body.apiOperator,
                responseType: 'JsonObject',
                perPage: 6,
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
            throw new Error(`Cludo response message: ${response.status}`);
        }

        const results = await response.json();

        const { langString } = body;
        const cleanResults = cleanData(results, langString);

        return {
            results: cleanResults,
            totalResults: results.TotalDocument,
            error: null,
        };
    } catch (error: any) {
        console.error('Cludo search error', error);
        return {
            results: [],
            totalResults: 0,
            error: {
                message: 'Cludo search error.',
                status: error?.status || 500,
            },
        };
    }
});
