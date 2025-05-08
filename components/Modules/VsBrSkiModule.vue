<template>
    <VsModuleWrapper theme="light">
        <template #vs-module-wrapper-heading>
            {{ module.title }}
        </template>

        <template #vs-module-wrapper-intro>
            <VsBrRichText :input-content="module.introduction.value" />
        </template>

        <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    md="10"
                    offset-md="1"
                >
                    <VsSkiScotlandStatus
                        :ski-status-url="module.feedURL"
                        :locale="configStore.locale"
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
                                            name="phone"
                                            size="xs"
                                            class="me-050"
                                        />
                                        <span>
                                            {{ module.phone }}
                                        </span>
                                    </li>
                                    <li class="mb-050" v-if="module.website.link">
                                        <VsIcon
                                            name="globe"
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
                                    <li class="mb-050" v-if="module.address">
                                        <VsIcon
                                            name="map-marker"
                                            size="xs"
                                            class="me-050"
                                        />
                                        <span>
                                            <!-- TODO - ADDRESS -->
                                            <!-- <@address module.address true /> -->
                                        </span>
                                    </li>
                                    <li class="mb-050" v-if="module.pisteMap">
                                        <VsIcon
                                            name="landscape"
                                            size="xs"
                                            class="me-050"
                                        />
                                        <VsLink
                                            type="download"
                                            href="${module.pisteMap}"
                                        >
                                            {{ configStore.getLabel('ski', 'ski-centre.view-piste-map') }}
                                        </VsLink>
                                    </li>
                                    <li class="mb-050" v-if="module.openingLink && module.openingLink.label">
                                        <VsIcon
                                            name="clock"
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
                                            name="webcam"
                                            size="xs"
                                            class="me-050"
                                        />
                                        <span>{{ configStore.getLabel('ski', 'ski-centre.webcam') }}</span>
                                    </li>
                                </VsList>
                                <VsLink
                                    v-for="(channel, index) in module.socialChannels"
                                    :key="index"
                                    :href="channel.processedHref"
                                    class="d-inline-block mt-100"
                                >
                                    <div class="d-inline-block me-100">
                                        <span class="visually-hidden">{{ channel.label }}</span>
                                        <VsIcon
                                            size="sm"
                                            :name="channel.label
                                                ? channel.label.toLowerCase()
                                                : channel.label"
                                            :custom-colour="channel.processedColour"
                                        />
                                    </div>
                                </VsLink>
                            </div>
                        </template>
                    </VsSkiScotlandStatus>
                </VsCol>
            </VsRow>
        </VsContainer>
    </VsModuleWrapper>
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */

import {
    VsModuleWrapper,
    VsContainer,
    VsRow,
    VsCol,
    VsSkiScotlandStatus,
    VsHeading,
    VsList,
    VsIcon,
    VsLink,
} from '@visitscotland/component-library/components';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{ module: Object }>();
const module: any = props.module;

for (let x = 0; x < module.socialChannels.length; x++) {
    let href = '';

    if (module.socialChannels[x].label === 'Twitter') {
        if (module.socialChannels[x].link.includes('twitter.com')) {
            href = module.socialChannels[x].link;
        } else {
            href = `https://twitter.com/${module.socialChannels[x].link}`;
        }
    } else {
        href = module.socialChannels[x].link;
    }

    module.socialChannels[x].processedHref = href;

    let colour = '';

    switch (module.socialChannels[x].label) {
    case 'Twitter':
        colour = '#55ACEE';
        break;
    case 'Facebook':
        colour = '#3A5A99';
        break;
    case 'Instagram':
    default:
        colour = '#E1306C';
        break;
    }

    module.socialChannels[x].processedColour = colour;
}

</script>
