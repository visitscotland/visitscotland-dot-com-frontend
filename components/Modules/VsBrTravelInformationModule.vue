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
                            v-for="(item, index) in tabItems"
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

import type { Copy, TravelTabContent } from '~/types/types.ts';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import VsBrTravelInformationTab from './VsBrTravelInformationTab.vue';

type Props = {
    module: {
        title: string;
        copy?: Copy;
        gettingTo?: TravelTabContent;
        gettingAround?: TravelTabContent;
        // Don't need to type the rest of the module properties.
        [key: string]: unknown;
    };
}

const props = defineProps<Props>();

const tabItems = [
    ...(props.module.gettingTo) ? [props.module.gettingTo] : [],
    ...(props.module.gettingAround) ? [props.module.gettingAround] : [],
];

// const tabItems = [
//     ...props.module.practicalInformation,
//     ...(props.module.gettingTo) ? [props.module.gettingTo] : [],
//     ...(props.module.gettingAround) ? [props.module.gettingAround] : [],
// ];
</script>
