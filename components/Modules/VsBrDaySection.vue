<template>
    <VsContainer
        class="vs-daysection-wrapper"
    >
        <VsRow>
            <VsCol>
                <span class="vs-section-header__divider mb-0" />
            </VsCol>
        </VsRow>
        <div class="d-flex flex-column gap-150">
            <VsRow class="gap-300 gap-lg-0">
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
                    <div v-if="videoValue">
                        <VsVideo
                            :video-title="videoLabel"
                            :video-id="youtubeId"
                            :single-minute-descriptor="configStore.getLabel('video', 'video.minute-text')"
                            :plural-minute-descriptor="configStore.getLabel('video', 'video.minutes-text')"
                            :no-cookies-message="configStore.getLabel('video', 'video.no-cookies')"
                            :no-js-message="configStore.getLabel('video', 'video.no-js')"
                            :cookie-btn-text="configStore.getLabel('essentials.global', 'cookie.link-message')"
                            :error-message="configStore.getLabel('essentials.global', 'third-party-error')"
                        />
                        <VsMediaCaption :video-id="youtubeId">
                            <template #caption>
                                {{ videoLabel ?? configStore.getLabel('video', 'video.play-btn') }}
                            </template>
                        </VsMediaCaption>
                    </div>
                    <figure
                        v-if="imageValue"
                    >
                        <VsImg
                            :src="imageSrc"
                            use-lazy-loading
                            class="rounded-2 w-100"
                            :alt="imageAlt"
                        />
                        <figcaption v-if="imageCredit || imageCaption">
                            <VsMediaCaption>
                                <template #caption>
                                    {{ imageCaption }}
                                </template>
                                <template v-if="imageCredit" #credit>
                                    {{ imageCredit }}
                                </template>
                            </VsMediaCaption>
                        </figcaption>
                    </figure>
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
            </VsRow>
            <div
                v-if="day.mediaSection"
            >
                <VsBrMedia
                    v-if="day.mediaSection.type === 'image'"
                    :image="day.mediaSection.image.cmsImage"
                    :image-description="day.mediaSection.image.description"
                    :full-bleed="true"
                />

                <VsBrMedia
                    v-else-if="day.mediaSection.type === 'video'"
                    :video-id="day.mediaSection.video.youtubeId"
                    :video-with-media-caption="true"
                >
                    <template #video-title>
                        {{ day.mediaSection.video.label }}
                    </template>
                </VsBrMedia>

                <VsContentSwiper
                    v-else-if="day.mediaSection.type === 'carousel'"
                    :next-button-label="configStore.getLabel('essentials.pagination', 'page.next')"
                    :previous-button-label="configStore.getLabel('essentials.pagination', 'page.previous')"
                    contained
                    :slides-per-view-lg="2.2"
                >
                    <VsContentSwiperSlide
                        v-for="(slide, index) in day.mediaSection.items"
                        :key="'image-group-' + index"
                    >
                        <VsBrMedia
                            v-if="slide.type === 'VIDEO'"
                            :video-id="slide.youtubeId"
                            :video-with-media-caption="true"
                            class="w-100"
                        >
                            <template #video-title>
                                {{ slide.label }}
                            </template>
                        </VsBrMedia>

                        <VsBrMedia
                            v-else
                            :image="slide.cmsImage"
                            :image-description="slide.description"
                            class="w-100"
                        />

                    </VsContentSwiperSlide>
                </VsContentSwiper>
            </div>
        </div>
    </VsContainer>

</template>

<script setup lang="ts">
import { inject } from 'vue';
import useConfigStore from '~/stores/configStore.ts';

import {
    VsImg,
    VsHeading,
    VsButton,
    VsContainer,
    VsRow,
    VsCol,
    VsBody,
    VsMediaCaption,
    VsVideo,
    VsContentSwiper,
    VsContentSwiperSlide,
} from '@visitscotland/component-library/components';
import VsBrRichText from './VsBrRichText.vue';
import VsBrMedia from '~/components/Modules/VsBrMedia.vue';

const configStore = useConfigStore();

const props = defineProps<{
    day: any,
    dayNumber: any,
}>();

const page: any = inject('page');
const day: any = props.day;
const dayNumber: any = props.dayNumber;

let imageValue = false;
let imageSrc = null;
let imageCaption = null;
let imageAlt = null;
let imageCredit = null;

let videoValue = false;
let youtubeId = null;
let videoLabel = null;

let firstDayMedia = null;
let firstDayVideo = null;
const firstMediaItem = day.media?.[0];

if (firstMediaItem) {
    if (firstMediaItem.$ref) {
        firstDayMedia = page.getContent(firstMediaItem.$ref);
    }

    if (firstMediaItem.videoLink) {
        firstDayVideo = page.getContent(firstMediaItem.videoLink);
    }
}

if (firstDayMedia) {
    imageValue = firstDayMedia;
    imageSrc = imageValue.getOriginal().getUrl();
    imageCaption = imageValue.model.data.description;
    imageAlt = imageValue.model.data.altText;
    imageCredit = imageValue.model.data.credit;
}

if (firstDayVideo) {
    videoValue = firstDayVideo;
    youtubeId = videoValue.model.data.url.split('?v=')[1];
    videoLabel = videoValue.model.data.label;
}

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
