<template>
    <div
        v-if="!searchStore.isLoading
            && searchStore.searchResults
            && !searchStore.eventsApiError"
    >
        <VsCardGroup
            :cards-per-row="3"
            :class="searchStore.searchResults && totalPages <= 1 ? 'mb-300' : null"
        >
            <VsCard
                v-for="result in searchStore.searchResults"
                :key="result.id"
            >
                <template #vs-card-header>
                    <div class="position-relative">
                        <VsImg
                            class="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                            :src="result.imgSrc || fallbackImg"
                        />
                        <div class="position-absolute bottom-0 start-0 d-flex gap-2">
                            <VsBadge
                                v-if="result.minPrice"
                                class="rounded-top-end rounded-bottom-start"
                                variant="information"
                            >
                                {{ configStore.getLabel('search', 'price.from') }} {{ formattedPrice(result.minPrice) }}
                            </VsBadge>

                            <VsBadge
                                v-if="result.startDate"
                                class="rounded-top-end rounded-top-start"
                                variant="information"
                            >
                                {{ setEventDate(result.startDate, result.endDate) }}
                            </VsBadge>
                        </div>
                        <div class="position-absolute bottom-0 end-0 d-flex">
                            <VsBadge
                                v-if="
                                    result.categoryCard
                                        && cardCategoryLabels[result.categoryCard]"
                                class="rounded-top-start rounded-bottom-start mx-0"
                                variant="highlight"
                            >
                                {{ cardCategoryLabels[result.categoryCard] }}
                            </VsBadge>
                        </div>
                    </div>
                </template>

                <template #vs-card-body>
                    <VsHeading
                        heading-style="heading-xs"
                        level="3"
                    >
                        <VsLink
                            class="stretched-link"
                            :href="setCardLink(result)"
                            variant="secondary"
                            @click="eventClickAnalytics(result)"
                        >
                            {{ result.title }}
                        </VsLink>
                    </VsHeading>

                    <VsBody>
                        <p class="truncate-3-lines text-break">
                            {{ result.description }}
                        </p>
                    </VsBody>
                </template>

                <template #vs-card-footer>
                    <div class="d-flex justify-content-end align-items-end mt-050">
                        <div
                            v-if="result.location"
                            class="d-flex align-items-start flex-grow-1"
                        >
                            <VsIcon
                                class="me-050"
                                icon="fa-solid fa-location-dot"
                                size="sm"
                                variant="highlight"
                            />
                            <VsDetail
                                color="tertiary"
                                no-margins
                            >
                                {{ result.location }}
                            </VsDetail>
                        </div>

                        <div>
                            <VsIcon
                                v-if="result.dataSrc === 'data-thistle'"
                                icon="vs-icon-control-external-link"
                                size="sm"
                                variant="highlight"
                            />
                        </div>
                    </div>
                </template>
            </VsCard>
        </VsCardGroup>

        <VsPagination
            class="vs-search__pagination"
            v-if="searchStore.searchResults && totalPages > 1"
            :number-of-pages="totalPages"
            :next-button-label="configStore.getLabel('essentials.pagination', 'page.next')"
            :previous-button-label="configStore.getLabel('essentials.pagination', 'page.previous')"
            :page-label="configStore.getLabel('essentials.pagination', 'page.page')"
            :of-label="configStore.getLabel('essentials.pagination', 'page.of')"
            v-model="searchStore.currentPage"
            @page-click="loadPage"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
    VsBadge,
    VsBody,
    VsCard,
    VsCardGroup,
    VsDetail,
    VsHeading,
    VsIcon,
    VsImg,
    VsLink,
    VsPagination,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import useSearchStore from '~/stores/searchStore.ts';

const configStore = useConfigStore();
const searchStore = useSearchStore();

const fallbackImg = 'https://static.visitscotland.com/img/fallback-img.png';

const cardCategoryLabels = configStore.getLabelMap('content.categories');

// Calculate the number of results pages for pagination.
const totalPages = computed(() => {
    let pageCount;

    if (searchStore.categoryKey === 'events') {
        pageCount = Math.ceil(searchStore.totalResultsEvents / 12);
    } else {
        pageCount = (searchStore.totalResultsCludo >= searchStore.totalResultsEvents)
            ? Math.ceil(searchStore.totalResultsCludo / 6)
            : Math.ceil(searchStore.totalResultsEvents / 6);
    }

    return pageCount;
});

function formattedPrice(price: number) {
    if (price === null) return '';

    const priceStr = price.toString();

    return priceStr.match(/\b\d+\.\d\b/) ? `£${price}0` : `£${price}`;
};

function setEventDate(startDate: string, endDate: string) {
    return (startDate === endDate)
        ? startDate
        : `${startDate} - ${endDate}`;
}

function setCardLink(result: any) {
    if (result.url) {
        return result.url;
    }

    if (result.placeUrl) {
        return result.placeUrl;
    }

    const dataThistleBase = 'https://www.datathistle.com/event/';
    const title = encodeURIComponent(
        result.title
            .replaceAll(' ', '-')
            .toLowerCase(),
    );
    return `${dataThistleBase}${result.parentId}-${title}`;
}

function loadPage(pageNumber: number) {
    let paginatingForward = false;

    if (pageNumber > searchStore.currentPage) {
        paginatingForward = true;
    }

    searchStore.currentPage = pageNumber;

    if (typeof window !== 'undefined') {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }

    searchStore.navigationSomething();

    // eslint-disable-next-line no-use-before-define
    paginationClickAnalytics(paginatingForward);
}

function eventClickAnalytics(result) {
    // eventHasBeenClicked.value = true;

    // dataLayerHelper.createDataLayerObject('siteSearchClickEvent', {
    //     interaction_type: 'search_link_click',
    //     search_query: federatedSearchStore.searchTerm,
    //     page_number: federatedSearchStore.currentPage,
    //     click_text: result.title,
    //     click_url: setCardLink(result),
    //     click_category: result.categoryCard && props.cardCategoryLabels[result.categoryCard]
    //         ? props.cardCategoryLabels[result.categoryCard]
    //         : '',
    //     search_usage_index: federatedSearchStore.searchInSessionCount,
    //     results_count: federatedSearchStore.totalResults,
    //     query_input: federatedSearchStore.queryInput,
    // });
}

function paginationClickAnalytics(isForward) {
    // dataLayerHelper.createDataLayerObject('siteSearchClickEvent', {
    //     interaction_type: 'search_link_click',
    //     search_query: federatedSearchStore.searchTerm,
    //     page_number: federatedSearchStore.currentPage,
    //     page_navigation_direction: isForward ? 'forward' : 'back',
    //     search_usage_index: federatedSearchStore.searchInSessionCount,
    //     results_count: federatedSearchStore.totalResults,
    //     query_input: federatedSearchStore.queryInput,
    // });
}

function pageCloseAnalytics() {
    // This event should only be fired if the user is leaving search without clicking a result.
    // if (eventHasBeenClicked.value) return;

    // dataLayerHelper.createDataLayerObject('siteSearchCloseEvent', {
    //     search_query: federatedSearchStore.searchTerm,
    //     search_usage_index: federatedSearchStore.searchInSessionCount,
    //     query_input: federatedSearchStore.queryInput,
    //     page_number: federatedSearchStore.currentPage,
    //     results_count: federatedSearchStore.totalResults,
    // });
}
</script>

<style lang="scss">
.vs-search__pagination {
    margin: 4rem 0 3rem 0;

    @media (max-width: 992px) {
        margin: 1rem 0 2rem 0;
    }
}
</style>
