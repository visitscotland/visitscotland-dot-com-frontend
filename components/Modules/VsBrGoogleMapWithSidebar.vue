<template>

    <VsContainer>
        <VsRow class="vs-google-map-with-sidebar">
            <div class="vs-google-map-with-sidebar__sidebar">
                <div class="vs-google-map-with-sidebar__sidebar-header">
                    <VsButton
                        size="sm"
                        variant="subtle"
                        icon-only
                        icon="fa-regular fa-arrow-left"
                        v-if="selectedCategory && selectedFeature"
                        @click="selectedFeature = undefined"
                    >
                        Return to list
                    </VsButton>
                    <VsHeading
                        level="3"
                        heading-style="heading-s"
                        class="vs-google-map-with-sidebar__sidebar-heading"
                        no-margins
                    >
                        Browse by Category
                    </VsHeading>
                    <VsButton
                        size="sm"
                        variant="subtle"
                        icon-only
                        icon="fa-regular fa-xmark"
                        v-if="selectedCategory || selectedFeature"
                        @click="resetMap"
                    >
                        Return to categories
                    </VsButton>
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
                                class="vs-google-map-with-sidebar__category-icon me-050"
                            />
                            <span
                                class="vs-google-map-with-sidebar__category-label ms-100 no-margin"
                            >
                                {{ filter.label }}
                            </span>
                        </button>
                    </div>
                    <div
                        class="vs-google-map-with-sidebar__sidebar-feature-list"
                        v-if="selectedCategory && !selectedFeature"
                    >
                        <button
                            v-for="feature in visibleFeatures"
                            :key="feature.properties.id"
                            class="vs-google-map-with-sidebar__feature-list-btn vs-google-map-with-sidebar__category-btn"
                            @click="selectedFeature = feature"
                        >
                            <VsImg
                                v-if="feature.properties.image"
                                :src="`https://www.visitscotland.com/${feature.properties.image}`"
                                class="vs-google-map-with-sidebar__sidebar-feature-list-img aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                                style="width: 7.5rem"
                            />
                            <span
                                class="vs-google-map-with-sidebar__category-label ms-100 no-margin"
                            >
                                {{ feature.properties.title }}
                            </span>
                        </button>
                    </div>
                    <div
                        class="vs-google-map-with-sidebar__sidebar-feature-detail"
                        v-if="selectedCategory && selectedFeature"
                    >
                        <VsImg
                            v-if="selectedFeature.properties.image"
                            :src="`https://www.visitscotland.com/${selectedFeature.properties.image}`"
                            class="vs-google-map-with-sidebar__sidebar-feature-detail-img aspect-ratio-3-2 w-100 rounded-1 object-fit-cover img-zoom-on-hover"
                            style="width: 7.5rem"
                        />
                        <VsHeading
                            level="4"
                            heading-style="heading-s"
                            class="vs-google-map-with-sidebar__sidebar-feature-detail-header no-margin"
                        >
                            {{ selectedFeature.properties.title }}
                        </VsHeading>
                        <VsBadge
                            v-if="selectedFeature.properties.subtitle"
                            variant="information"
                            class="rounded-1 mt-075"
                        >
                            {{ selectedFeature.properties.subtitle }}
                        </VsBadge>
                        <VsBody
                            v-if="selectedFeature.properties.description"
                            v-html="selectedFeature.properties.description"
                            class="mt-100"
                        />
                        <VsButton
                            v-if="selectedFeature.properties.link"
                            :href="selectedFeature.properties.link.link"
                            class="vs-google-map-with-sidebar__sidebar-feature-detail-discover-btn mt-100 w-100"
                        >
                            {{ selectedFeature.properties.link.label }}
                        </VsButton>
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
                        :id="`marker-${feature.properties.id}`"
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
    VsBadge,
    VsBody,
    VsButton,
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
import type { BrxmFeature } from '~/types/types';

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
const selectedFeature = ref<BrxmFeature|undefined>(undefined);

function resetMap() {
    selectedFeature.value = undefined;
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

        &__category {
            &-icon {
                width: 1.25em;
                text-align: center;
            }

            &-btn {
                padding: 1em;
                width: 100%;
                text-align: left;
                background: #F1F1F1;
                border: none;
                border-radius: 0.75rem;
                display: flex;
                flex-direction: row;
                width: 100%;
                align-items: center;
            }

            &-btn:hover, &-btn:focus {
                background: rgba(31, 3, 71, 1);
                color: white;
            
                .vs-google-map-with-sidebar__category-icon {
                    color: white;
                }
            }

            &-label {
                text-wrap: wrap;
                font-size: 1.25rem;
                font-weight: 600;
            }
        }

        &__sidebar {
            position: relative;
            top: 0;
            left: 0;
            background: #fff;
            border-radius: 0.0625rem;
            padding: 1.75rem 1.25rem 1.25rem;
            width: 100%;
            max-height: 35em;
            overflow: auto;

            @media screen and (min-width: 768px) {
                width: 22.5rem;
            }

            &-header {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-bottom: 1rem;
            }

            &-heading {
                flex-grow: 1;
                text-align: center;
            }

            &-category-select, &-feature-list {
                display: flex;
                flex-direction: column;
                row-gap: 1em;
            }

            &-feature-list {
                &-img {
                    width: 7.5rem;
                }
            }

            &-feature-detail {
                padding: 1em 1em;
            }
        }
    }
</style>