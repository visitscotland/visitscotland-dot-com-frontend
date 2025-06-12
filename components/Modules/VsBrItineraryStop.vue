<template>
    <VsItineraryStop
        :stop-number="`${stop.index}`"
        :stop-label="stop.title"
        :stop-title="stop.subTitle ? stop.subTitle : ''"
    >
        <VsBrImageWithCaption
            v-if="stop.image"
            :image="stop.image.cmsImage ? stop.image.cmsImage : null"
            :image-string="stop.image.externalImage ? stop.image.externalImage : ''"
            :full-image-data="stop.image"
        />

        <template
            #stop-description
        >
            <div
                v-html="stop.description.value"
            />

            <VsLink
                v-if="stop.ctaLink"
                :href="stop.ctaLink.link"
                :type="stop.ctaLink.type === 'internal' ? null : stop.ctaLink.type"
                class="d-inline-block mb-100"
            >
                {{ stop.ctaLink.label }}
            </VsLink>
        </template>

        <template
            #stop-time-to-explore
            v-if="stop.timeToExplore"
        >
            <VsDescriptionList class="mb-100 justify-content-start" inline>
                <VsDescriptionListItem title class="mb-0 me-0 pe-025 col-auto">
                    {{ configStore.getLabel("itinerary", "stop.time-to-explore") }}
                </VsDescriptionListItem>
                <VsDescriptionListItem class="mb-0 col-auto px-0">
                    {{ stop.timeToExplore }}
                </VsDescriptionListItem>
            </VsDescriptionList>
        </template>

        <VsItineraryTips
            v-if="stop.tipsTitle"
        >
            <template
                #text
            >
                <div>
                    <strong>{{ stop.tipsTitle }}</strong>
                    <div
                        v-html="stop.tipsBody.value"
                    />
                </div>
            </template>

            <template
                #svg
            >
                <VsSvg path="highland-cow" />
            </template>
        </VsItineraryTips>

        <template
            #stop-address
            v-if="stop.address"
        >
            <VsAddress>
                <span v-if="stop.address.line1">{{ stop.address.line1 }},</span>
                <span v-if="stop.address.line2">{{ stop.address.line2 }},</span>
                <span v-if="stop.address.line3">{{ stop.address.line3 }},</span>
                <span v-if="stop.address.city">{{ stop.address.city }}{{ stop.address.postCode ? ',' : '' }}</span>
                <span v-if="stop.address.postCode">{{ stop.address.postCode }}</span>
            </VsAddress>
        </template>

        <!-- <template
            #stop-opening
        >
            Opening Times
        </template> -->

        <template
            #stop-facilities
        >
            <VsIconList
                :title="configStore.getLabel('essentials.global', 'keyfacilities.title')"
            >
                <VsIconListItem
                    v-for="(facility, index) in stop.facilities"
                    :key="index"
                    :icon="facility.id"
                    :label="facility.name"
                />
            </VsIconList>
        </template>

        <template
            #stop-buttons
            v-if="isLastStop"
        >
            <VsItineraryBorderOverlapWrapper>
                <!-- TODO - Generate urls for these - productSearchBuilder? -->
                <VsButton
                    class="mb-075"
                    variant="secondary"
                    icon="food"
                    href="#"
                >
                    {{ configStore.getLabel("itinerary", "stop.nearby-eat") }}
                </VsButton>
                <VsButton
                    variant="secondary"
                    icon="product-accommodation"
                    href="#"
                >
                    {{ configStore.getLabel("itinerary", "stop.nearby-stay") }}
                </VsButton>
            </VsItineraryBorderOverlapWrapper>
        </template>
    </VsItineraryStop>
</template>

<script lang="ts" setup>
import useConfigStore from '~/stores/configStore.ts';

import VsBrImageWithCaption from '~/components/Modules/VsBrImageWithCaption.vue';

import {
    VsItineraryStop,
    VsItineraryTips,
    VsDescriptionList,
    VsDescriptionListItem,
    VsLink,
    VsAddress,
    VsItineraryBorderOverlapWrapper,
    VsButton,
    VsIconList,
    VsIconListItem,
    VsSvg,
} from '@visitscotland/component-library/components';

const props = defineProps<{
    stop: any,
    isLastStop?: boolean,
}>();

const configStore = useConfigStore();

const stop: any = props.stop;
const isLastStop: boolean = props.isLastStop || false;
</script>
