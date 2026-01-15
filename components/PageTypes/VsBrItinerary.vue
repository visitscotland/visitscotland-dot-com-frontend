<template>
    <div class="d-flex flex-column gap-500">
        <VsBrHeroSection
            :content="documentData"
            :image="heroImage"
            inset
        />
        <!-- {{  document }} -->
        <!-- {{ documentData }} -->
        <!-- {{ pageIntro }} -->
        <!-- {{ introSection.model.data }} -->
        <VsContainer>
            <div class="row gap-175 gap-lg-0">
                <VsRow>
                    <VsCol>
                        <span class="vs-section-header__divider" />
                    </VsCol>
                </VsRow>
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
                                        class="mb-125 field-needed"
                                    >
                                        {{ CmsData.boxoutHeading }}
                                    </VsHeading>
                                    <div class="d-flex flex-wrap column-gap-300 row-gap-150 align-items-end">
                                        <VsDetail
                                        no-margins
                                        color="tertiary"
                                        icon="fa-regular fa-binoculars"
                                        icon-variant="tertiary"
                                        class="field-needed"
                                        >
                                        Sightseeing
                                        </VsDetail>

                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            icon="fa-regular fa-route"
                                            icon-variant="tertiary"
                                            class="field-needed"
                                        >
                                            295 miles (472km)
                                        </VsDetail>

                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            icon="fa-regular fa-calendar-range"
                                            icon-variant="tertiary"

                                            class="field-needed"
                                        >
                                            6 days
                                        </VsDetail>

                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            icon="fa-regular fa-taxi"
                                            icon-variant="tertiary"
                                            class="field-needed"
                                        >
                                            Car
                                        </VsDetail>

                                        <VsDetail
                                            no-margins
                                            color="tertiary"
                                            icon="fa-regular fa-location-dot"
                                            icon-variant="tertiary"
                                            class="field-needed"
                                        >
                                            Edinburgh & The Lothians, Fife, Dundee & Angus
                                        </VsDetail>
                                    </div>
                                </VsCol>
                                <VsCol cols="12" md="3">
                                    <VsIllustratedMap
                                        width="145px"
                                        class="d-block mx-auto"
                                        :highlighted-regions="CmsData.regions"
                                    />
                                </VsCol>
                            </VsRow>
                        </VsContainer>
                    </VsPanel>
                </VsCol>
            </div>
        </VsContainer>
        <VsBrDaySection
            v-for="(day, index) in itinerary.days"
            :key="`day-${index}`"
            :day="day"
        />
    </div>
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
    VsIllustratedMap,
    VsDetail,
    VsIcon,
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

let pageIntro = {
};

let introSection = {
};

let allTransports = [];

let allAreas = [];

let theme = {
};

let nearbyEatLink = '';
let nearbyStayLink = '';

const itineraryPlaces: any[] = [];
const CmsData = {
    boxoutHeading: 'CMS label',
    regions: [
        // 'aberdeen',
        // 'argyll',
        // 'arranayr',
        // 'borders',
        // 'dumfries',
        'dundee',
        'edinburgh',
        'fife',
        // 'glasgow',
        // 'highlands',
        // 'lomond',
        // 'orkney',
        // 'outerhebs',
        // 'perth',
        // 'shetland',
    ],
};

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    productSearch = configStore.productSearch;
    heroImage = documentData.heroImage;

    if (configStore.otyml) {
        otyml = configStore.otyml;
    }

    if (component.value) {
        itinerary = component.value.model.models.itinerary; // replaced by pageIntro
        pageIntro = component.value.model.models.pageIntro;
        introSection = page.value.getDocument(pageIntro.$ref);

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

<style>
    .field-needed {
        border: solid red 1px;
        /* background-color: red;
        opacity: 0.5; */
    }
    .changes-needed {
       /* border: solid orange 1px;  */
    }
</style>
