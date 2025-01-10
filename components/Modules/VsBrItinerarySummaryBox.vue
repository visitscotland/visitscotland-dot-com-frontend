<template>
    <VsCol cols="12" md="6" lg="5" xl="4" class="position-relative">
        <VsSummaryBoxList>
            <VsSummaryBoxListItem
                :text="`${itinerary.days.length}`"
                :label="itinerary.days.length === 1 ? configStore.getLabel('itinerary', 'day') : configStore.getLabel('itinerary', 'days')"
            />
            <VsSummaryBoxDistanceListItem
                :miles="`${itinerary.distance}`"
                :kilometres="`${(itinerary.distance * 1.6).toFixed(0)}`"
                :miles-label="configStore.getLabel('itinerary', 'miles')"
                :kilometres-label="configStore.getLabel('itinerary', 'kilometres-abbreviation')"
                :distance-label="configStore.getLabel('itinerary', 'distance')"
            />
            <VsSummaryBoxListItem
                :icon="mainTransport"
                :icon-label="configStore.getLabel('transports', mainTransport)"
                :label="configStore.getLabel('itinerary', 'transport')"
            />
            <VsSummaryBoxListItem
                :icon="itineraryTheme"
                :icon-label="configStore.getLabel('themes', itineraryTheme)"
                :label="configStore.getLabel('itinerary', 'theme')"
            />
        </VsSummaryBoxList>
    </VsCol>
</template>

<script lang="ts" setup>
import useConfigStore from '~/stores/configStore.ts';

import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsCol,
    VsSummaryBoxList,
    VsSummaryBoxListItem,
    VsSummaryBoxDistanceListItem,
} from '@visitscotland/component-library/components';

const page: Page | undefined = inject('page');

const props = defineProps<{
    itinerary: any,
}>();

const configStore = useConfigStore();

const itinerary: any = props.itinerary;

let document;

let mainTransport = '';
let itineraryTheme = '';

if (page) {
    document = page.getDocument();

    if (document) {
        mainTransport = document.model.data.transports[0];
        itineraryTheme = document.model.data.theme;
    }
}
</script>
