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
            throw new Error(`Autocomplete search error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Autocomplete search error: ${error}`);
    }
});
