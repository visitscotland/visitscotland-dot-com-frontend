// eslint-disable-next-line no-undef
export default defineEventHandler(async(event) => {
    // eslint-disable-next-line no-undef
    const body = await readBody(event);

    const cludoBaseURL = 'https://api.cludo.com/api/v3';
    const cludoApiCallUrl = `${cludoBaseURL}/${body.cludoCustomerId}/${body.cludoEngineId}/Autocomplete`;
    const cludoAuth = `${body.cludoCustomerId}:${body.cludoApiKey}`;

    try {
        const response = await fetch(cludoApiCallUrl, {
            method: 'post',
            body: JSON.stringify({
                text: body.searchTerm,
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${btoa(cludoAuth)}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Cludo autocomplete search error ${response.status}`);
        }

        const suggestions = await response.json();

        return {
            suggestions,
            error: null,
        };
    } catch (error: any) {
        console.error('Cludo autocomplete error', error);

        return {
            suggestions: null,
            error: {
                message: 'Cludo autocomplete search error.',
                status: error?.status || 500,
            },
        };
    }
});
