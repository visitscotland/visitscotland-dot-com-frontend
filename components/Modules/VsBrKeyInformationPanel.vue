<template>
    <div>
        <VsPanel class="key-information">
            <VsBody class="d-flex flex-column flex-md-row justify-content-between gap-150">
                <!-- VsBody applies — or intends to apply — "document-like" styles to its content. It ought to apply like a CSS BEM Block namespace; a hook to style its children. Passthrough classes on VsBody are (I think?) a smell. -->
                <div>
                    <VsHeading level="2" heading-style="heading-s" no-margins>
                        <!-- The no-margins prop removes default doc-like styles so that the element can be used predictably in app-like layouts (cards, accordions, etc). Here the default styles are removed by no-margins, but are re-applied by the VsBody wrapper. Heading level styles will also be in conflict -->
                        {{ module.title || 'Key Information Panel' }}
                    </VsHeading>
                    <ul class="key-information__highlights list-unstyled d-flex flex-column m-0 p-0 gap-075 mt-150 text-tertiary">
                        <!-- There's a VsDetail component that handles this icon/list-item pattern -->
                        <li v-for="highlight in module.highlights" :key="highlight.category.key" class="d-flex gap-050">
                            <span class="highlight__icon-wrapper d-flex justify-content-center">
                                <VsIcon
                                    :icon="getIconName(highlight.category.key)"
                                    variant="tertiary"
                                    aria-hidden="true"
                                    size="sm"
                                />
                            </span>
                            <span class="highlight__text">
                                <span>{{ highlight.category.value }}: </span>
                                <span
                                    class="highlight__copy"
                                    v-html="highlight.copy.value"
                                />
                            </span>
                        </li>
                    </ul>
                    <!-- Desktop button -->
                    <VsButton
                        v-if="module.cta"
                        :href="module.cta.link"
                        class="key-information__cta-desktop mt-150 d-none d-md-block"
                    >
                        {{ module.cta.label }}
                    </VsButton>
                </div>
                <div>
                    <div class="key-information__map-wrapper">
                        <!-- Map -->
                        <VsBrIllustratedMap
                            :highlighted-regions="regions"
                            :pins="mapPins"
                            :aria-label="mapAriaLabel"
                            class="d-block mx-auto"
                            width="100%"
                        />
                    </div>
                    <div>
                        <!-- Mobile button -->
                        <VsButton
                            v-if="module.cta"
                            :href="module.cta.link"
                            class="key-information__cta-mobile mt-150 d-md-none"
                        >
                            {{ module.cta.label }}
                        </VsButton>
                    </div>
                </div>
            </VsBody>
        </VsPanel>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import {
    VsBody,
    VsButton,
    VsHeading,
    VsIcon,
    VsPanel,
} from '@visitscotland/component-library/components';
import VsBrIllustratedMap, { type Region } from '~/components/Modules/VsBrIllustratedMap.vue';
import getIconName from '~/composables/getIconName.ts';

interface KeyInformationHighlight {
    category: {
        key: string,
        value: string,
    },
    copy: {
        value: string,
    };
}

interface KeyInformationModule {
    title: string,
    cta?: {
        label: string,
        link: string,
        type: string,
    },
    highlights: KeyInformationHighlight[]
}

// All the regions and data for the maps is stable and uniform across use cases isn't it? could all this be put in the illustrated map template? we don't want to do this every time the map's called?

interface KeyInformationLocation {
    id: string,
    key: string,
    name: string,
    type: string,
    latitude: number,
    longitude: number,
    parentId: string,
    types: string[],
    region: boolean,
}

const props = defineProps<{
    module: KeyInformationModule,
    locations?: KeyInformationLocation[] | null,
}>();

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

const mapPinLocations = computed(() => (props.locations ?? [])
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
</script>

<!-- I expect a certain amount of custom CSS will need to exist in the products, but I think it should be kept to a minimum. It points to something non-standard being done locally OR that the library interfaces are lacking in some way.  -->

<!-- My theory is that the CL should be all semantic BEM and no utility classes and the products should be all utilities and no BEM (or as little as possible) -->

<style lang="css" scoped>
    .key-information {
        max-width: 53.5rem /* 856px */;
        margin: 0 auto;
    }
    /* min and max widths and magic numbers make me anxious */
    
    .key-information__highlights {
        color: #535396; /* Text tertiary */
        .highlight__icon-wrapper {
            min-width: 1.6rem;
        }
        /* :deep uses vue scoped css for dynamically rendered HTML */
        /* I didn't know about this; could be useful in other places */
        .highlight__copy :deep(p) {
            display: inline;
            margin: 0;
        }
    }
    .key-information__cta-desktop {
        width: fit-content;
    }
    .key-information__cta-mobile {
        width: 100%;
    }
    @media (min-width: 576px) {
        .key-information__cta-mobile {
            width: fit-content;
        }
    }
    .key-information__map-wrapper {
        height: 25.375rem /* 406px */;
    }
    .vs-illustrated-map {
        height: 100%;
    }
    @media (min-width: 768px) {
        .key-information__map-wrapper {
            height: 100%;
            width: 9.5rem /* 152px */;
        }
    }
</style>
