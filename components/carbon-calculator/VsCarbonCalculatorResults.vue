<template>
    <VsRow data-test="vs-carbon-calculator-results">
        <VsCol cols="12">
            <VsHeading level="2" heading-style="heading-m">
                {{ labelsMap.results }}
            </VsHeading>
        </VsCol>
        <VsCol cols="12">
            <VsRow class="vs-carbon-calculator-results__summary">
                <VsCol cols="12" md="6">
                    <p class="mb-050">
                        {{ labelsMap.resultsIntro }}
                    </p>
                    <p><strong class="vs-carbon-calculator-results__total">{{ formattedTotal }}</strong> {{ labelsMap.kgsOf }}</p>
                </VsCol>
                <VsCol cols="12" md="6">
                    <p v-html="comparison" />
                </VsCol>
            </VsRow>
        </VsCol>
        <VsCol v-if="totalPerDay <= Number(labelsMap.perDayTarget)" cols="12">
            <div class="vs-carbon-calculator-results__unicorn">
                <VsIcon icon="fa-kit fa-vs-unicorn" size="lg" variant="highlight" />
                <div>
                    <VsHeading level="3" heading-style="heading-xs">
                        {{ labelsMap.perDayCongratulations }}
                    </VsHeading>
                    <p>{{ perDaySuccess }}</p>
                </div>
            </div>
        </VsCol>
        <VsCol cols="12">
            <VsHeading level="3" heading-style="heading-xs">
                {{ labelsMap.chartTitle }}
            </VsHeading>
            <div class="vs-carbon-calculator-results__chart" role="img" :aria-label="String(labelsMap.chartTitle)">
                <div v-for="item in chartData" :key="item.name" class="vs-carbon-calculator-results__bar-row">
                    <span>{{ item.name }}</span>
                    <div class="vs-carbon-calculator-results__bar-track">
                        <span :style="{ width: `${item.percent}%` }" />
                    </div>
                    <span>{{ item.emissions.toLocaleString(language, { minimumFractionDigits: 3 }) }}</span>
                </div>
                <p class="vs-carbon-calculator-results__axis">
                    {{ labelsMap.kgsOf }}
                </p>
            </div>
        </VsCol>
    </VsRow>
</template>

<script lang="ts" setup>
import {
    VsCol, VsHeading, VsIcon, VsRow, 
} from '@visitscotland/component-library/components';
import type { CarbonLabels, ComparisonReplacement } from '~/types/carbon-calculator';
import dataLayerComposable from '~/composables/dataLayer.ts';

const props = withDefaults(defineProps<{
    labelsMap: CarbonLabels,
    totalKilos?: number,
    foodKilos?: number,
    transportKilos?: number,
    accommodationKilos?: number,
    stayDuration?: number,
    comparisonReplacements?: ComparisonReplacement[],
    language?: string,
}>(), {
    totalKilos: 0,
    foodKilos: 0,
    transportKilos: 0,
    accommodationKilos: 0,
    stayDuration: 1,
    comparisonReplacements: () => [],
    language: 'en-gb',
});

const dataLayer = dataLayerComposable();
const formattedTotal = computed(() => props.totalKilos.toLocaleString(props.language, {
    minimumFractionDigits: 3, 
}));
const totalPerDay = computed(() => props.totalKilos / Math.max(props.stayDuration, 1));
const comparison = computed(() => props.comparisonReplacements.reduce((text, replacement) => text.replace(
    replacement.repl,
    (props.totalKilos / replacement.divisor).toLocaleString(props.language, {
        minimumFractionDigits: 3, 
    }),
), String(props.labelsMap.comparison || '')));
const perDaySuccess = computed(() => String(props.labelsMap.perDaySuccess || '').replace('xxx', String(props.labelsMap.perDayTarget)));
const chartData = computed(() => [
    {
        name: String(props.labelsMap.transport),
        emissions: props.transportKilos, 
    },
    {
        name: String(props.labelsMap.accommodation),
        emissions: props.accommodationKilos, 
    },
    {
        name: String(props.labelsMap.food),
        emissions: props.foodKilos, 
    },
].map((item) => ({
    ...item,
    percent: props.totalKilos ? (item.emissions / props.totalKilos) * 100 : 0, 
})));

onMounted(() => dataLayer.createDataLayerObject('carbonCompleteEvent', {
    totalEmissions: props.totalKilos,
    totalPerDay: totalPerDay.value,
    travelPercent: ((props.transportKilos / props.totalKilos) * 100 || 0).toFixed(3),
    accommodationPercent: ((props.accommodationKilos / props.totalKilos) * 100 || 0).toFixed(3),
    foodPercent: ((props.foodKilos / props.totalKilos) * 100 || 0).toFixed(3),
}));
</script>

<style scoped>
.vs-carbon-calculator-results__summary { margin-bottom: 1.5rem; }
.vs-carbon-calculator-results__total { font-size: 2rem; }
.vs-carbon-calculator-results__unicorn { display: flex; gap: 1rem; padding: 1rem; margin-bottom: 1.5rem; background: #fff9d6; box-shadow: 0 2px 8px #0002; }
.vs-carbon-calculator-results__unicorn :deep(.vs-heading) { margin-top: 0; }
.vs-carbon-calculator-results__chart { margin: 1.5rem auto 2rem; max-width: 48rem; }
.vs-carbon-calculator-results__bar-row { display: grid; grid-template-columns: minmax(7rem, 1fr) 3fr minmax(5rem, auto); gap: .75rem; align-items: center; margin-bottom: 1rem; }
.vs-carbon-calculator-results__bar-track { height: 2rem; background: #eee; }
.vs-carbon-calculator-results__bar-track span { display: block; height: 100%; min-width: 2px; background: #f5b335; }
.vs-carbon-calculator-results__axis { text-align: center; }
</style>
