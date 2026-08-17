<template>

    <VsContainer>
        <VsRow class="vs-google-map-with-sidebar">
            <div class="vs-google-map-with-sidebar__sidebar">
                <div class="vs-google-map-with-sidebar__sidebar-heading">
                    <VsHeading
                        level="3"
                        heading-style="heading-s"
                    >
                        Browse by Category
                    </VsHeading>
                </div>
                <div class="vs-google-map-with-sidebar__sidebar-body">
                    <div
                        class="vs-google-map-with-sidebar__sidebar-category-select"
                        v-if="!selectedCategory"
                    >
                        <button
                            v-for="filter in filters"
                            :key="filter.id"
                            class="vs-google-map-with-sidebar__category-btn"
                            @click="filterById(filter.id)"
                        >
                            <VsIcon
                                :icon="getIconDetails(filter.id).name"
                                class="me-050"
                            />
                            <span>{{filter.label}}</span>
                        </button>
                    </div>
                    <div
                        class="vs-google-map-with-sidebar__sidebar-category-view"
                        v-if="selectedCategory"
                    >
                        <button @click="resetMap"> Clear </button>
                        <button
                            v-for="feature in visibleFeatures"
                            :key="feature.properties.id"
                            class="vs-google-map-with-sidebar__feature-list-btn vs-google-map-with-sidebar__category-btn"
                        >
                            <VsImg
                                :src="`https://www.visitscotland.com/${feature.properties.image}`"
                                class="vs-google-map-with-sidebar__feature-list-img aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                                style="width: 7.5rem"
                            />
                            <span>
                                {{ feature.properties.title }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <VsGoogleMap
                class="vs-google-map-with-sidebar__map"
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
                        class="vs-google-map-with-sidebar__marker"
                        v-for="feature in visibleFeatures"
                        :key="feature.properties.id"
                        :feature-data="feature"
                        marker-tooltips-enabled
                    >
                        <template #vs-google-map-marker-content>
                            <VsIcon
                                class="vs-google-map-with-sidebar__marker-icon"
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
</template>

<script setup lang="ts">
import {
    VsContainer,
    VsGoogleMap,
    VsGoogleMapMarker,
    VsHeading,
    VsIcon,
    VsImg,
    VsRow,
} from '@visitscotland/component-library/components';
import { ref } from 'vue';

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

const visibleFeatures = ref(features);
const filteredFeatures = ref<any[]>([]);
const selectedCategory = ref<string|undefined>(undefined);
const selectedFeature = ref<object|undefined>(undefined);

function resetMap() {
    selectedCategory.value = undefined;
    visibleFeatures.value = features;
}

function filterById(categoryId: string) {
    selectedCategory.value = categoryId;

    filteredFeatures.value = features.filter((feature: any) => {
        return feature.properties.category.id === categoryId;
    });

    if (filteredFeatures.value) {
        console.table(filteredFeatures.value);
        visibleFeatures.value = filteredFeatures.value;
    };
}
</script>

<style lang="scss">
    .vs-google-map-with-sidebar {

    display: flex;

        &__map {
            height: 40em;
            width: 100%;
            display: block;
        }

        &__marker {
            &-icon {
                margin-top: 1em;
            }
        }

        &__category-btn {
            padding: 1em;
            width: 100%;
            text-align: left;
            background: rgba(246,246,246, 1);
            border: none;
            border-radius: 0.75rem;
        }

        &__category-btn:hover, &__category:focus {
            background: rgba(31, 3, 71, 1);
            color: white;
        }

        &__sidebar {
            position: relative;
            top: 0;
            left: 0;
            background: #fff;
            border-radius: 0.0625rem;
            padding: 1.75rem 1.25rem 1.25rem;
            width: 50%;
            max-height: 40em;

            @media screen and (min-width: 768px) {
                width: 22.5rem;
            }

            &-body {
                display: flex;
                flex-direction: column;
                row-gap: 1em;
            }
        }

        &__feature-list {
            &-btn {
                display: flex;
                flex-direction: row;
                width: 100%;
            }

            &-img {
                width: 7.5rem;
            }
        }
    }
</style>