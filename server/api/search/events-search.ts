// import useFederatedSearchStore from '~/stores/federatedSearch.store.ts';

function cleanData(data: any) {
    const events = data.events;

    const results: any[] = events.map((event:any) => ({
        id: event.id,
        parentId: event.parentId,
        title: event.name,
        description: event.descriptions?.[0]?.description || '',
        imgSrc: event.images?.[0]?.url || '',
        url: event.performances?.[0]?.url || '',
        placeUrl: event.place.website,
        location: event.place.town,
        startDate: event.startFormatted,
        endDate: event.endFormatted,
        minPrice: event.minPrice?.toString(),
        dataSrc: 'data-thistle',
        categoryCard: event.categoryCard || '',
    }));

    return results;
}

// eslint-disable-next-line no-undef
export default defineEventHandler(async(event) => {
    // eslint-disable-next-line no-undef
    const body = await readBody(event);

    // const federatedSearchStore = useFederatedSearchStore();
    // federatedSearchStore.eventsApiError = false;
    // federatedSearchStore.cludoError = false;

    let url = `${body.eventsApiUrl}?lang=${body.siteLanguage}`;
    url = body.searchTerm ? `${url}&query=${body.searchTerm}` : url;
    url = body.page > 1 ? `${url}&page=${body.page}` : url;
    url = body.startDate ? `${url}&startDate=${body.startDate}` : url;
    url = body.endDate ? `${url}&endDate=${body.endDate}` : url;
    url = body.sortBy ? `${url}&sort=${body.sortBy}` : url;
    url = body.categoryKey === 'events' ? `${url}&pageSize=12` : `${url}&pageSize=6`;
    url = body.location ? `${url}&location=${body.location}` : url;
    url = body.postcode ? `${url}&postcode=${body.postcode}` : url;
    url = body.postcodeareas ? `${url}&postcodeareas=${body.postcodeareas}` : url;
    url = body.radius ? `${url}&radius=${body.radius}` : url;

    body.subcategoryKeys.forEach((category: any) => {
        url += `&category=${category}`;
    });

    try {
        const response = await fetch(url);

        if (!response.ok) {
            // federatedSearchStore.isLoading = false;
            // federatedSearchStore.eventsApiError = true;
            throw new Error(`Events response message: ${response.status}`);
        }

        const results = await response.json();

        return {
            results: cleanData(results),
            totalResults: results.totalResults,
        };
    } catch (error) {
        // federatedSearchStore.isLoading = false;
        // federatedSearchStore.eventsApiError = true;
        return {
            results: [],
            totalResults: 0,
        };
    }
});
