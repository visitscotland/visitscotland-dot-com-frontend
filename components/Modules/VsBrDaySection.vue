<template>
    <VsContainer
        class="vs-daysection-wrapper"
    >
        <VsRow>
            <VsCol>
                <span class="vs-section-header__divider mb-0" />
            </VsCol>
        </VsRow>
        <div class="row gap-300 gap-lg-0">
            <VsCol
                cols="12"
                lg="4"
                class="mt-150"
            >
                <VsHeading
                    level="2"
                    heading-style="heading-l"
                    no-margins
                >
                    {{ dayLabel }} {{ dayNumber }} - {{ day.title }}
                </VsHeading>
            </VsCol>
            <VsCol
                cols="12"
                lg="8"
                class="d-flex flex-column gap-150"
            >
                <template
                    v-if="day.video"
                >
                    <VsBrMedia
                        :video-id="day.video.youtubeId"
                        :video-with-media-caption="true"
                    >
                        <template #video-title>
                            {{ day.video.label }}
                        </template>
                    </VsBrMedia>
                </template>
                <template
                    v-else-if="day.image"
                >
                    <VsBrMedia
                        :image="day.image.cmsImage"
                        :image-description="day.image.description"
                        :rounded="true"
                        class="mb-100"
                    />
                </template>    

                <div>
                    <VsBody>
                        <VsBrRichText :input-content="day.introduction.value" />
                    </VsBody>
                </div>
                <div
                    class="d-flex flex-wrap gap-075"
                >
                    <VsButton
                        v-if="day.ctaLink.link && day.ctaLink.label"
                        :href="day.ctaLink.link"
                        variant="secondary"
                    >
                        {{ day.ctaLink.label }}
                    </VsButton>
                    <VsButton
                        v-if="day.mapLink.link"
                        :href="day.mapLink.link"
                        variant="subtle"
                        icon="fa-regular fa-map"
                    >
                        {{ day.mapLink.label }}
                    </VsButton>
                </div>
            </VsCol>
        </div>
    </VsContainer>
</template>

<script setup lang="ts">
import useConfigStore from '~/stores/configStore.ts';

import {
    VsHeading,
    VsButton,
    VsContainer,
    VsRow,
    VsCol,
    VsBody,
} from '@visitscotland/component-library/components';

import VsBrRichText from './VsBrRichText.vue';
import VsBrMedia from './VsBrMedia.vue';

const configStore = useConfigStore();

const props = defineProps<{
    day: any,
    dayNumber: any,
}>();

const day: any = props.day;
const dayNumber: any = props.dayNumber;

const dayLabel = configStore.getLabel('itinerary', 'day');

</script>

<style>
    .vs-daysection-wrapper h3 {
        margin-bottom: 1.25rem !important;
        margin-top: 0 !important;
    }

    .vs-daysection-wrapper figure {
        margin: 0;
    }
</style>
