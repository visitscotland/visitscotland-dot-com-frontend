<template>
    <VsModuleWrapper theme="light">
        <template #vs-module-wrapper-heading>
            {{ module.title }}
        </template>

        <template
            #vs-module-wrapper-intro
            v-if="module.introduction"
        >
            <VsBrRichText :input-content="module.introduction.value" />
        </template>

        <VsMapWithSidebar
            :main-heading-exists="module.title ? true : false"
            :category-heading="module.tabTitle"
            :filters="module.filters"
            :places-data="module.geoJson.features"
            :map-id="`vs-map-${module.id}`"
            :region-bounds="module.mapPosition"
            :buttons-label="configStore.getLabel('map', 'map.buttons-label')"
            :clear-selection-text="configStore.getLabel('map', 'map.clear')"
            :apply-filters-text="configStore.getLabel('map', 'map.show-results')"
            :filters-applied-text="configStore.getLabel('map', 'map.filters-applied')"
            :clear-filters-text="configStore.getLabel('map', 'map.clear')"
            :map-filter-message="configStore.getLabel('map', 'map.apply-filters')"
            :map-no-results-message="configStore.getLabel('map', 'map.no-results')"
            :toggle-data="toggleValues"
            :details-endpoint="module.detailsEndpoint ? module.detailsEndpoint : ''"
            :panel-message="
                module.mapType === 'regional'
                    ? configStore.getLabel('map', 'map.panel-bottom-msg')
                    : ''
            "
            :load-branding-immediately="true"
        >
            <template #close-side-panel-text>
                <span class="visually-hidden">
                    {{ configStore.getLabel('map', 'map.close-panel') }}
                </span>
            </template>
            <template #open-side-panel-text>
                {{ configStore.getLabel('map', 'map.open-panel') }}
            </template>
            <template #menu-btn-text>
                {{ configStore.getLabel('map', 'map.open-panel') }}
            </template>
            <template #back-btn-text>
                {{ configStore.getLabel('map', 'map.step-back') }}
            </template>
            <template #reset-side-panel-text>
                {{ configStore.getLabel('map', 'map.reset-filters') }}
            </template>
            <template #load-more-text>
                {{ configStore.getLabel('map', 'map.load-more') }}
            </template>
            <template #no-js>
                {{ configStore.getLabel('map', 'map.no-js') }}
            </template>
            <template #map-loading-text>
                {{ configStore.getLabel('map', 'map.loading') }}
            </template>
            <template #panel-loading-message>
                {{ configStore.getLabel('map', 'map.loading-results') }}
            </template>
            <template #zoom-too-close>
                {{ configStore.getLabel('map', 'map.zoom-too-close') }}
            </template>
            <template #zoom-too-far>
                {{ configStore.getLabel('map', 'map.zoom-too-far') }}
            </template>
        </VsMapWithSidebar>
    </VsModuleWrapper>
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */

import { VsMapWithSidebar } from '@visitscotland/component-library/maps';
import { VsModuleWrapper } from '@visitscotland/component-library/components';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{ module: Object }>();
const module: any = props.module;

let toggleValues = [];

if (module.mapType === 'destinations') {
    toggleValues = [
        {
            text: configStore.getLabel('map', 'map.places'),
            value: 'places',
            icon: 'map-marker',
        },
        {
            text: configStore.getLabel('map', 'map.regions'),
            value: 'regions',
            icon: 'map',
        },
    ];
} else if (module.mapType === 'regional') {
    toggleValues = [
        {
            text: configStore.getLabel('map', 'map.places'),
            value: 'places-regional',
            icon: 'pin',
        },
        {
            text: 'iCentres',
            value: 'icentres',
            icon: 'serv',
        },
    ];
}

</script>
