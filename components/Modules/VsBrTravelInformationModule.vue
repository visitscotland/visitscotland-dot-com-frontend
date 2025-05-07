<template>
    <VsModuleWrapper theme="neutral">
        <template #vs-module-wrapper-heading>
            {{ module.title }}
        </template>

        <template #vs-module-wrapper-intro>
            <div v-html="module.copy.value" />
        </template>

        <VsContainer>
            <VsRow>
                <VsCol cols="12" sm="10" offset-sm="1">
                    <VsTabs>
                        <VsBrTravelInformationTab :tab="module.gettingTo" />
                        <VsBrTravelInformationTab :tab="module.gettingAround" />
                    </VsTabs>
                </VsCol>
            </VsRow>
        </VsContainer>
    </VsModuleWrapper>
</template>

<script lang="ts" setup>

import {
    VsModuleWrapper,
    VsContainer,
    VsRow,
    VsCol,
    VsTabs,
} from '@visitscotland/component-library/components';

import VsBrTravelInformationTab from './VsBrTravelInformationTab.vue';

const props = defineProps<{ module: Object }>();
const module: any = props.module;

</script>
