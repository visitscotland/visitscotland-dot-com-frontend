<template>
    <section class="vs-br-travel-information-module">
        <VsBrSectionHeader
            :heading="module.title"
            :lede="module.copy?.value"
        />

        <VsContainer>
            <VsRow>
                <VsCol cols="12" sm="10" offset-sm="1">
                    <VsTabs>
                        <VsBrTravelInformationTab
                            v-if="module.gettingTo"
                            :tab="module.gettingTo"
                            :tab-index="0"
                        />
                        <VsBrTravelInformationTab
                            v-if="module.gettingAround"
                            :tab="module.gettingAround"
                            :tab-index="1"
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
import VsBrTravelInformationTab from './VsBrTravelInformationTab.vue';

const props = defineProps<{ module: object }>();
const module: any = props.module;

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
