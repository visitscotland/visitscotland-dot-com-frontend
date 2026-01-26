<template>
    <VsBrPageIntro
        :content="documentData"
        :hero-image="heroImage"
        :light-background="true"
        :itinerary="itinerary"
        :theme="theme"
        :all-transports="allTransports"
        :all-areas="allAreas"
    />

    <VsItinerary>
        <template #map>
            <component
                :is="VsBrItineraryMap"
                :places="itineraryPlaces"
            />
        </template>
        <template #list>
            <VsItineraryDay
                v-for="(day, index) in itinerary.days"
                :key="index"
                :day-number="`${index + 1}`"
                :day-label="configStore.getLabel('itinerary', 'day')"
                :day-title="day.title"
            >
                <template
                    #day-introduction
                    v-if="day.introduction"
                >
                    <VsBody>
                        <VsBrRichText :input-content="day.introduction.value" />
                    </VsBody>
                </template>

                <template
                    #day-transport
                    v-if="day.transports"
                >
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

                <template
                    #stops
                    v-if="day.stops"
                >
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
        </template>
    </VsItinerary>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrSocialShare
            :no-js="true"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrProductSearch
            v-if="productSearch"
            class="mt-300 mt-lg-600"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrHorizontalLinksModule
            v-if="otyml"
            :module="otyml"
            theme="light"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
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

import VsBrPageIntro from '~/components/Modules/VsBrPageIntro.vue';
import VsBrProductSearch from '~/components/Modules/VsBrProductSearch.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';
import VsBrItineraryStop from '~/components/Modules/VsBrItineraryStop.vue';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import {
    VsItinerary,
    VsItineraryDay,
    VsDescriptionList,
    VsDescriptionListItem,
    VsTooltip,
    VsBody,
} from '@visitscotland/component-library/components';

const VsBrItineraryMap = defineAsyncComponent(() => import('~/components/Modules/VsBrItineraryMap.vue'));

const props = defineProps<{ component: Component, page: Page }>();

const { page, component } = toRefs(props);

let documentData : any = {
};
let productSearch : any = {
};
let heroImage = {
};
let otyml : any = null;

const configStore = useConfigStore();

let itinerary = {
};

let allTransports = [];

let allAreas = [];

let theme = {
};

let nearbyEatLink = '';
let nearbyStayLink = '';

const itineraryPlaces : any[] = [];

if (page.value) {
    documentData = configStore.pageDocument.getData();
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
                    }
                }
            }
        }
    }
}

</script>
