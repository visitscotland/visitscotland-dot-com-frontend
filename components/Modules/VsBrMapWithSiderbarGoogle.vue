<template>
    <VsContainer>
        <VsBrSectionHeader
            :heading="module.title"
        />

        <VsRow class="vs-map-with-sidebar__container mt-200">
            <!-- <VsCol cols="3">
                <VsBadge v-for="(filter, key) in module.filters" key="key" :class="`vs-map-with-sidebar__colour--${filter.id}`">
                    {{filter.label}}
                </VsBadge>
                <VsCard>

                </VsCard>
            </VsCol> -->
            <VsCol cols="3" class="vs-map-with-sidebar__sidebar">
                <VsHeading
                    headling-level="3"
                    heading-style="heading-xxs"
                    class="mb-100"
                >
                    Outlander Filming Locations
                </VsHeading>
                <VsCardGroup cards-per-row="1">
                    <VsCard 
                        v-for="(feature, key) in module.geoJson.features"
                        :key
                        card-style="outlined"
                        horizontal
                    >
                        <template #vs-card-header>
                            <VsImg
                                :src="feature.properties.image"
                                class="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                            />
                        </template>
                        <template #vs-card-body>
                            <div class="mx-050">
                                <VsHeading
                                    headling-level="4"
                                    heading-style="heading-xxxs"
                                >
                                    {{ feature.properties.title }}
                                </VsHeading>
                                <VsBadge 
                                    :class="`vs-map-with-sidebar__colour--${feature.properties.category.id}`"
                                    class="vs-map-with-sidebar__badge"
                                >
                                    {{feature.properties.category.label}}
                                </VsBadge>
                            </div>
                        </template>
                    </VsCard>
                </VsCardGroup>
            </VsCol>
            <VsCol cols="9">
                <div
                    id="vs-map-with-sidebar__google-map-container"
                    class="vs-map-with-sidebar__google-map-container"
                ></div>
            </VsCol>
        </VsRow>
    </VsContainer>

    <pre style="width:100%; height:30em; background: #1e1e1e; color: white; border: 5px red solid; margin: 15em 0 0 0;">{{ module }}</pre>
</template>

<script setup lang="ts">
/// <reference types="google.maps" preserve="true" />
import {
    onMounted, ref
} from 'vue';
import { useRuntimeConfig } from '#app';

import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsBadge,
    VsCard,
    VsCardGroup,
    VsImg,
    VsHeading,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import VsBrSectionHeader from './VsBrSectionHeader.vue';
import type { FeaturedMapPlace } from '~/types/types';

const props = defineProps<{ module: Object }>();
const module: any = props.module;

const runtimeConfig = useRuntimeConfig();
const configStore = useConfigStore();

let gMap: any;
const isLoaded = ref(false);
const markers = ref({});
const MAPS_API_KEY = runtimeConfig.public.GOOGLE_MAPS_API_KEY || configStore.googleMapApiKey;

onMounted(async() => {
    setOptions({
        key: MAPS_API_KEY,
        v: 'quarterly',
        region: 'GB',
        language: `${configStore.locale}`,
        libraries: ['maps', 'marker', 'core'],
    });

    try {
        await importLibrary('maps');
        await importLibrary('places');
        await importLibrary('marker');
        await importLibrary('core');
        await importLibrary('geometry');
    } catch (error) {
        console.error('Google Maps Library load error');
    }

    const mapContainer = document.getElementById('vs-map-with-sidebar__google-map-container');

    async function initMap() {
        try{
            const mapOptions = {
                mapId: 'vs-map-with-sidebar',
                center: {
                    lat: 55.95240,
                    lng: -3.18837,
                },
                // eslint-disable-next-line no-undef
                renderingType: google.maps.RenderingType.VECTOR,
                zoomControl: true,
                mapTypeControl: false,
                cameraControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoom: 10,
            };

            if (mapContainer) {
                // eslint-disable-next-line no-undef
                gMap = new google.maps.Map(mapContainer, mapOptions);

                addMarkers();
            } else {
                throw new Error('Map init error, mapContainer undefined');
            }
        } catch (error) {
            console.error('Google Maps initialisation failure');
        }
    };

    await initMap();
    isLoaded.value = true;
});

async function addMarkers() {
    const { AdvancedMarkerElement } = await importLibrary('marker');
    if (module.geoJson) {
        module.geoJson.features.forEach((place: FeaturedMapPlace) => {
            console.log(place.properties.title);
            const markerIcon = document.createElement('div');
            markerIcon.classList.add('vs-map-with-sidebar__marker');
            markerIcon.classList.add(getMarkerClass(place.properties.category.id));

            const icon = document.createElement('i');
            icon.classList.add('fa-regular');
            icon.classList.add(getIcon(place.properties.category.id));

            markerIcon.appendChild(icon);

            const marker = new AdvancedMarkerElement({
                map: gMap,
                position: new google.maps.LatLng({
                    lat: place.geometry.coordinates[1],
                    lng: place.geometry.coordinates[0], 
                }),
                content: markerIcon,
                title: `${place.properties.title} map pin`,
            })
        });
    }
}

function getIcon(filter: string) {
    switch (filter) {
        case 'outlander-castle':
            return 'fa-chess-rook'
        case 'outlander-church-abbey':
            return 'fa-church'
        case 'outlander-city-town-village':
            return 'fa-city'
        case 'outlander-heritage':
            return 'fa-landmark'
        case 'outlander-landscape-park':
            return 'fa-mountain'
        case 'outlander-palace-house':
            return 'fa-crown'
        default:
            return 'fa-star'
    }
}

function getMarkerClass(filter: string) {
    switch (filter) {
        case 'outlander-castle':
            return 'vs-map-with-sidebar__colour--outlander-castle'
        case 'outlander-church-abbey':
            return 'vs-map-with-sidebar__colour--outlander-church-abbey'
        case 'outlander-city-town-village':
            return 'vs-map-with-sidebar__colour--outlander-city-town-village'
        case 'outlander-heritage':
            return 'vs-map-with-sidebar__colour--outlander-heritage'
        case 'outlander-landscape-park':
            return 'vs-map-with-sidebar__colour--outlander-landscape-park'
        case 'outlander-palace-house':
            return 'vs-map-with-sidebar__colour--outlander-palace-house'
        default:
            return 'vs-map-with-sidebar__colour--default'
    }
}

    // "outlander-castle": $vs-color-icon-accent-heather,
    // "outlander-church-abbey": $vs-color-icon-accent-cranachan,
    // "outlander-city-town-village": $vs-color-icon-accent-loch-ness,
    // "outlander-heritage": $vs-color-icon-accent-whisky,
    // "outlander-landscape-park": $vs-color-icon-accent-grey-02,
    // "outlander-palace-house": $vs-color-icon-accent-bramble,
</script>

<style lang="scss">
    $animation-duration: 100ms;
    $module-height: 75vh;

    .vs-map-with-sidebar {
        height: $module-height;

        &__sidebar {
            height: $module-height;
            overflow-y: scroll;
        }

        &__container {
            border: 1px solid grey;
        }

        &__google-map-container {
            height: $module-height;
        }

        &__badge {
            color: white;
        }

        &__marker {
            color: white;
            aspect-ratio: 1/1;
            width: 3em;
            border-radius: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            transition: $animation-duration ease-out;

            i {
                font-size: 1.75em;
                transition: $animation-duration ease-out;
            }

            &:hover {
                width: 4em;
                transition: $animation-duration ease-out;
                z-index: 9999;
                background: #200f2e; //vs-color-icon-primary

                i {
                    font-size: 2.25em;
                    transition: $animation-duration ease-out;
                }
            } 
        }
    }

    .vs-map-with-sidebar__colour {
        &--outlander-castle {
            background: #23014A; //vs-color-icon-accent-heather
        }

        &--outlander-church-abbey {
            background: #FF476F; //vs-color-icon-accent-cranachan
        }

        &--outlander-city-town-village {
            background: #122B80; //vs-color-icon-accent-loch-ness;
        }

        &--outlander-heritage {
            background: #F18701; //vs-color-icon-accent-whiskey;
        }

        &--outlander-landscape-park {
            background: #756D94; //vs-color-icon-accent-grey-02
        }

        &--outlander-palace-house {
            background: #A8308C; //vs-color-icon-accent-bramble
        }

        &--default {
            background: #ffd400; //yellow
        }
    }
</style>
