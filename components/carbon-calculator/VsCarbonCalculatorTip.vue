<template>
    <aside class="vs-carbon-calculator-tip" data-test="vs-carbon-calculator-tip">
        <VsIcon icon="fa-kit fa-vs-coo-head" size="lg" variant="highlight" />
        <div>
            <VsHeading level="3" heading-style="heading-xs">
                {{ labelsMap.topTip }}
            </VsHeading>
            <p v-html="tip" />
        </div>
    </aside>
</template>

<script lang="ts" setup>
import { VsHeading, VsIcon } from '@visitscotland/component-library/components';
import type { CarbonLabels } from '~/types/carbon-calculator';

withDefaults(defineProps<{ labelsMap: CarbonLabels, tip?: string, }>(), {
    tip: '', 
});
</script>

<style scoped>
.vs-carbon-calculator-tip { display: flex; gap: 1rem; padding: 1rem; background: #e6f2f8; }
.vs-carbon-calculator-tip :deep(.vs-heading) { margin-top: 0; }
.vs-carbon-calculator-tip p { margin-bottom: 0; }
</style>
