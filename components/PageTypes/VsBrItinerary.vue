<template>
    <div class="d-flex flex-column gap-500">
        <VsBrHeroSection
            :content="documentData"
            :image="heroImage"
            img-credit="Creddy McCredface"
            inset
        />
        <VsBrDaySection
            v-for="(item, index) in pageItems"
            :key="`item-${index}`"
            :day="item"
            :day-number="index + 1"
        />
    </div>
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

import VsBrProductSearch from '~/components/Modules/VsBrProductSearch.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import VsBrDaySection from '~/components/Modules/VsBrDaySection.vue';

import {
    VsDescriptionList,
    VsDescriptionListItem,
    VsTooltip,
    VsBody,
} from '@visitscotland/component-library/components';

const VsBrItineraryMap = defineAsyncComponent(() => import('~/components/Modules/VsBrItineraryMap.vue'));

const props = defineProps<{ component: Component, page: Page }>();

const { page, component } = toRefs(props);

let document : any = {
};
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
let pageItems = {
};

let allTransports = [];

let allAreas = [];

let theme = {
};

let nearbyEatLink = '';
let nearbyStayLink = '';

const itineraryPlaces : any[] = [];

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    productSearch = configStore.productSearch;
    heroImage = documentData.heroImage;

    if (configStore.otyml) {
        otyml = configStore.otyml;
    }

    if (component.value) {
        pageItems = component.value.model.models.pageItems;

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
