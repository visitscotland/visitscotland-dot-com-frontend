<template>
    <VsContainer>
        <VsBrSectionHeader
            :heading="module.title"
        />

        <VsRow class="vs-map-with-sidebar__container mt-200">
            <VsCol cols="3">
                <VsBadge v-for="(filter, key) in module.filters" key="key">
                    {{filter.label}}
                </VsBadge>
            </VsCol>
            <VsCol cols="9">
                <div
                    id="vs-map-with-sidebar__google-map-container"
                    class="vs-map-with-sidebar__google-map-container"
                />
            </VsCol>
        </VsRow>
    </VsContainer>

    <pre style="width:100%; height:30em; background: #1e1e1e; color: white; border: 5px red solid; margin: 15em 0 0 0;">{{ module }}</pre>
    <pre>API Key from env: {{runtimeConfig.public.GOOGLE_MAPS_API_KEY}}</pre>
    <pre>API Key from configStore: {{ configStore.googleMapApiKey }}</pre>
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
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import VsBrSectionHeader from './VsBrSectionHeader.vue';

const props = defineProps<{ module: Object }>();
const module: any = props.module;

const runtimeConfig = useRuntimeConfig();
const configStore = useConfigStore();

let gMap;
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
                center: {
                    lat: 56.462,
                    lng: -2.9707,
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
            } else {
                throw new Error('Map init error, mapContainer undefined');
            }
        } catch (error) {
            console.error('Google Maps initialisation failure');
        }
    };

    await initMap();
});
</script>

<style lang="scss">
    .vs-map-with-sidebar {
        &__container {
            border: 1px solid grey;
        }

        &__google-map-container {
            height: 75vh;
        }
    }
</style>
