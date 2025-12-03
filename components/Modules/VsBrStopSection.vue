<template>
    <div
         class="mb-400">
        <div class="d-flex flex-column-reverse">
            <VsRow class="mb-125">
                <VsCol
                       cols="12"
                       md="8">
                    <VsHeading
                               heading-style="heading-xs"
                               level="3"
                               no-margins>
                        {{ stop.title }}
                    </VsHeading>
                    <VsDetail size="small">
                        {{ stop.subTitle }}
                    </VsDetail>
                </VsCol>
            </VsRow>
            <VsImg
                   :src="stop.image.imageSrc"
                   use-lazy-loading
                   class="rounded-2 w-100 mb-175"
                   :alt="stop.image.altText" />

        </div>
        <VsBody class="mb-150">
            <VsBrRichText :input-content="stop.description.value" />
        </VsBody>

        <div class="d-flex flex-wrap gap-125">
            <VsButton
                      href="#"
                      variant="secondary">
                {{ stop.ctaLink.label }}
            </VsButton>
            <VsButton
                      :href="`http://maps.google.com/maps?z=12&t=m&q=loc:${stop.coordinates.latitude}+${stop.coordinates.longitude}`"
                      variant="subtle"
                      icon="fa-regular fa-map">
                See in Google maps
            </VsButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    VsImg,
    VsHeading,
    VsButton,
    VsCol,
    VsRow,
    VsBody,
} from '@visitscotland/component-library/components';
import VsBrRichText from './VsBrRichText.vue';

const props = defineProps<{
    stop: any,
}>();
const stop: any = props.stop;
</script>
