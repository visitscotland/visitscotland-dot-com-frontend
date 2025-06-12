<template>
    <VsMap
        :list-view-text="configStore.getLabel('itinerary', 'list-view')"
        :map-view-text="configStore.getLabel('itinerary', 'map-view')"
        map-id="vs-itinerary-map"
        :is-visible="true"
        :fit-to-markers="true"
        :places="places"
    />
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{ places }>();

const { places } = toRefs(props);
</script>
