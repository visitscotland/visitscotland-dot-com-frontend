<template>

    <VsContainer>
        <VsRow>
            <VsGoogleMap
                class="vs-google-map"
                :api-key="configStore.googleMapApiKey"
                :center="{
                    lat: 57.7,
                    lng: -4.7
                }"
                :zoom="6.5"
                map-id="b55b94a250e703072014702e"
                :map-bounds="{
                    north: 61.3,
                    south: 54.6,
                    west: -8.7,
                    east: 2,
                }"
                :language-code="`${configStore.locale}`"
                :ui-labels="uiLabels"
            >
                <template #vs-google-map-marker>
                    <VsGoogleMapMarker
                        v-for="feature in features"
                        :key="feature.properties.id"
                        :feature-data="feature"
                        marker-tooltips-enabled
                    >
                        <template #vs-google-map-marker-content>
                            <VsIcon
                                class="vs-google-map-marker__icon"
                                :icon="getIconDetails(feature.properties.category.id).name"
                                size="xxs"
                                variant="inverse"
                            />
                        </template>
                    </VsGoogleMapMarker>
                </template>
            </VsGoogleMap>
            
        </VsRow>
    </VsContainer>

    <pre>{{ module }}</pre>
</template>

<script setup lang="ts">
import {
    VsContainer,
    VsGoogleMap,
    VsGoogleMapMarker,
    VsHeading,
    VsIcon,
    VsRow,
} from '@visitscotland/component-library/components';

// eslint-disable-next-line import/extensions
import getIconDetails from '~/utls/mapIconMapping';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{ module: object }>();
const module: any = props.module;

const uiLabels = {
    fullScreen: 'Fullscreen toggle',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
};

const features = module.geoJson.features;
const filters = module.filters;
</script>

<style lang="scss">
    .vs-google-map {
        height: 40em;
        width: 100%;

        &-marker {
            &__icon {
                margin-top: 1em;
            }
        }
    }
</style>