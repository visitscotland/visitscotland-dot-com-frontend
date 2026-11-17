<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>

    <VsContainer>
        <VsRow class="vs-google-map-with-sidebar">
            <div
                v-if="isSidebarVisible"
                class="vs-google-map-with-sidebar__sidebar"
                :class="{ 'vs-google-map-with-sidebar__sidebar--error': isMapUnavailable }"
            >
                <VsButton
                    v-if="!isMapUnavailable"
                    class="vs-google-map-with-sidebar__sidebar-toggle-button d-xs-block d-md-none"
                    size="sm"
                    :variant="isSidebarVisible ? 'primary' : 'secondary'"
                    icon="fa-regular fa-bars"
                    @click="isSidebarVisible = false"
                >
                    {{ configStore.getLabel('map', 'map.open-panel') }}
                </VsButton>
                <div
                    class="vs-google-map-with-sidebar__sidebar-wrapper"
                    :class="{ 'p-150': isMapUnavailable }"
                >
                    <div
                        v-if="isMapUnavailable"
                    >
                        <VsHeading
                            level="3"
                            heading-style="heading-s"
                            class="vs-google-map-with-sidebar__sidebar-error-heading mb-150"
                            no-margins
                        >
                            {{ mapUnavailableTitle }}
                        </VsHeading>
                        <VsPanel
                            variant="information"
                            class="vs-google-map-with-sidebar__sidebar-error p-125 rounded-0"
                            role="alert"
                        >
                            <div class="d-flex flex-column flex-sm-row">
                                <VsIcon
                                    icon="fa-regular fa-triangle-exclamation"
                                    size="sm"
                                    class="me-125 mt-025 mb-050"
                                    variant="highlight"
                                />
                                <div>
                                    <VsHeading
                                        level="6"
                                        heading-style="heading-xxs"
                                        class="mb-100"
                                        no-margins
                                    >{{ mapUnavailablePanelTitle }}
                                    </VsHeading>
                                    <VsBody>
                                        {{ mapUnavailableMessage }}
                                    </VsBody>
                                    <VsButton
                                        size="sm"
                                        class="mt-125 mb-050"
                                        href="#section-1"
                                    >
                                        {{ mapUnavailableButtonCTA }}
                                    </VsButton>
                                </div>
                            </div>
                        </VsPanel>
                    </div>
                    <template v-else>
                        <div class="vs-google-map-with-sidebar__sidebar-header">
                            <VsButton
                                size="sm"
                                variant="subtle"
                                icon-only
                                icon="fa-regular fa-arrow-left"
                                v-if="selectedCategory || selectedFeature"
                                @click="selectedFeature ? unselectFeature() : resetMap()"
                            >
                                {{ selectedFeature ? configStore.getLabel('map', 'resetLocation') : configStore.getLabel('map', 'map.reset-filters') }}
                            </VsButton>
                            <VsHeading
                                level="3"
                                heading-style="heading-s"
                                class="vs-google-map-with-sidebar__sidebar-heading"
                                no-margins
                            >
                                {{ titleLabel }}
                            </VsHeading>
                            <VsButton
                                size="sm"
                                variant="subtle"
                                icon-only
                                icon="fa-regular fa-xmark"
                                v-if="selectedCategory && selectedFeature"
                                @click="resetMap"
                            >
                                {{ configStore.getLabel('map', 'map.reset-filters') }}
                            </VsButton>
                        </div>
                        <div
                            class="vs-google-map-with-sidebar__sidebar-body"
                            ref="sidebarBody"
                        >
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
                                    @click="handleFeatureClick(feature)"
                                    @mouseover="handleFeatureButtonMouseover(feature.properties.id)"
                                    @focusin="handleFeatureButtonMouseover(feature.properties.id)"
                                    @mouseout="handleFeatureButtonMouseout(feature.properties.id)"
                                    @focusout="handleFeatureButtonMouseout(feature.properties.id)"
                                >
                                    <VsImg
                                        v-if="feature.properties.image"
                                        :src="`https://www.visitscotland.com/${feature.properties.image}`"
                                        class="vs-google-map-with-sidebar__sidebar-feature-list-img aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                                        use-lazy-loading
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
                                role="dialog"
                                v-if="selectedCategory && selectedFeature"
                            >
                                <VsImg
                                    v-if="selectedFeature.properties.image"
                                    :src="`https://www.visitscotland.com/${selectedFeature.properties.image}`"
                                    class="vs-google-map-with-sidebar__sidebar-feature-detail-img aspect-ratio-3-2 w-100 rounded-1 object-fit-cover img-zoom-on-hover"
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
                    </template>
                </div>
            </div>
            <div
                class="vs-google-map-with-sidebar__sidebar-open-button  d-xs-block d-md-none"
                v-if="!isSidebarVisible"
            >
                <VsButton
                    size="sm"
                    variant="secondary"
                    @click="isSidebarVisible = true"
                    icon="fa-regular fa-bars"
                >
                    {{ configStore.getLabel('map', 'map.open-panel') }}
                </VsButton>
            </div>
            <VsGoogleMap
                ref="googleMap"
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
                :google-maps-options="{
                    clickableIcons: false,
                    renderingTypeVector: true,
                }"
                :language-code="`${configStore.locale}`"
                :ui-labels="uiLabels"
            >
                <template #vs-google-map-marker>
                    <VsGoogleMapMarker
                        class="vs-google-map-with-sidebar__marker"
                        v-for="feature in markerFeatures"
                        :key="feature.properties.id"
                        :ref="(el) => setMarkerRef(feature.properties.id, el)"
                        :feature-data="feature"
                        marker-tooltips-enabled
                        :id="`marker-${feature.properties.id}`"
                        @click="handleMapMarkerClick(feature.properties.category.id, feature)"
                        @mouseout="handleMouseOut(feature.properties.id)"
                        @focusout="handleMouseOut(feature.properties.id)"
                        @mouseleave.prevent
                        aria-haspopup="dialog"
                        :aria-expanded="selectedFeature === feature"
                        handle-marker-behaviour-externally
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
    VsPanel,
    VsRow,
} from '@visitscotland/component-library/components';
import {
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from 'vue';

import getIconDetails from '~/utls/mapIconMapping.ts';
import { FULL_SHADED_PLACES, SHADED_AREA_STYLE } from '~/main-map-constants.ts';

import useConfigStore from '~/stores/configStore.ts';
import formatLink from '~/composables/formatLink.ts';
import type { BrxmFeature, MapSidebarFilter } from '~/types/types';

const configStore = useConfigStore();

const props = defineProps<{ module: any }>();
const module: any = props.module;

const uiLabels = {
    fullScreen: configStore.getLabel('map', 'map.fullscreen'),
    zoomIn: configStore.getLabel('map', 'map.zoomin'),
    zoomOut: configStore.getLabel('map', 'map.zoomout'),
};

const isSidebarVisible = ref<boolean>(true);

const mapUnavailableTitle = 'Explore Scotland';
const mapUnavailablePanelTitle = 'Map temporarily unavailable';
const mapUnavailableMessage = 'We\'re having trouble displaying the map at the moment. '
+ 'You can still explore Scotland using search, navigation and destination pages '
+ 'while we work to restore the map.';
const mapUnavailableButtonCTA = 'Explore Scotland\'s Destinations';
const isMapUnavailable = ref<boolean>(false);

// Destinations in multiple categories may come through as polygons in every
// category. Outside of regions, show them as a pin at their centre instead.
const features = module.geoJson.features.map((feature: any) => {
    const centre = feature.properties?.locationCentre;

    if (
        feature.geometry?.type !== 'Point'
        && feature.properties?.category?.id !== 'regions'
        && centre
    ) {
        return {
            ...feature,
            geometry: {
                type: 'Point',
                coordinates: [centre.longitude, centre.latitude],
            },
        };
    }

    return feature;
});

for (const feature of features) {
    if (feature.properties?.link?.link) {
        feature.properties.link.link = formatLink(feature.properties.link.link);
    }
}

const filters = module.filters;

const visibleFeatures = ref(features);

// Only points can be shown as markers, regions are drawn as polygons instead.
const markerFeatures = computed(() => visibleFeatures.value
    .filter((feature: any) => feature.geometry?.type === 'Point'));
const filteredFeatures = ref<BrxmFeature[]>([]);
const selectedCategory = ref<string | undefined>(undefined);
const selectedFeature = ref<BrxmFeature | undefined>(undefined);

const markerRefs = ref<any>({
});

// Remove refs when a marker unmounts (eg after filtering) so we never call
// methods on a stale marker whose internal tooltip ref has been nulled.
function setMarkerRef(id: string, el: any) {
    markerRefs.value[id] = el ?? undefined;
}

function getMarkerRef(feature: BrxmFeature) {
    if (feature.geometry?.type !== 'Point') return undefined;

    return markerRefs.value[feature.properties.id.toString()];
}

const sidebarBody = ref<HTMLElement | null>(null);

const regionFeatures = features.filter((feature: any) =>
    feature.properties?.category?.id === 'regions'
    && feature.geometry?.type !== 'Point');

const googleMap = ref<any>(null);

let map: google.maps.Map | undefined;
let regionPopup: google.maps.InfoWindow | undefined;

const hoveredRegionId = ref<string | null>(null);

// Show regions only while in region view
function regionStyle(feature: google.maps.Data.Feature): google.maps.Data.StyleOptions {
    const id = feature.getId();
    const highlighted = id === hoveredRegionId.value
        || id === selectedFeature.value?.properties.id;

    return {
        // pretty regional styles
        visible: selectedCategory.value === 'regions',
        fillColor: highlighted ? '#A8308C' : '#19C8C5',
        fillOpacity: highlighted ? 0.4 : 0.5,
        strokeColor: '#FFFFFF',
        strokeWeight: 1,
    };
}

// Restyle the regions whenever the category, selection or hover changes.
watch([selectedCategory, selectedFeature, hoveredRegionId], () => {
    map?.data.setStyle(regionStyle);
});

// Draw the region polygons using the map's data layer once the map is ready.
// https://developers.google.com/maps/documentation/javascript/datalayer
onMounted(async() => {
    // https://developers.google.com/maps/documentation/javascript/events#auth-errors
    (window as any).gm_authFailure = () => {
        isMapUnavailable.value = true;
    };

    try {
        await google.maps.importLibrary('maps');
    } catch {
        // Catch google maps unavailable error
        // Could be triggered by network issues, google outage or adblocker
        isMapUnavailable.value = true;
        return;
    }

    await customElements.whenDefined('gmp-map');

    map = googleMap.value?.$el?.querySelector('gmp-map')?.innerMap;
    if (!map) return;

    // Shade non Scottish countries similar to the MainMap
    const layers = [
        map.getFeatureLayer(google.maps.FeatureType.COUNTRY),
        map.getFeatureLayer(
            google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1,
        ),
    ];

    layers.forEach((layer) => {
        layer.style = (options: any) => {
            if (FULL_SHADED_PLACES.includes(options.feature.placeId)) {
                return SHADED_AREA_STYLE;
            }
        };
    });

    // The API sends a lowercase 'feature' type, Google requires 'Feature'.
    // spread it to a new object with uppercase name
    map.data.addGeoJson(
        {
            type: 'FeatureCollection',
            features: regionFeatures.map((feature: any) => ({
                ...feature,
                type: 'Feature',
            })),
        },
        {
            idPropertyName: 'id',
        },
    );

    map.data.setStyle(regionStyle);

    // tooltip popup for region polygons 
    regionPopup = new google.maps.InfoWindow({
        headerDisabled: true,
        disableAutoPan: true,
        pixelOffset: new google.maps.Size(0, -10),
    });

    map.data.addListener('mouseover', (event: google.maps.Data.MouseEvent) => {
        hoveredRegionId.value = event.feature.getId() as string;
        
        const popupContent = document.createElement('div');
        popupContent.textContent = event.feature.getProperty('title') as string;

        regionPopup?.setContent(popupContent);
        regionPopup?.setPosition(event.latLng);
        regionPopup?.open(map);
    });

    map.data.addListener('mousemove', (event: google.maps.Data.MouseEvent) => {
        regionPopup?.setPosition(event.latLng);
    });

    map.data.addListener('mouseout', () => {
        hoveredRegionId.value = null;
        regionPopup?.close();
    });

    // Show the region's details in the sidebar, the same as clicking a marker.
    map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
        const region = regionFeatures.find((feature: any) =>
            feature.properties.id === event.feature.getId());
        if (!region) return;

        unselectFeature();
        isSidebarVisible.value = true;
        filterById('regions');
        handleFeatureClick(region);
    });
});

onBeforeUnmount(() => {
    delete (window as any).gm_authFailure;
});

const titleLabel = computed(() => {
    if (selectedCategory.value) {
        const filterLabel = filters.find((filter: MapSidebarFilter) =>  filter.id === selectedCategory.value);
        return filterLabel ? filterLabel.label : configStore.getLabel('map', 'map.explore');
    } else {
        return module.tabTitle ? module.tabTitle : configStore.getLabel('map', 'map.explore');
    } 
});

function resetMap() {
    unselectFeature();
    selectedCategory.value = undefined;
    visibleFeatures.value = features;
}

function filterById(categoryId: string) {
    selectedCategory.value = categoryId;

    filteredFeatures.value = features.filter((feature: any) => {
        return feature.properties.category.id === categoryId;
    });

    if (filteredFeatures.value) {
        visibleFeatures.value = filteredFeatures.value;
    };
}

function selectFeature(feature: BrxmFeature) {
    selectedFeature.value = feature;
    
    // Regions don't have markers so there's no tooltip to show.
    getMarkerRef(feature)?.showTooltip();
}

function unselectFeature() {
    if (selectedFeature.value) {
        const selectedFeatureId: string = selectedFeature.value.properties.id.toString();
        const marker = getMarkerRef(selectedFeature.value);

        marker?.hideTooltip();
        marker?.handleRemoveMarkerActive(selectedFeatureId);
    };
    selectedFeature.value = undefined;
}

function handleFeatureClick(feature: BrxmFeature) {
    selectFeature(feature);
    if (sidebarBody.value) sidebarBody.value.scrollTop = 0;
}

function handleMapMarkerClick(category: string, feature: BrxmFeature) {
    unselectFeature();
    isSidebarVisible.value = true;
    selectedCategory.value = category;
    if (markerRefs.value[feature.properties.id]) {
        markerRefs.value[feature.properties.id].handleSetMarkerActive(feature.properties.id);
    }
    handleFeatureButtonMouseover(feature.properties.id.toString());
    handleFeatureClick(feature);
    filterById(category);
}

function handleFeatureButtonMouseover(id: string) {
    // regions don't have markers, highlight the region polygon instead.
    if (selectedCategory.value === 'regions') {
        hoveredRegionId.value = id;
        return;
    }

    if (markerRefs.value[id]) {
        markerRefs.value[id].showTooltip();
        markerRefs.value[id].handleSetMarkerActive(id);
    }
}

function handleFeatureButtonMouseout(id: string) {
    if (selectedCategory.value === 'regions') {
        hoveredRegionId.value = null;
        return;
    }

    if (markerRefs.value[id]) {
        markerRefs.value[id].hideTooltip();
        markerRefs.value[id].handleRemoveMarkerActive(id);
        markerRefs.value[id].markerHovered = null;
    }
}

function handleMouseOut(id: string) {
    if (!markerRefs.value[id]) return;

    if (selectedFeature.value && selectedFeature.value.properties.id === id) {
        markerRefs.value[id].showTooltip();
    } else {
        markerRefs.value[id].markerHovered = null;
        if(markerRefs.value[id]) {
            markerRefs.value[id].handleRemoveMarkerActive(id);
            markerRefs.value[id].hideTooltip();
        }
        markerRefs.value[id].resetPin();
    }
}
</script>

<style lang="scss">
    .vs-google-map-with-sidebar {
        position: relative;
        display: flex;

        &__map {
            height: 40rem;
            width: 100%;
            display: block;
        }

        &__marker {
            &-icon {
                margin-top: 0.75rem;
            }
        }

        &__category {
            &-icon {
                width: 1.25rem;
                text-align: center;
            }

            &-btn {
                padding: 1rem;
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
            position: absolute;
            top: 1rem;
            left: 1rem;
            z-index: 100;
            width: calc(100% - 2em);
            max-width: 22.5rem;
            max-height: 33rem;
            
            @media screen and (min-width: 768px) {
                width: 22.5rem;
            }

            // Let the sidebar size to the error panel rather than the
            // fixed 22.5rem sidebar width, so the panel's max-width applies.
            &--error {
                max-width: none;

                @media screen and (min-width: 768px) {
                    width: auto;
                }
            }

            &-error {
                max-width: 29.625rem; /* 474px */
            }

            &-wrapper {
                background: #fff;
                border-radius: 0.625rem;
                padding: 1.75rem 1.25rem 1.25rem;
            }
            
            &-toggle-button {
                margin-bottom: 0.5rem;
            }

            &-open-button {
                display: flex;
                width: auto;
                padding: 0;
                position: absolute;
                top: 1rem;
                left: 1rem;
                z-index: 100;
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

            &-body {
                max-height: 28rem;
                overflow-y: auto;
                overflow-x: none;
            }

            &-category-select, &-feature-list {
                display: flex;
                flex-direction: column;
                row-gap: 1rem;
            }

            &-feature-list {
                &-img {
                    width: 6.5rem;
                }
            }
        }
    }
</style>
