<template>
    <VsMainMap
        api-key="AIzaSyAVCyqirI1432Qo4TrDJz26_OVi4BYRsNE"
        map-id="b55b94a250e70307420a5743"
        map-type-vector
        :center="{
            lat: 56.490153,
            lng: 4.10959,
        }"
        :zoom="6"
        :radius="6000"
        :no-js-message="`${configStore.getLabel('map', 'map.no-js')}`"
        :no-cookies-message="`${configStore.getLabel('map', 'map.cookies-message')}`"
        :cookie-btn-message="`${configStore.getLabel('essentials.global', 'cookie.link-message')}`"
        :no-results-message="`${configStore.getLabel('map', 'map.no-results-message')}`"
        :category-labels="module.filters"
        categories-location="http://127.0.0.1:3000/map-categories.json"
        :labels="labels"
        language-code="ES"
    />

    <pre> {{ module }} </pre>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useConfigStore from '~/stores/configStore.ts';
// eslint-disable-next-line import/no-unresolved
import { VsMainMap } from '@visitscotland/component-library/components';

const configStore = useConfigStore();

const props = defineProps<{ module: Object }>();
const module: any = props.module;

const labels: Object = computed(() => ({
    heading: module.title,
    closeSidebarBtn: configStore.getLabel('map', 'map.close-panel'),
    inputPlaceholder: configStore.getLabel('map', 'map.placeholder'),
    searchButton: configStore.getLabel('map', 'map.search'),
    clearMap: configStore.getLabel('map', 'map.clear'),
    subFilterHeader: configStore.getLabel('map', 'map.sub-filter'),
    searchResults: configStore.getLabel('map', 'map.places'),
    openSidebarButton: configStore.getLabel('map', 'map.open-panel'),
}));
</script>
