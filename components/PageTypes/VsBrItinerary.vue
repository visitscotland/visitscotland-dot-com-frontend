<template>
    <div class="d-flex flex-column gap-500">
        <VsBrHeroSection
            :content="documentData"
            :image="heroImage"
            inset
        />
        <!-- <VsContainer>
            <VsRow class="mt-500">
                <VsCol
                    cols="12"
                    lg="8"
                >
                    <VsPanel>
                        <VsContainer>
                            <VsRow class="align-items-center">
                                <VsCol cols="12" md="9" class="mb-175 mb-md-0">
                                    <VsHeading 
                                        heading-style="heading-xs"
                                        level="3"
                                        no-margins
                                        class="mb-125"
                                    >
                                        Trip highlights
                                    </VsHeading>

                                    <div class="d-flex flex-wrap column-gap-300 row-gap-150 align-items-end">
                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            icon="fa-regular fa-binoculars"
                                            icon-variant="tertiary"
                                        >
                                            Sightseeing
                                        </VsDetail>

                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            icon="fa-regular fa-route"
                                            icon-variant="tertiary"
                                        >
                                            295 miles (472km)
                                        </VsDetail>

                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            icon="fa-regular fa-calendar-range"
                                            icon-variant="tertiary"
                                        >
                                            6 days
                                        </VsDetail>

                                        <VsDetail
                                            no-margins 
                                            color="tertiary"
                                            icon="fa-regular fa-taxi"
                                            icon-variant="tertiary"
                                        >
                                            Car
                                        </VsDetail>

                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            icon="fa-regular fa-location-dot"
                                            icon-variant="tertiary"
                                        >
                                            Edinburgh & The Lothians, Fife, Dundee & Angus
                                        </VsDetail>
                                    </div>
                                </VsCol>
                                <VsCol cols="12" md="3">
                                    <VsIllustratedMap
                                        width="145px"
                                        class="d-block mx-auto"
                                        :highlighted-regions="['edinburgh', 'fife', 'dundee']"
                                    />
                                </VsCol>
                            </VsRow>
                        </VsContainer>
                    </VsPanel>
                </VsCol>
            </VsRow>
        </VsContainer> -->
        <!-- <VsContainer>
        <VsRow>
            <VsCol>
                <div class="p-175 bg-heather-10 rounded-75" style="background-color: #e5e5f0;">
                    <ul>
                        <li
                            v-for="(highlight, i) in documentData.highlights"
                            :key="i"
                        >
                            {{ highlight }}
                        </li>
                    </ul>
                </div>
            </VsCol>
        </VsRow>
    </VsContainer> -->
        <VsBrDaySection
            v-for="(day, index) in itinerary.days"
            :key="`day-${index}`"
            :day="day"
        />
    </div>

    <!-- <VsItinerary>
        <template #list>
            <VsItineraryDay
                v-for="(day, index) in itinerary.days"
                :key="index"
                :day-number="`${index + 1}`"
                :day-label="configStore.getLabel('itinerary', 'day')"
                :day-title="day.ttle"
            >
                <template
                    #day-introduction
                    v-if="day.introduction"
                >
                    <div
                        v-html="day.introduction.value"
                    />
                </template>

<template #day-transport v-if="day.transports">
                    <VsDescriptionList
                        class="text-center justify-content-center mb-075 has-edit-button"
                        inline
                    >
                        <VsDescriptionListItem
                            title
                            class="col-auto px-0"
                        >
                            {{ configStore.getLabel("itinerary", "transport") }}
                        </VsDescriptionListItem>

                        <VsDescriptionListItem
                            class="col-auto px-0"
                            v-for="(transport, transportIndex) in day.transports"
                            :key="transportIndex"
                        >
                            <VsTooltip
                                :title="configStore.getLabel('transports', '${transport}')"
                                href="#"
                                :icon="getDMSIconName(transport)"
                                size="sm"
                                icon-only
                                variant="transparent"
                            >
                                <span class="visually-hidden">
                                    {{ configStore.getLabel("transports", "${transport}") }}
                                </span>
                            </VsTooltip>
                        </VsDescriptionListItem>
                    </VsDescriptionList>
                </template>

<template #stops v-if="day.stops">
                    <VsBrItineraryStop
                        v-for="(stop, stopsIndex) in day.stops"
                        :key="stopsIndex"
                        :stop="stop"
                        :is-last-stop="stopsIndex === day.stops.length - 1"
                        :nearby-eat-link="nearbyEatLink"
                        :nearby-stay-link="nearbyStayLink"
                    />
                </template>
</VsItineraryDay>
</VsItinerary> -->

    <NuxtLazyHydrate :when-visible="{ rootMargin: '50px' }">
        <VsBrSocialShare :no-js="true" />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate :when-visible="{ rootMargin: '50px' }">
        <VsBrProductSearch v-if="productSearch" class="mt-300 mt-lg-600" />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate :when-visible="{ rootMargin: '50px' }">
        <VsBrHorizontalLinksModule v-if="otyml" :module="otyml" theme="light" />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate :when-visible="{ rootMargin: '50px' }">
        <VsBrNewsletterSignpost
            v-if="!documentData.hideNewsletter && configStore.newsletterSignpost"
            :data="configStore.newsletterSignpost"
        />
    </NuxtLazyHydrate>
</template>

<script lang="ts" setup>
import { toRefs, defineAsyncComponent } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore.ts';
import VsBrProductSearch from '~/components/Modules/VsBrProductSearch.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';

import {
    VsItineraryDay,
    VsDescriptionList,
    VsDescriptionListItem,
    VsTooltip,
    VsHeading,
    VsBody,
    VsContainer,
    VsRow,
    VsCol,
    VsImg,
    VsPanel,
    VsDetail,
} from '@visitscotland/component-library/components';

import VsBrHeroSection from '../Modules/VsBrHeroSection.vue';
import VsBrDaySection from '../Modules/VsBrDaySection.vue';

const props = defineProps<{ component: Component, page: Page }>();

const { page, component } = toRefs(props);

let document: any = {
};
let documentData: any = {
};
let productSearch: any = {
};
let heroImage = {
};
let otyml: any = null;

const configStore = useConfigStore();

let itinerary = {
};

let allTransports = [];

let allAreas = [];

let theme = {
};

let nearbyEatLink = '';
let nearbyStayLink = '';

const itineraryPlaces: any[] = [];

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    productSearch = configStore.productSearch;
    heroImage = documentData.heroImage;

    if (configStore.otyml) {
        otyml = configStore.otyml;
    }

    if (component.value) {
        itinerary = component.value.model.models.itinerary;

        allTransports = itinerary.transports;
        allAreas = itinerary.areas;
        theme = itinerary.theme;

        nearbyEatLink = itinerary.lastStopNearbyEat;
        nearbyStayLink = itinerary.lastStopNearbyStay;

        if (itinerary.days) {
            const allStops = [];

            for (let x = 0; x < Object.keys(itinerary.stops).length; x++) {
                const nextStop = itinerary.stops[Object.keys(itinerary.stops)[x]];

                allStops[nextStop.hippoBean.$ref] = nextStop;
            }

            for (let x = 0; x < itinerary.days.length; x++) {
                if (itinerary.days[x].$ref) {
                    itinerary.days[x] = page.value.getContent(itinerary.days[x]);
                }
                if (itinerary.days[x].model) {
                    itinerary.days[x] = itinerary.days[x].model.data;
                }

                if (itinerary.days[x].stops) {
                    for (let y = 0; y < itinerary.days[x].stops.length; y++) {
                        if (itinerary.days[x].stops[y].$ref) {
                            itinerary.days[x].stops[y] = allStops[itinerary.days[x].stops[y].$ref];
                        }

                        const stop = itinerary.days[x].stops[y];

                        if (stop.coordinates) {
                            itineraryPlaces.push({
                                title: stop.title,
                                latitude: stop.coordinates.latitude,
                                longitude: stop.coordinates.longitude,
                                stopCount: stop.index,
                                imageSrc: '', // TODO - currently no examples to work from
                                altText: stop.title,
                            });
                        }

                        if (stop.image && stop.image.cmsImage) {
                            const cmsImage = page.value.getContent(stop.image.cmsImage.$ref);
                            stop.image.imageSrc = cmsImage.getOriginal().getUrl();
                        } else if (stop.image && stop.image.externalImage) {
                            stop.image.imageSrc = stop.image.externalImage;
                        }
                    }
                }
            }
        }
    }
}
</script>
