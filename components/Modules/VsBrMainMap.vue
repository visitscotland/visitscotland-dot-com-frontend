<template>
    <VsMainMap
        :api-key="configStore.googleMapApiKey"
        map-id="b55b94a250e70307420a5743"
        map-type-vector
        :center="{
            lat: 56.490153,
            lng: -4.10959,
        }"
        :zoom="6"
        :radius="6000"
        :no-js-message="`${configStore.getLabel('map', 'map.no-js')}`"
        :no-cookies-message="`${configStore.getLabel('map', 'map.cookies-message')}`"
        :cookie-btn-message="`${configStore.getLabel('essentials.global', 'cookie.link-message')}`"
        :no-results-message="`${configStore.getLabel('map', 'map.no-results-message')}`"
        :reset-map-no-results-message="`${configStore.getLabel('map', 'map.reset')}`"
        :category-labels="module.filters"
        categories-location="https://static.visitscotland.com/maps-resources/main-map/map-categories-v2.json"
        :labels="labels"
        :language-code="`${configStore.locale}`"
        :featured-places="filteredFeatures"
        :js-disabled="false"
        :cookie-btn-text="`${configStore.getLabel('essentials.global', 'cookie.link-message')}`"
        :alert-text="`${configStore.getLabel('map', 'map.google-results-primary-message')}`"
    />
</template>

<script setup lang="ts">
 
import { computed } from 'vue';
 
import useConfigStore from '~/stores/configStore.ts';
 
import { VsMainMap } from '@visitscotland/component-library/components';

import formatLink from '~/composables/formatLink.ts';

const configStore = useConfigStore();

const props = defineProps<{ module: object }>();
const module: any = props.module;

const labels: object = computed(() => ({
    heading: module.tabTitle ? module.tabTitle : module.title,
    closeSidebarBtn: configStore.getLabel('map', 'map.close-panel'),
    inputPlaceholder: configStore.getLabel('map', 'map.placeholder'),
    searchButton: configStore.getLabel('map', 'map.search'),
    clearMap: configStore.getLabel('map', 'map.clear'),
    subFilterHeader: configStore.getLabel('map', 'map.sub-filter'),
    searchResults: configStore.getLabel('map', 'map.search-results'),
    openSidebarButton: configStore.getLabel('map', 'map.open-panel'),
    resetLocation: configStore.getLabel('map', 'resetLocation'),
    locationSelect: configStore.getLabel('map', 'locationSelect'),
    searchAreaButton: configStore.getLabel('map', 'searchAreaButton'),
}));

const filteredFeatures = module.geoJson.features.filter(
    (feature: any) => feature.geometry && feature.geometry.type,
);

for (let x = 0; x < filteredFeatures.length; x++) {
    if (filteredFeatures[x].properties && filteredFeatures[x].properties.link) {
        filteredFeatures[x].properties.link.link = formatLink(
            filteredFeatures[x].properties.link.link,
        );
    }
}
</script>
