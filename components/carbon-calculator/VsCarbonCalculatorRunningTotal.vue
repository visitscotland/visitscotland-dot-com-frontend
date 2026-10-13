<template>
    <div class="vs-carbon-calculator-running-total" data-test="vs-carbon-calculator-running-total">
        <VsIcon icon="fa-regular fa-pen-field" size="md" />
        <div class="vs-carbon-calculator-running-total__content">
            <p>{{ labelsMap.soFar }}</p>
            <p><strong>{{ formattedTotal }}</strong> {{ labelsMap.kgsOf }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { VsIcon } from '@visitscotland/component-library/components';
import type { CarbonLabels } from '~/types/carbon-calculator';

const props = withDefaults(defineProps<{
    labelsMap: CarbonLabels,
    totalKilos?: number,
    language?: string,
}>(), {
    totalKilos: 0,
    language: 'en-gb', 
});

const formattedTotal = computed(() => props.totalKilos.toLocaleString(props.language, {
    minimumFractionDigits: 3,
}));
</script>

<style scoped>
.vs-carbon-calculator-running-total { margin-top: 1.5rem; border: 2px solid #0065bd; padding: 1rem; display: flex; gap: 1rem; align-items: center; }
.vs-carbon-calculator-running-total__content p { display: inline; margin: 0 .5rem 0 0; }
@media (min-width: 768px) { .vs-carbon-calculator-running-total { justify-content: center; } }
</style>
