<template>
    <div class="text-start">
        <VsCarbonCalculator
            :labels-map="labelsMap"
            :language="configStore.locale || 'en-gb'"
        />
    </div>
</template>

<script lang="ts" setup>
import VsCarbonCalculator from '~/components/carbon-calculator/VsCarbonCalculator.vue';
import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();
const labelsMap = computed(() => configStore.getLabelMap('carbon-calculator') || {
});
</script>
