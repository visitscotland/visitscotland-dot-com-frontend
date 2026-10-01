<template>
    <section class="vs-br-travel-information-module">
        <VsBrSectionHeader
            :heading="props.module.title"
            :lede="props.module.copy?.value"
        />

        <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    sm="10"
                    offset-sm="1"
                >
                    <VsTabs>
                        <VsBrTravelInformationTab
                            v-for="(item, index) in props.module.practicalInformation"
                            :key="index"
                            :tab="item"
                            :tab-index="index"
                        />
                    </VsTabs>
                </VsCol>
            </VsRow>
        </VsContainer>
    </section>
</template>

<script lang="ts" setup>
import {
    VsContainer,
    VsRow,
    VsCol,
    VsTabs,
} from '@visitscotland/component-library/components';

import VsBrSectionHeader from './VsBrSectionHeader.vue';
import type { Copy, TravelInformation } from '~/types/types.ts';
import VsBrTravelInformationTab from './VsBrTravelInformationTab.vue';

type TravelInformationModule = {
    title: string;
    copy?: Copy;
    practicalInformation: TravelInformation[];
    [key: string]: unknown;
}

type Props = {
    module: TravelInformationModule;
};

const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.vs-br-travel-information-module {
    padding: 3rem 0;
    background-color: #E5E5F0;

    @media (min-width: 576px) {
        padding: 4.5rem 0 6rem;
    }
}
</style>
