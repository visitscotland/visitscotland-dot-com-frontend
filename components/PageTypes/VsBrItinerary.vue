<template>
    <VsContainer class="mt-075 mt-lg-200">
        <VsRow>
            <VsCol
                cols="10"
                lg="8"
            >
                <VsBrBreadcrumb />
            </VsCol>
        </VsRow>
    </VsContainer>
    <VsContainer class="mt-250">
        <VsRow>
            <VsBrHeroHeading
                :content="documentData"
            >
                <template
                    #button
                >
                    <VsBrFavouriteButton 
                        :uuid="documentData.id"
                        :gtm-data="
                            { title: documentData.title }
                        "
                    />
                </template>
            </VsBrHeroHeading>
        </VsRow>
        <div class="mt-300">
            <VsBrImageWithMediaCaption
                :image="documentData.image"
            />
        </div>
        <VsRow class="mt-025">
            <div
                class="col-12 col-md-6 col-lg-4"
            >
                <VsPanel class="d-flex flex-column justify-content-between">
                    <div>
                        <VsHeading
                            level="2"
                            heading-style="heading-s"
                            no-margins
                        >
                            {{ configStore.getLabel('itinerary', 'key-information') }}
                        </VsHeading>
                        <div class="d-flex flex-column gap-100 mt-175 mb-150">
                            <VsHeading level="3" class="sr-only">
                                Locations
                            </VsHeading>
                            <VsDetail
                                no-margins
                                color="tertiary"
                                icon="fa-regular fa-location-dot"
                                icon-variant="tertiary"
                            >

                                <ul class="vs-itinerary-inline-list">
                                    <li
                                        v-for="location in locationNames"
                                        :key="location"
                                    >
                                        {{ location.charAt(0).toUpperCase() + location.slice(1) }}
                                    </li>
                                </ul>
                                <VsHeading
                                    level="3"
                                    class="sr-only"
                                >
                                    Duration
                                </VsHeading>
                            </VsDetail>
                            <VsDetail
                                no-margins
                                color="tertiary"
                                icon="fa-regular fa-calendar-range"
                                icon-variant="tertiary"
                            >
                                {{ durationText }}
                            </VsDetail>
                            <VsHeading
                                level="3"
                                class="sr-only"
                            >
                                Transport
                            </VsHeading>
                            <VsDetail
                                no-margins
                                color="tertiary"
                            >
                                <ul class="vs-itinerary-inline-list">
                                    <li
                                        v-for="type in transportTypes"
                                        :key="type.key"
                                    >
                                        <VsIcon
                                            size="xs"
                                            :icon="transportIcon[type.key]"
                                            variant="tertiary"
                                        />
                                        {{ type.displayName }} 
                                    </li>
                                </ul>
                            </VsDetail>
                            <VsHeading
                                level="3"
                                class="sr-only"
                            >
                                Distance
                            </VsHeading>
                            <VsDetail
                                no-margins
                                color="tertiary"
                                icon="fa-regular fa-route"
                                icon-variant="tertiary"
                            >
                                {{ distanceText }}
                            </VsDetail>
                            <VsHeading
                                level="3"
                                class="sr-only"
                            >
                                Seasons to visit
                            </VsHeading>
                            <VsDetail
                                no-margins
                                color="tertiary"
                            >
                                <ul
                                    class="vs-itinerary-inline-list"
                                >
                                    <li
                                        v-for="season in seasonInfo"
                                        :key="season.key"
                                    >
                                        <VsIcon
                                            size="xs"
                                            :icon="seasonIcon[season.key]"
                                            variant="tertiary"
                                        />
                                        {{ season.displayName }} 
                                    </li>
                                </ul>
                            </VsDetail> 
                        </div>
                    </div>
                    <div
                        class="
                            d-flex flex-column
                            flex-md-row
                            gap-075 gap-md-150
                        "
                    >
                        <VsButton
                            :href="itineraryMap.link"
                            icon="fa-regular fa-binoculars"
                            size="md"
                        >
                            {{ itineraryCta }}
                        </VsButton>
                    </div>
                </VsPanel>
            </div>
            <div
                class="
                    vs-itinerary-map
                    col-12 col-md-6 col-lg-8
                    mt-075 mt-md-0
                "
            >
                <div v-html="pageIntro.iframeMap"/>
            </div>  
        </VsRow>
    </VsContainer>
    <div
        class="
            d-flex flex-column gap-500
            mt-500
        ">
        <VsContainer>
            <VsRow>
                <VsCol>
                    <span class="vs-section-header__divider mb-0"/>
                </VsCol>
            </VsRow>
            <div class="row gap-175 gap-lg-0">
                <VsCol
                    cols="12"
                    lg="4"
                    class="mt-150"
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
                    <div
                        class="
                            d-flex flex-column
                            gap-150 gap-md-300
                    ">
                        <VsBody>
                            <VsBrRichText
                                :input-content="documentData.introduction.value"
                            />
                        </VsBody>
                    </div>
                </VsCol>
            </div>
        </VsContainer>
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

import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';

import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';
import VsBrDaySection from '~/components/Modules/VsBrDaySection.vue';
import VsBrHeroHeading from '../Modules/VsBrHeroHeading.vue';
import VsBrFavouriteButton from '../Modules/VsBrFavouriteButton.vue';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import VsBrImageWithMediaCaption from '~/components/Modules/VsBrImageWithMediaCaption.vue';

import {
    VsBody,
    VsHeading,
    VsContainer,
    VsRow,
    VsCol,
    VsPanel,
    VsDetail,
    VsButton,
    VsIcon,
} from '@visitscotland/component-library/components';


const configStore = useConfigStore();

const props = defineProps<{ component: Component, page: Page }>();

const { page, component } = toRefs(props);

let documentData : any = {
};
let pageItems = {
};
let pageIntro = {
};
let itineraryMap = null;
let numberOfMiles = null;
let numberOfKm = null;

let numberOfDays = null;
const daySingular = configStore.getLabel('itinerary', 'day');
const daysPlural = configStore.getLabel('itinerary', 'days');
let durationText = null;

let locationNames = [];
let seasonInfo = [];
let transportTypes = [];

const milesLabel = configStore.getLabel('itinerary', 'miles');
const kmLabel = configStore.getLabel('itinerary', 'kilometres-abbreviation');
let distanceText = null;

const itineraryCta = configStore.getLabel('itinerary', 'itinerary.default-cta');

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

const seasonIcon = {
    spring: 'vs-icon-season-spring',
    summer: 'vs-icon-season-summer',
    autumn: 'vs-icon-season-autumn',
    winter: 'vs-icon-season-winter',
    all: 'fa-regular fa-clock',
};

let otyml : any = null;

if (page.value) {
    const pageDocument = page.value.getContent(configStore.pageDocument);

    documentData = pageDocument.getData();
    itineraryMap = documentData.mapLink;

    if (configStore.otyml) {
        otyml = configStore.otyml;
    }

    if (component.value) {
        pageItems = component.value.model.models.pageItems;
        pageIntro = component.value.model.models.pageIntro;
        numberOfDays = pageIntro.dayCount;
        durationText = `${ numberOfDays } ${ numberOfDays === 1 ? daySingular : daysPlural }`;
        numberOfMiles = Math.round(pageIntro.distance);
        numberOfKm = Math.round(numberOfMiles * 1.6093);
        distanceText = `${ numberOfMiles } ${ milesLabel } (${ numberOfKm } ${ kmLabel })`;
        locationNames = component.value.model.models.pageIntro.locations;
        seasonInfo = component.value.model.models.pageIntro.seasons;
        transportTypes = component.value.model.models.pageIntro.transports;
    }
}
</script>

<style>

.vs-itinerary-map {
    position: relative;
    height: 75vh;
}

@media (min-width: 767px) {
    .vs-itinerary-map {
        height: auto;
    }
}

.vs-itinerary-map iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    padding-left: 12px;
    padding-right: 12px;
}

.vs-itinerary-inline-list {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.vs-itinerary-inline-list li {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
}

.vs-itinerary-inline-list li + li::before {
    content: "|  ";
}
</style>
