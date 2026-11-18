<template>
    <slot />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import type { Page } from '@bloomreach/spa-sdk';
import useBrPageConfiguration from '~/composables/useBrPageConfiguration.ts';

const props = defineProps<{ page: Page }>();
const initialize = useBrPageConfiguration();

// Immediate setup runs before the slot's children, including during SSR.
// A replacement page is applied synchronously before its sections update.
watch(() => props.page, initialize, {
    immediate: true,
    flush: 'sync', 
});
</script>
