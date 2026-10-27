<template>
    <VsContainer class="mt-075 mt-lg-200">
        <VsRow>
            <VsCol
                col
                lg="8"
            >
                <VsBrBreadcrumb />
            </VsCol>
            <VsCol
                cols="auto"
                lg="4"
                class="d-flex justify-content-end align-items-center w-auto flex-lg-fill"
            >
                <VsBrFavouriteButton
                    :uuid="documentData.id"
                    :gtm-data="{ title: documentData.title, }"
                    icon-only
                    class="d-lg-none"
                    data-test="vs-favourite-button" />
                <VsBrFavouriteButton
                    :uuid="documentData.id"
                    :gtm-data="{ title: documentData.title, }"
                    class="d-none d-lg-flex"
                    data-test="vs-favourite-button" />
            </VsCol>
        </VsRow>
    </VsContainer>

    <VsBrHeroSection
        :content="documentData"
        :image="heroImage"
        :inset="true"
    />

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }">
        <VsBrKeyInformationPanel
            v-if="configStore.pageTemplate?.keyInformationPanel"
            :module="configStore.pageTemplate.keyInformationPanel"
            :locations="location ? [location] : []"
            class="my-200 mx-075"
        />
        <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    lg="10"
                    offset-lg="1"
                >
                    <VsPanel
                        v-if="configStore.pageTemplate?.keyInformationPanel"
                        class="key-information"
                    >
                        <div
                            class="d-flex flex-column flex-md-row
                            justify-content-between 
                            gap-150"
                        >
                            <div>
                                <VsHeading
                                    level="2"
                                    heading-style="heading-l"
                                    no-margins
                                >
                                    {{ keyInfo.title || 'Key Information Panel' }}
                                </VsHeading>
                                <ul class="mt-150">
                                    <VsBody>
                                        <li 
                                            v-for="highlight in keyInfo.highlights"
                                            :key="highlight.category.key"
                                        >
                                            <VsDetail
                                                no-margins
                                                color="tertiary"
                                                :icon="getIconName(highlight.category.key)"
                                                icon-variant="tertiary"
                                            >
                                                {{ highlight.category.value }}:
                                                <VsBrRichText
                                                    :input-content="highlight.copy.value"
                                                    class="d-inline"
                                                />
                                            </VsDetail>
                                        </li>
                                    </VsBody>
                                </ul>
                                <!-- Desktop button -->
                                <VsButton
                                    v-if="keyInfo.cta"
                                    :hre                                        f="keyInfo.cta.link"
                                    class="key-information__cta-desktop mt-150 d-none d-md-block">
                                    {{ keyInfo.cta.label }}
                                </VsButton>
                            </div>
                            <!-- Map -->
                            <VsBrIllustratedMap
                                :highlighted-regions="regions"
                                :pins="mapPins"
                                :aria-label="mapAriaLabel"
                                class="w-25 align-self-center"
                            />
                            <div>
                                <!-- Mobile button -->
                                <VsButton
                                    v-if="keyInfo.cta"
                                    :href="keyInfo.cta.link"
                                    class="key-information__cta-mobile mt-150 d-md-none">
                                    {{ keyInfo.cta.label }}
                                </VsButton>
                            </div>
                        </div>
                    </VsPanel>
                </VsCol>
            </VsRow>
        </VsContainer>
    </NuxtLazyHydrate>

    <div class="mt-500" v-if="pageItems">
        <VsBrModuleBuilder :modules="pageItems" />
    </div>

    <NuxtLazyHydrate :when-visible="{ rootMargin: '50px' }">
        <VsBrSocialShare :no-js="true" />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate :when-visible="{ rootMargin: '50px' }">
        <section class="mt-500" v-if="otyml">
            <VsBrHorizontalLinksModule :module="otyml" theme="light" />
        </section>
    </NuxtLazyHydrate>

    <NuxtLazyHydrate :when-visible="{ rootMargin: '50px' }">
        <VsBrNewsletterSignpost
            v-if="!documentData.hideNewsletter && configStore.newsletterSignpost"
            :data="configStore.newsletterSignpost"
        />
    </NuxtLazyHydrate>
</template>

<script lang="ts" setup>
import { toRefs, computed } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrHeroSection from '~/components/Modules/VsBrHeroSection.vue';
import VsBrModuleBuilder from '~/components/Modules/VsBrModuleBuilder.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';
import VsBrFavouriteButton from '~/components/Modules/VsBrFavouriteButton.vue';
import VsBrIllustratedMap, { type Region } from '~/components/Modules/VsBrIllustratedMap.vue';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsBody,
    VsButton,
    VsHeading,
    VsPanel,
    VsDetail,

} from '@visitscotland/component-library/components';

const props = defineProps<{ component: Component, page: Page }>();

const { component, page } = toRefs(props);

let documentData: any = {
};
let pageItems: any[] = [];
let heroImage = {
};
let otyml: any = null;
let location: any = null;

const configStore = useConfigStore();

let firstModuleIsLink = false;

const keyInfo = configStore.pageTemplate.keyInformationPanel;

if (page.value) {
    const pageDocument = page.value.getContent(configStore.pageDocument);

    documentData = pageDocument.getData();
    location = component.value.getModels().location;
    pageItems = configStore.pageItems;
    heroImage = documentData.heroImage;
    if (configStore.otyml) {
        otyml = configStore.otyml;
    }

    if (pageItems && pageItems.length) {
        let firstNonPersonalisationModule = 0;
        if (pageItems.length > 1 && pageItems[0].type === 'PersonalisationModule') {
            firstNonPersonalisationModule = 1;
        }
        if (
            pageItems[firstNonPersonalisationModule].type === 'ListLinksModule'
            || pageItems[firstNonPersonalisationModule].type === 'MultiImageLinksModule'
            || pageItems[firstNonPersonalisationModule].type === 'SingleImageLinksModule'
        ) {
            firstModuleIsLink = true;
        }
    }
    const regionMapping: Record<string, Region> = {
        'aberdeen-city-shire': 'aberdeen',
        'argyll-isles': 'argyll',
        'airshire-arran': 'arranayr',
        borders: 'borders',
        'dumfries-galloway': 'dumfries',
        'dundee-angus': 'dundee',
        'edinburgh-lothians': 'edinburgh',
        'kingdom-fife': 'fife',
        'greater-glasgow': 'glasgow',
        highlands: 'highlands',
        'loch-lomond': 'lomond',
        orkney: 'orkney',
        'outer-hebrides': 'outerhebs',
        perthshire: 'perth',
        shetland: 'shetland',
    };

    const regionNameFallbacks: Record<Region, string> = {
        aberdeen: 'Aberdeen & Aberdeenshire',
        argyll: 'Argyll & the Isles',
        arranayr: 'Ayrshire & Arran',
        borders: 'the Scottish Borders',
        dumfries: 'Dumfries & Galloway',
        dundee: 'Dundee & Angus',
        edinburgh: 'Edinburgh & the Lothians',
        fife: 'Fife',
        glasgow: 'Greater Glasgow',
        highlands: 'the Highlands',
        lomond: 'Loch Lomond',
        orkney: 'Orkney',
        outerhebs: 'the Outer Hebrides',
        perth: 'Perthshire',
        shetland: 'Shetland',
    };

    const regionLocations = computed(() => (props.locations ?? [])
        .filter(({ id, region }) => region && id in regionMapping));

    const regions = computed<Region[]>(() => [...new Set(
        regionLocations.value
            .map(({ id }) => regionMapping[id])
            .filter((region): region is Region => region !== undefined),
    )]);

    const regionNames = computed(() => regions.value.map((mappedRegion) => {
        const location = regionLocations.value.find(({ id }) => regionMapping[id] === mappedRegion);
        return location?.name?.trim() || regionNameFallbacks[mappedRegion];
    }));

    const mapPinLocations = computed(() => (location ?? [])
        .filter(({ latitude, longitude, region }) => (
            // Only show map pins when region is false
            region === false
            && Number.isFinite(latitude)
            && Number.isFinite(longitude)
        )));

    const mapPins = computed(() => {
        return mapPinLocations.value.map(({ latitude, longitude }) => ({
            lat: latitude,
            lng: longitude,
        }));
    });

    const mapAriaLabel = computed(() => {
        const descriptions: string[] = [];

        if (regionNames.value.length === 1) {
            descriptions.push(`the ${regionNames.value[0]} region`);
        } else if (regionNames.value.length > 1) {
            descriptions.push(`regions ${regionNames.value.join(', ')}`);
        }

        const pinNames = mapPinLocations.value.map(({ name }) => name?.trim() || 'location');
        if (pinNames.length === 1) {
            descriptions.push(`a pin for ${pinNames[0]}`);
        } else if (pinNames.length > 1) {
            descriptions.push(`pins for ${pinNames.join(', ')}`);
        }

        return descriptions.length
            ? `Illustrated map of Scotland showing ${descriptions.join(' and ')}`
            : 'Illustrated map of Scotland';
    });
}

</script>
