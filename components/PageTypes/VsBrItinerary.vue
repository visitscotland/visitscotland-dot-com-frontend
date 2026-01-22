<template>
    <VsBrHeroSection
        :content="documentData"
        :image="heroImage"
        inset
    />
    <VsContainer>
        <VsRow>
            <VsCol>
                <span class="vs-section-header__divider" />
            </VsCol>
        </VsRow>
        <div class="row gap-175 gap-lg-0">
            <VsCol
                cols="12"
                lg="4"
            >
                <VsHeading
                    level="2"
                    heading-style="heading-l"
                    no-margins
                >
                    {{ documentData.subheading }}
                </VsHeading>
            </VsCol>
            <VsCol
                cols="12"
                lg="8"
            >
                <div class="d-flex flex-column gap-150 gap-md-300">
                    <VsBody>
                        <VsBrRichText
                            :input-content="documentData.introduction.value"
                        />
                    </VsBody>
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
                                        {{ configStore.getLabel('itinerary', 'highlights') }}
                                    </VsHeading>
                                    <div class="d-flex flex-wrap column-gap-300 row-gap-150 align-items-end">
                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            :icon="themeIcon[pageIntro.theme.key]"
                                            icon-variant="tertiary"
                                        >
                                            {{ pageIntro.theme.displayName }}
                                        </VsDetail>

                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            icon="fa-regular fa-route"
                                            icon-variant="tertiary"
                                        >
                                            {{ numberOfMiles }} {{ milesLabel }} ({{ numberOfKm }}{{ kmLabel }})
                                        </VsDetail>

                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            icon="fa-regular fa-calendar-range"
                                            icon-variant="tertiary"
                                        >
                                            {{ numberOfDays }} {{ numberOfDays === 1 ? daySingular : daysPlural }}
                                        </VsDetail>

                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            :icon="transportIcon[pageIntro.transports[0].key]"
                                            icon-variant="tertiary"
                                        >
                                            {{ pageIntro.transports[0].displayName }}
                                        </VsDetail>

                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            icon="fa-regular fa-location-dot"
                                            icon-variant="tertiary"
                                        >
                                            {{ pageIntro.areas[0].displayName }}
                                        </VsDetail>
                                    </div>
                                </VsCol>
                                <VsCol cols="12" md="3">
                                    <VsIllustratedMap
                                        width="145px"
                                        class="d-block mx-auto"
                                        :highlighted-regions="mapAreas"
                                    />
                                </VsCol>
                            </VsRow>
                        </VsContainer>
                    </VsPanel>
                    <div class="d-flex flex-column flex-md-row gap-075 gap-md-150">
                        <VsButton
                            :href="itineraryMap.link"
                            icon="fa-regular fa-binoculars"
                            size="md"
                        >
                            {{ itineraryMap.label || "View itinerary in Google Maps" }}
                        </VsButton>
                    </div>
                </div>
            </VsCol>
        </div>
    </VsContainer>

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
import { toRefs } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrProductSearch from '~/components/Modules/VsBrProductSearch.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import {
    VsBody,
    VsHeading,
    VsContainer,
    VsRow,
    VsCol,
    VsPanel,
    VsIllustratedMap,
    VsDetail,
    VsButton,
} from '@visitscotland/component-library/components';

const configStore = useConfigStore();

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
let pageIntro = {
};
let mapAreas = null;
let itineraryMap = null;

let numberOfMiles = null;
let numberOfKm = null;

let numberOfDays = null;
const daySingular = configStore.getLabel('itinerary', 'day').toLowerCase();
const daysPlural = configStore.getLabel('itinerary', 'days').toLowerCase();
const milesLabel = configStore.getLabel('itinerary', 'miles').toLowerCase();
const kmLabel = configStore.getLabel('itinerary', 'kilometres-abbreviation');

const transportIcon = {
    boat: 'fa-regular fa-sailboat',
    bus: 'fa-regular fa-bus',
    car: 'fa-regular fa-car-side',
    cycling: 'fa-regular fa-person-biking',
    ferry: 'fa-regular fa-ferry',
    public: 'fa-regular fa-taxi-bus',
    train: 'fa-regular fa-train',
    walking: 'fa-regular fa-person-walking',
};

const themeIcon = {
    acti: 'fa-regular fa-person-hiking',
    castle: 'fa-regular fa-chess-rook',
    city: 'fa-regular fa-city',
    familyev: 'fa-regular fa-family',
    history: 'fa-regular fa-landmark',
    islands: 'fa-regular fa-island-tropical',
    landscape: 'fa-regular fa-mountain',
    landscapes: 'fa-regular fa-mountains',
    filmev: 'fa-regular fa-camera-movie',
    spahealth: 'fa-regular fa-spa',
    whisky: 'fa-regular fa-whiskey-glass-ice',
    sightseeing: 'fa-regular fa-binoculars',
};

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    productSearch = configStore.productSearch;
    heroImage = documentData.heroImage;
    itineraryMap = documentData.mapLink;

    if (configStore.otyml) {
        otyml = configStore.otyml;
    }

    if (component.value) {
        pageIntro = component.value.model.models.pageIntro;
        mapAreas = pageIntro.areas.map((region) => region.key);
        numberOfDays = pageIntro.days.length;
        numberOfMiles = Math.round(pageIntro.distance);
        numberOfKm = Math.round(numberOfMiles * 1.6093);
    }
}
</script>
