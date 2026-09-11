<template>
    <VsModuleWrapper theme="neutral">
        <template #vs-module-wrapper-heading>
            {{ props.module.title }}
        </template>

        <template #vs-module-wrapper-intro v-if="props.module.copy">
            <VsBrRichText
                :input-content="props.module.copy.value"
            />
        </template>

        <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    sm="10"
                    offset-sm="1"
                >
                    <VsTabs>
                        <VsBrTravelInformationTab
                            v-for="(item, index) in module.practicalInformation"
                            :key="index"
                            :tab="item"
                            :tab-index="index"
                        />
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

import type { Copy, TravelInformation } from '~/types/types.ts';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import VsBrTravelInformationTab from './VsBrTravelInformationTab.vue';

type TravelInformationModule = {
    title: string;
    copy?: Copy;
    practicalInformation: TravelInformation[];
    // Don't need to type the rest of the module properties.
    [key: string]: unknown;
}

type Props = {
    module: TravelInformationModule;
};

const props = defineProps<Props>();
</script>
