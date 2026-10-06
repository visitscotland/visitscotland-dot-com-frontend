<template>
    <div class="vs-carbon-calculator-intro" data-test="vs-carbon-calculator-intro">
        <VsHeading level="2" heading-style="heading-l">
            {{ labelsMap.introHeading }}
        </VsHeading>
        <p>{{ labelsMap.introContent }}</p>
    </div>
</template>

<script lang="ts" setup>
import { VsHeading } from '@visitscotland/component-library/components';
import type { CarbonLabels } from '~/types/carbon-calculator';

defineProps<{ labelsMap: CarbonLabels, }>();
</script>
