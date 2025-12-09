<template>
    <VsContainer>
        <div class="row gap-175 gap-lg-0">
            <VsCol
                cols="12"
                lg="4"
            >
                <VsHeading
                    level="2"
                    heading-style="heading-l"
                    no-margins
                >
                    {{ day.title }}
                </VsHeading>
            </VsCol>
            <VsCol
                cols="12"
                lg="8"
                class="d-flex flex-column gap-300"
            >
                <VsBody>
                    <VsBrRichText :input-content="day.introduction.value" />
                </VsBody>

                <!-- STOPS -->

                <div
                    v-for="(stop, i) in day.stops"
                    :key="i"
                    class="d-flex flex-column gap-125"
                >
                    <div class="d-flex flex-column-reverse gap-175">
                        <VsRow>
                            <VsCol
                                cols="12"
                                md="8"
                                class="d-flex flex-column gap-050"
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
                        <VsImg
                            v-if="stop.image && stop.image.imageSrc"
                            :src="stop.image.imageSrc"
                            use-lazy-loading
                            class="rounded-2 w-100"
                            :alt="stop.image.altText"
                        />
                    </div>
                    <!-- <VsBody> -->
                    <div class="d-flex flex-column gap-075">
                        <VsBrRichText :input-content="stop.description.value" />
                    </div>
                    <!-- </VsBody> -->
                    <!-- Need to ensure there's a CTA / map link or we get an empty div that might be given margin by VsBody -->
                    <div
                        v-if="stop.ctaLink || stop.coordinates"
                        class="d-flex flex-wrap gap-125"
                    >
                        <VsButton
                            v-if="stop.ctaLink && stop.ctaLink.link"
                            :href="stop.ctaLink.link"
                            variant="secondary"
                        >
                            {{ stop.ctaLink.label }}
                        </VsButton>
                        <VsButton
                            v-if="stop.coordinates && stop.coordinates.latitude && stop.coordinates.longitude"
                            :href="`http://maps.google.com/maps?z=12&t=m&q=loc:${stop.coordinates.latitude}+${stop.coordinates.longitude}`"
                            variant="subtle"
                            icon="fa-regular fa-map"
                        >
                            See in Google maps
                        </VsButton>
                    </div>
                </div>
            </VsCol>
        </div>
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
    day: any,
}>();
const day: any = props.day;

</script>
