<template>
    <VsModuleWrapper
        class="text-start"
    >
        <VsCarbonCalculator
            :labels-map="configStore.getLabelMap('carbon-calculator')"
            :locale="configStore.locale"
        />
    </VsModuleWrapper>
</template>

<script lang="ts" setup>

import { VsCarbonCalculator, VsModuleWrapper } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

</script>
