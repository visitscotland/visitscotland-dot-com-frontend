<template>
    <VsBrSectionHeader
        :heading="module.title"
        :lede="module.introduction?.value"
    />

    <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    md="10"
                    offset-md="1"
                >
                    <VsBrSkiScotlandStatus
                        :ski-status-url="module.feedURL"
                        :locale="configStore.langString || 'en-gb'"
                        :runs-lifts-status-label="configStore.getLabel('ski', 'ski-centre.run-lift-status')"
                        :status-label="configStore.getLabel('ski', 'ski-centre.status')"
                        :runs-label="configStore.getLabel('ski', 'ski-centre.runs')"
                        :lifts-label="configStore.getLabel('ski', 'ski-centre.lifts')"
                        :summary-open-label="configStore.getLabel('ski', 'ski-centre.summary.open')"
                        :summary-opening-label="configStore.getLabel('ski', 'ski-centre.summary.expected-to-open')"
                        :summary-closed-label="configStore.getLabel('ski', 'ski-centre.summary.closed')"
                        :last-updated-label="configStore.getLabel('ski', 'ski-centre.last-updated')"
                        :detailed-status-label="configStore.getLabel('ski', 'ski-centre.detailed-status')"
                        :snow-conditions-label="configStore.getLabel('ski', 'ski-centre.snow-conditions.full-report')"
                        :current-weather-label="configStore.getLabel('ski', 'ski-centre.snow-conditions.current-weather')"
                        :weather-forecast-label="configStore.getLabel('ski', 'ski-centre.snow-conditions.weather-forecast')"
                        :roads-label="configStore.getLabel('ski', 'ski-centre.snow-conditions.road-status')"
                        :news-label="configStore.getLabel('ski', 'ski-centre.snow-conditions.news-from-the-slopes')"
                        :run-status-label="configStore.getLabel('ski', 'ski-centre.run-status')"
                        :lift-status-label="configStore.getLabel('ski', 'ski-centre.lift-status')"
                        :run-label="configStore.getLabel('ski', 'ski-centre.run')"
                        :lift-label="configStore.getLabel('ski', 'ski-centre.lift')"
                        :easy-label="configStore.getLabel('ski', 'ski-centre.run.easy')"
                        :intermediate-label="configStore.getLabel('ski', 'ski-centre.run.intermediate')"
                        :difficult-label="configStore.getLabel('ski', 'ski-centre.run.difficult')"
                        :very-difficult-label="configStore.getLabel('ski', 'ski-centre.run.very-difficult')"
                        :itineraries-label="configStore.getLabel('ski', 'ski-centre.run.itineraries')"
                        :other-label="configStore.getLabel('ski', 'ski-centre.run.other')"
                        :green-label="configStore.getLabel('ski', 'ski-centre.run.green')"
                        :blue-label="configStore.getLabel('ski', 'ski-centre.run.blue')"
                        :red-label="configStore.getLabel('ski', 'ski-centre.run.red')"
                        :black-label="configStore.getLabel('ski', 'ski-centre.run.black')"
                        :orange-label="configStore.getLabel('ski', 'ski-centre.run.orange')"
                        :grey-label="configStore.getLabel('ski', 'ski-centre.run.grey')"
                        :status-open-label="configStore.getLabel('ski', 'ski-centre.status.open')"
                        :status-opening-label="configStore.getLabel('ski', 'ski-centre.status.expected-to-open')"
                        :status-closed-label="configStore.getLabel('ski', 'ski-centre.status.closed')"
                    >
                        <template #data-loading>
                            <div>
                                {{ configStore.getLabel('ski', 'ski-data.loading') }}
                            </div>
                        </template>
                        <template #js-required>
                            <div>
                                {{ configStore.getLabel('ski', 'ski-data.ski-centre.no-js') }}
                            </div>
                        </template>
                        <template #data-unavailable>
                            <div>
                                {{ configStore.getLabel('ski', 'ski-data.unavailable') }}
                            </div>
                        </template>

                        <template #centre-information>
                            <div>
                                <VsHeading
                                    level="3"
                                    heading-style="heading-xs"
                                >
                                    {{ configStore.getLabel('ski', 'ski-centre.centre-information') }}
                                </VsHeading>
                                <VsList unstyled>
                                    <li class="mb-050" v-if="module.phone">
                                        <VsIcon
                                            icon="fa-regular fa-phone"
                                            size="xs"
                                            class="me-050"
                                        />
                                        <span>
                                            {{ module.phone }}
                                        </span>
                                    </li>
                                    <li class="mb-050" v-if="module.website.link">
                                        <VsIcon
                                            icon="fa-regular fa-globe"
                                            size="xs"
                                            class="me-050"
                                        />
                                        <VsLink
                                            type="external"
                                            :href="module.website.link"
                                        >
                                            {{ module.website.link }}
                                        </VsLink>
                                    </li>
                                    <li class="mb-050" v-if="module.addressLine">
                                        <VsIcon
                                            icon="fa-regular fa-location-dot"
                                            size="xs"
                                            class="me-050"
                                        />
                                        <span>
                                            {{ module.addressLine }}
                                        </span>
                                    </li>
                                    <li class="mb-050" v-if="module.pisteMap">
                                        <VsIcon
                                            icon="fa-regular fa-mountain"
                                            size="xs"
                                            class="me-050"
                                        />
                                        <VsLink
                                            type="download"
                                            :href="module.pisteMap"
                                        >
                                            {{ configStore.getLabel('ski', 'ski-centre.view-piste-map') }}
                                        </VsLink>
                                    </li>
                                    <li class="mb-050" v-if="module.openingLink && module.openingLink.label">
                                        <VsIcon
                                            icon="fa-regular fa-clock"
                                            size="xs"
                                            class="me-050"
                                        />
                                        <VsLink
                                            :type="module.openingLink.type"
                                            :href="module.openingLink.link"
                                        >
                                            {{ module.openingLink.label }}
                                        </VsLink>
                                    </li>
                                    <li class="mb-050" v-if="module.webcam">
                                        <VsIcon
                                            icon="fa-regular fa-webcam"
                                            size="xs"
                                            class="me-050"
                                        />
                                        <span>{{ configStore.getLabel('ski', 'ski-centre.webcam') }}</span>
                                    </li>
                                </VsList>
                                <VsLink
                                    v-for="(channel, index) in module.socialChannelURLs"
                                    :key="index"
                                    :href="channel"
                                    class="d-inline-block mt-100"
                                >
                                    <div class="d-inline-block me-100">
                                        <span class="visually-hidden">{{ getSocialChannelName(channel) }}</span>
                                        <VsIcon
                                            size="sm"
                                            :icon="getSocialChannelIcon(channel)"
                                            :custom-colour="getSocialChannelColour(channel)"
                                        />
                                    </div>
                                </VsLink>
                            </div>
                        </template>
                    </VsBrSkiScotlandStatus>
                </VsCol>
            </VsRow>
        </VsContainer>
</template>

<script lang="ts" setup>

import VsBrSectionHeader from './VsBrSectionHeader.vue';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsHeading,
    VsList,
    VsIcon,
    VsLink,
} from '@visitscotland/component-library/components';
import VsBrSkiScotlandStatus from '~/components/Modules/VsBrSkiScotlandStatus.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{ module: object }>();
const module: any = props.module;

const getSocialChannelName = (url: string) => {
    if (url.indexOf('facebook') !== -1) {
        return 'facebook'
    }

    if (url.indexOf('instagram') !== -1) {
        return 'instagram'
    }

    if (url.indexOf('twitter') !== -1 || url.indexOf('x.com') !== -1) {
        return 'x'
    }

    return '';
};

const getSocialChannelIcon = (url : string) => {
    if (url.indexOf('facebook') !== -1) {
        return 'fa-brands fa-facebook'
    }

    if (url.indexOf('instagram') !== -1) {
        return 'fa-brands fa-instagram'
    }

    if (url.indexOf('twitter') !== -1 || url.indexOf('x.com') !== -1) {
        return 'fa-brands fa-x-twitter'
    }

    return '';
};

const getSocialChannelColour = (url : string) => {
    if (url.indexOf('facebook') !== -1) {
        return '#3A5A99'
    }

    if (url.indexOf('instagram') !== -1) {
        return '#E1306C'
    }

    if (url.indexOf('twitter') !== -1 || url.indexOf('x.com') !== -1) {
        return '#000000'
    }

    return '#000000'
};

</script>
