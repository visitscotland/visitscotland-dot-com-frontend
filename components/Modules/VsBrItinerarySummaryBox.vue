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
                :icon="getDMSIconName(allTransports[0]?.key || '')"
                :icon-label="allTransports[0]?.displayName || ''"
                :label="allTransports[0]?.displayName || ''"
            />
            <VsSummaryBoxListItem
                :icon="getDMSIconName(theme.key)"
                :icon-label="theme.displayName"
                :label="theme.displayName"
            />
        </VsSummaryBoxList>
    </VsCol>
</template>

<script lang="ts" setup>
import useConfigStore from '~/stores/configStore.ts';

import {
    VsCol,
    VsSummaryBoxList,
    VsSummaryBoxListItem,
    VsSummaryBoxDistanceListItem,
} from '@visitscotland/component-library/components';

const props = defineProps<{
    itinerary: any,
    theme?: any,
    allTransports?: any[],
}>();

const configStore = useConfigStore();

const itinerary: any = props.itinerary;
const theme: any = props.theme;
const allTransports: any[] = props.allTransports || [];

</script>
