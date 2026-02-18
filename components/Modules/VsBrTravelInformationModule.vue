<template>
    <VsModuleWrapper theme="neutral">
        <template #vs-module-wrapper-heading>
            {{ module.title }}
        </template>

        <template #vs-module-wrapper-intro v-if="module.copy">
            <VsBrRichText
                :input-content="module.copy.value"
            />
        </template>

        <VsContainer>
            <VsRow>
                <VsCol cols="12" sm="10" offset-sm="1">
                    <VsTabs>
                        <VsBrTravelInformationTab :tab="module.gettingTo" :tab-index="0" />
                        <VsBrTravelInformationTab :tab="module.gettingAround" :tab-index="1" />
                    </VsTabs>
                </VsCol>
            </VsRow>
        </VsContainer>
    </VsModuleWrapper>
</template>

<script lang="ts" setup>

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

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

const decoder = document.createElement('textarea');
decoder.innerHTML = 'broken content';

</script>
