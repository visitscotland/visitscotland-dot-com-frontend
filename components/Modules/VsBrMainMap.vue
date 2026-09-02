<!-- eslint-disable vue/component-name-in-template-casing -->
<template>
    <div class="vs-map">
        <div
            v-show="!showError"
            class="vs-map__container"
        >
            <VsBrMainMapSidebar
                v-model:is-open="mainMapStore.isSidebarOpen"
                v-model:is-results-open="mainMapStore.isSidebarResultsOpen"
                :heading="props.module.tabTitle ?? props.module.title"
                :map-loaded="mapContext.mapLoaded.value"
                :place="mapContext.selectedPlace.value"
                @destination-type-selected="mapMarkers.addDestinationMarkers"
                @reset-map="mapSearch.resetMap(true, false)"
                @reset-location="mapSearch.resetMap(true, true)"
                @search-input-changed="mapSearch.searchByText"
            >
                <template #vs-map-sidebar-search-results>
                    <div class="mt-075 mb-150">
                        <VsAlert
                            v-if="mainMapStore.noResults"
                            id="vs-map__alert"
                            size="small"
                        >
                            <span>
                                {{ configStore.getLabel('map', 'map.no-results-message') }}
                                <a
                                    href="#"
                                    @click.prevent="mapSearch.resetMap(true, true)"
                                >
                                    {{ configStore.getLabel('map', 'map.no-results-message') }}
                                </a>
                            </span>
                        </VsAlert>

                        <VsDetail
                            v-else
                            class="mb-150"
                            color="secondary"
                            icon="vs-icon-feedback-information"
                            icon-variant="highlight"
                            size="small"
                        >
                            {{ configStore.getLabel('map', 'map.google-results-primary-message') }}
                        </VsDetail>
                    </div>

                    <div id="search-container">
                        <gmp-place-search
                            id="nearbySearch"
                            orientation="vertical"
                            :ref="mapContext.nearbySearch"
                            selectable
                            style="display: none"
                        >
                            <gmp-place-nearby-search-request
                                id="nearbySearchQuery"
                                :ref="mapContext.nearbySearchQuery"
                            />
                            <gmp-place-content-config>
                                <gmp-place-address />
                                <gmp-place-rating />
                                <gmp-place-type />
                                <gmp-place-price />
                                <gmp-place-accessible-entrance-icon />
                                <gmp-place-opening-hours />
                                <gmp-place-reviews />
                                <gmp-place-attribution
                                    light-scheme-color="gray"
                                    dark-scheme-color="gray"
                                />
                            </gmp-place-content-config>
                        </gmp-place-search>
                        <gmp-place-search
                            id="textSearch"
                            orientation="vertical"
                            :ref="mapContext.textSearch"
                            selectable
                            style="display: none"
                        >
                            <gmp-place-text-search-request
                                id="textSearchQuery"
                                :ref="mapContext.textSearchQuery"
                            />
                            <gmp-place-content-config>
                                <gmp-place-address />
                                <gmp-place-rating />
                                <gmp-place-type />
                                <gmp-place-price />
                                <gmp-place-accessible-entrance-icon />
                                <gmp-place-opening-hours />
                                <gmp-place-reviews />
                                <gmp-place-attribution
                                    light-scheme-color="gray"
                                    dark-scheme-color="gray"
                                />
                            </gmp-place-content-config>
                        </gmp-place-search>
                    </div>
                </template>
            </VsBrMainMapSidebar>

            <div class="vs-map__wrapper">
                <div
                    data-chromatic="ignore"
                    id="vs-map"
                    map-id="vs-map"
                    ref="map-container"
                />

                <div
                    v-if="mainMapStore.showSearchAreaButton"
                    class="vs-map__search-area"
                >
                    <VsButton
                        icon="vs-icon-control-search"
                        variant="secondary"
                        @click="mapSearch.searchArea"
                    >
                        {{ configStore.getLabel('map', 'searchAreaButton') }}
                    </VsButton>
                </div>
            </div>
        </div>

        <VsWarning
            v-if="showError"
            class="vs-map__error vs-map__error--no-cookies"
            data-test="vs-map__warning--no-cookies"
            type="cookie"
        >
            {{ configStore.getLabel('map', 'map.cookies-message') }}

            <template #button-text>
                {{ configStore.getLabel('essentials.global', 'cookie.link-message') }}
            </template>
        </VsWarning>

        <VsWarning
            class="vs-map__warning vs-map__warning--no-js"
            data-test="vs-map__warning--no-js"
        >
            {{ configStore.getLabel('map', 'map.no-js') }}
        </VsWarning>
    </div>
</template>

<script setup lang="ts">
import {
    computed,
    onMounted,
    provide,
    useTemplateRef,
} from 'vue';
import {
    VsAlert,
    VsButton,
    VsDetail,
    VsWarning,
} from '@visitscotland/component-library/components';

import type { FeaturedDestination } from '~/types/main-map-types.ts';

import useConfigStore from '~/stores/configStore.ts';
import useMainMapStore from '~/stores/mainMap.ts';
import useMapCategoryStore from '~/stores/mapCategory.ts';
import createMapContext from '~/composables/mainMap/createMapContext.ts';
import useGoogleMap from '~/composables/mainMap/useGoogleMap.ts';
import useMapSearch from '~/composables/mainMap/useMapSearch.ts';
import useMapMarkers from '~/composables/mainMap/useMapMarkers.ts';
import useVerifyCookies from '~/composables/useVerifyCookies.ts';
import cookieValues from '~/utls/required-cookies-data.ts';
import VsBrMainMapSidebar from './VsBrMainMapSidebar.vue';

const props = defineProps<{ module: any }>();

const mapContainer = useTemplateRef('map-container');

const configStore = useConfigStore();
const mainMapStore = useMainMapStore();
const mapCategoryStore = useMapCategoryStore();

mapCategoryStore.categoryLabelData = props.module.filters;

const mapContext = createMapContext();
const googleMap = useGoogleMap(mapContext);
const mapSearch = useMapSearch(mapContext);
const mapMarkers = useMapMarkers(mapContext);

provide('onFeaturedLocationClick', mapMarkers.handleFeaturedLocationClick);

// Check that the required cookies have been accepted.
const cookieCheck = useVerifyCookies();
cookieCheck.requiredCookies.value = cookieValues.google_maps;

const showError = computed(() =>
    !cookieCheck.cookiesLoaded.value
    || !cookieCheck.cookiesAllowed.value,
);

/**
 * Set up the featured destinations and add them to the store.
 */
function setupFeatureDestinations() {
    const featuredPlaces = props.module.geoJson.features
        .filter((feature: FeaturedDestination) => feature.geometry?.type);

    featuredPlaces.forEach((feature: FeaturedDestination) => {
        const link = feature.properties?.link;

        if (link) {
            link.link = formatLink(link.link);
        }
    });

    mapCategoryStore.featuredDestinations = featuredPlaces;
}

/*
    Load the map libraries and initialise the map.
*/
async function initialiseMap() {
    if (showError.value || !mapContainer.value) return;
    await googleMap.loadGoogleMaps();
    googleMap.initMap(mapContainer.value);
}

// Watch the cookies and initialise the map when they've been accepted.
// This is used in case the cookies are accepted after the map mounts.
watch(
    () => [cookieCheck.cookiesAllowed.value, cookieCheck.cookiesLoaded.value],
    async([allowed, loaded]) => {
        if (allowed && loaded) {
            await initialiseMap();
        }
    },
    {
        immediate: true,
    },
);

onMounted(async() => {
    setupFeatureDestinations();

    // Load the map categories from the static server.
    await mapCategoryStore.loadMapCategories();

    mainMapStore.firstInteraction = false;
    mainMapStore.searchesCount = 0;
    mainMapStore.filterUsesCount = 0;

    await initialiseMap();
});
</script>

<style lang="scss">
.vs-map {
    //Google Maps Places UI Kit Custom Styling
    //semantic tokens don't seem to work with it
    --gmp-mat-color-surface: #fff; //$vs-color-background-primary;
    --gmp-mat-color-on-surface: #200F2E; //$vs-color-text-primary;
    --gmp-mat-color-on-surface-variant: #606060; //$vs-color-text-secondary;
    --gmp-mat-color-primary: #1F49D6; //$vs-color-text-cta-on-light;
    --gmp-mat-color-negative: #940F2C; //$vs-color-text-error;
    --gmp-mat-color-positive: #03AA46; //$vs-color-text-success;
    --gmp-mat-color-info: #A8308C; //$vs-color-icon-highlight;
    --gmp-mat-color-outline-decorative: #E9E9E9; //$vs-color-border-primary;
    --gmp-mat-font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
		'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 
		'Segoe UI Emoji', 'Segoe UI Symbol'; //$vs-font-family-sans-serif;

    gmp-place-search, gmp-place-details {
        color-scheme: only light;
    }

    &__container {
        overflow: hidden;
        position: relative;

        @media (max-width: 768px) {
            height: 90vh;
        }
    }

    &__wrapper, #vs-map {
        height: 63vh;
        position: relative;
        width: 100%;

        @media (min-width: 768px) {
            height: 90vh;
        }

        gmp-advanced-marker {
            width: 2rem;
            height: 2rem;
        }

        .vs-map-marker {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            background-color: #1F49D6;
            border-radius: 1rem;
            border: 0.125em solid #FFFFFF;
            box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.30), 0px 1px 3px 1px rgba(0,0,0,0.15);
            transition: transform 0.1s ease-in-out;
            font-size: 1.5em;
            color: #FFFFFF;

            &:hover {
                transform: scale(1.25);
            }
        }

        .vs-map__search-area {
            display: flex;
            justify-content: center;
            position: absolute;
            top: 1rem;
            left: 0;
            width: 100%;
        }
    }

    &__filter-controls {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 0.5rem;
        flex: 1;
        height: fit-content;
        width: calc(100vw - 1rem);
        margin: 0.5rem 0;
        overflow-x: auto;
        padding: 0.25rem 0.25rem 0.5rem 0.25rem;
        pointer-events: all;
        scroll-snap-type: x mandatory;

        &::-webkit-scrollbar {
            height: 4px;
        }

        &::-webkit-scrollbar-track {
            background: #F2F2F8;
            border-radius: 0.25rem;
            margin: 0 1rem 0 0;
        }

        &::-webkit-scrollbar-thumb {
            background: #1F49D6;
            border-radius: 0.25rem;
            cursor: grab;
        }

        @media (min-width: 768px) {
            width: fit-content;
            overflow-x: auto;
            margin: 0.75rem 0 0 1rem;
        }

        @media (max-width: 992px) {
            flex: 0 1 max-content;
            width: auto;
        }

        &-button {
            flex: 1 0 max-content;
            pointer-events: auto;

            &:last-child {
                margin-right: 0.25rem;
            }
        }
    }

    &__warning {
        display: none;
    }
}

.no-js {
    .vs-map {
        &__container {
            display: none;
        }

        &__warning {
            display: none;

            &--no-js {
                display: block;
            }
        }
    }
}
</style>
