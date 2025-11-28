<template>
      <!-- {{ stops[0] }} -->
    <VsContainer>
        <VsRow 
            class="mt-500"
            v-for="(stop, i) in stops"
            :key="i"
        >
            <!-- First col: Section heading - Itinerary day -->
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
                    {{ stop.title }}
                </VsHeading>
            </VsCol>

            <!-- Second col: Section content -->
            <VsCol
                cols="12"
                lg="8"
            >
                <!------- Itinerary day intro ------->
                <VsBody class="mb-400">
                    <!-- <VsBrRichText :input-content="stop.description.value" /> -->
                     ITINERARY DAY INTRO
                </VsBody>

                <!------- New structured content block: Itinerary stop ------->
                <div class="mb-400">
                    <VsImg
                        src="https://2f1a7f9478.visitscotland.net/binaries/content/gallery/visitscotland/cms-images/2023/08/28/edinburgh-castle?size=lg"
                        use-lazy-loading
                        class="rounded-2 w-100 mb-175"
                    />

                    <!------- Content block header -------> 
                    <VsRow class="mb-125">
                        <VsCol
                            cols="12"
                            md="8"
                        >
                            <VsHeading 
                                heading-style="heading-xs"
                                level="3"
                                no-margins
                            >
                                {{ stop.title }}
                            </VsHeading>
                            <VsDetail size="small">
                                {{ stop.subTitle }}
                            </VsDetail>
                        </VsCol>
                    </VsRow>

                    <!------- Content block body -------> 
                    <VsBody class="mb-150">
                        <VsBrRichText :input-content="stop.description.value" />
                    </VsBody>

                    <div class="d-flex flex-wrap gap-125">
                        <VsButton
                            href="#"
                            variant="secondary"
                        >
                            Plan your trip to the castle
                        </VsButton>

                        <VsButton
                            href="#"
                            variant="subtle"
                            icon="fa-regular fa-map"
                        >
                            See in Google maps
                        </VsButton>
                    </div>
                </div>
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

const props = defineProps<{
    stops: any,
}>();
const stops: any = props.stops;
</script>
