<template>
    <div v-if="!searchStore.isLoading">
        <VsCardGroup
            v-if="!errorMessage"
            :cards-per-row="3"
            :class="searchStore.searchResults && totalPages <= 1 ? 'mb-300' : null"
        >
            <VsCard
                v-for="result in searchStore.searchResults"
                :key="result.id"
                card-style="outlined"
            >
                <template #vs-card-header>
                    <div class="position-relative">
                        <VsImg
                            class="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                            :src="result.imgSrc || fallbackImg"
                        />
                        <div class="position-absolute top-0 start-0 d-flex pt-050 ps-050">
                            <VsBadge
                                v-if="
                                    result.categoryCard
                                        && result.venueName"
                                class="rounded mx-0"
                                variant="information"
                            >
                                {{ result.venueName }}
                            </VsBadge>
                        </div>
                        <div class="position-absolute bottom-0 start-0 d-flex gap-2 pb-050 ps-050">
                            <VsBadge
                                v-if="result.minPrice"
                                class="rounded"
                                variant="information"
                            >
                                {{ configStore.getLabel('search', 'price.from') }} {{ formattedPrice(result.minPrice) }}
                            </VsBadge>

                            <VsBadge
                                v-if="result.startDate"
                                class="rounded"
                                variant="information"
                            >
                                {{ setEventDate(result.startDate, result.endDate) }}
                            </VsBadge>
                        </div>
                        <div class="position-absolute bottom-0 end-0 d-flex pb-050 pe-050">
                            <VsBadge
                                v-if="
                                    result.categoryCard
                                        && cardCategoryLabels[result.categoryCard]"
                                class="rounded mx-0"
                                variant="highlight"
                            >
                                {{ cardCategoryLabels[result.categoryCard] }}
                            </VsBadge>
                        </div>
                    </div>
                </template>

                <template #vs-card-body>
                    <div class="px-100">
                        <VsHeading
                            heading-style="heading-xxs"
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

                        <VsBody
                            :class="result.dataSrc === 'cludo' ? 'mb-100' : null"
                        >
                            <p class="truncate-2-lines text-break">
                                {{ result.description }}
                            </p>
                        </VsBody>
                    </div>
                </template>
                <template #vs-card-footer v-if="result.dataSrc === 'data-thistle'">
                    <VsBrDivider class="mx-100" />
                    <div class="d-flex justify-content-end align-items-center mt-100 px-100 pb-100">
                        <div
                            v-if="result.location"
                            class="d-flex align-items-start flex-grow-1"
                        >
                            <!-- <VsIcon
                                class="me-050"
                                icon="fa-solid fa-location-dot"
                                size="sm"
                                variant="highlight"
                            /> -->
                            <VsDetail
                                color="tertiary"
                                no-margins
                                size="small"
                                icon="fa-solid fa-location-dot"
                            >
                                {{ result.location }}
                            </VsDetail>
                        </div>

                        <div class="ps-050">
                            <!-- <VsIcon
                                v-if="result.dataSrc === 'data-thistle'"
                                icon="vs-icon-control-external-link"
                                size="sm"
                                variant="highlight"
                            /> -->
                            <VsButton
                                icon="vs-icon-control-external-link"
                                icon-position="right"
                                size="md"
                                variant="secondary"
                                style="z-index: 100; text-wrap: nowrap;"
                            >
                                View details
                            </VsButton>
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

        <div
            v-if="errorMessage"
            class="vs-federated-search__warning mb-300"
        >
            <VsWarning>{{ errorMessage }}</VsWarning>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SearchApiResult } from '~/types/types';

import { computed } from 'vue';

import {
    VsBadge,
    VsBody,
    VsButton,
    VsCard,
    VsCardGroup,
    VsDetail,
    VsHeading,
    VsIcon,
    VsImg,
    VsLink,
    VsPagination,
    VsWarning,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import useSearchStore from '~/stores/searchStore.ts';
import dataLayerComposable from '~/composables/dataLayer.ts';

const configStore = useConfigStore();
const searchStore = useSearchStore();
const dataLayerHelper = dataLayerComposable();

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

function formattedPrice(price: string | number) {
    if (price === null) return '';

    const priceStr = price.toString();

    return priceStr.match(/\b\d+\.\d\b/) ? `£${price}0` : `£${price}`;
};

function setEventDate(startDate: string, endDate: string | undefined) {
    return (startDate === endDate)
        ? startDate
        : `${startDate} - ${endDate}`;
}

function setCardLink(result: SearchApiResult) {
    if (result.url) return result.url;

    if (result.placeUrl) return result.placeUrl;

    if (!result.title) return null;

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

    searchStore.setUrlParameters();

    // eslint-disable-next-line no-use-before-define
    paginationClickAnalytics(paginatingForward);
}

const errorMessage = computed(() => {
    if (searchStore.dateError && !searchStore.isLoading) {
        return configStore.getLabel('search', 'error.date');
    }

    if (searchStore.cludoApiError && searchStore.eventsApiError) {
        return configStore.getLabel('search', 'error.cludo');
    }

    if (searchStore.eventsApiError && searchStore.categoryKey === 'events') {
        // Display events error]
        return configStore.getLabel('search', 'error.events');
    }

    if (searchStore.totalResults === 0 && !searchStore.isLoading) {
        // Display no results error.
        return configStore.getLabel('search', 'no-results');
    }

    return null;
});

function eventClickAnalytics(result: SearchApiResult) {
    searchStore.eventHasBeenClicked = true;

    dataLayerHelper.createDataLayerObject('siteSearchClickEvent', {
        interaction_type: 'search_link_click',
        search_query: searchStore.searchTerm,
        page_number: searchStore.currentPage,
        click_text: result.title,
        click_url: setCardLink(result),
        click_category: result.categoryCard && cardCategoryLabels[result.categoryCard]
            ? cardCategoryLabels[result.categoryCard]
            : '',
        search_usage_index: searchStore.searchInSessionCount,
        results_count: searchStore.totalResults,
        query_input: searchStore.queryInput,
    });
}

function paginationClickAnalytics(isForward: boolean) {
    dataLayerHelper.createDataLayerObject('siteSearchClickEvent', {
        interaction_type: 'search_link_click',
        search_query: searchStore.searchTerm,
        page_number: searchStore.currentPage,
        page_navigation_direction: isForward ? 'forward' : 'back',
        search_usage_index: searchStore.searchInSessionCount,
        results_count: searchStore.totalResults,
        query_input: searchStore.queryInput,
    });
}
</script>

<style lang="scss">

.vs-event-card__footer-button {
    z-index: 100;
}

.vs-search__pagination {
    margin: 4rem 0 3rem 0;

    @media (max-width: 992px) {
        margin: 1rem 0 2rem 0;
    }
}
</style>
