<template>
    <div class="text-start">
        <VsCarbonCalculator
            :labels-map="configStore.getLabelMap('carbon-calculator')"
            :locale="configStore.locale"
        />
    </div>
</template>

<script lang="ts" setup>

import { VsCarbonCalculator } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

</script>
