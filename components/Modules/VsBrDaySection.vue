<template>
    <VsContainer>
        <VsRow
            class="mt-500"
        >
            <VsCol
                cols="12"
                lg="4">
                <VsHeading
                    level="2"
                    heading-style="heading-l"
                    no-margins
                    class="mb-175 mb-lg-0">
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
                <div
                    v-for="(stop, index) in day.stops"
                    :key="index"
                    class="mb-400">
                    <div class="d-flex flex-column-reverse">
                        <VsRow class="mb-125">
                            <VsCol
                                cols="12"
                                md="8">
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
                            :src="stop.image.externalImage"
                            use-lazy-loading
                            class="rounded-2 w-100 mb-175"
                            :alt="stop.image.altText"
                        />
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
    day: any,
}>();
const day: any = props.day;
</script>
