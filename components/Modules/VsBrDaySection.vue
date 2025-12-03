<template>
    <VsContainer>
        <VsRow
            class="mt-500"
        >
            <VsCol
                cols="12"
                lg="4"
            >
                <VsHeading
                    level="2"
                    heading-style="heading-l"
                    no-margins
                    class="mb-175 mb-lg-0"
                >
                    {{ day.title }}
                </VsHeading>
            </VsCol>
            <VsCol
                cols="12"
                lg="8"
            >
                <VsBody class="mb-400">
                    <VsBrRichText :input-content="day.introduction.value" />
                </VsBody>
                <VsBrStopSection
                    v-for="(stop, i) in day.stops"
                    :stop="stop"
                />
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script setup lang="ts">
import {
    VsImg,
    VsHeading,
    VsButton,
    VsContainer,
    VsCol,
    VsRow,
    VsBody,
} from '@visitscotland/component-library/components';
import VsBrRichText from './VsBrRichText.vue';
import VsBrStopSection from './VsBrStopSection.vue';

const props = defineProps<{
    day: any,
}>();
const day: any = props.day;

</script>
