<template>
    <VsContainer>
        <VsRow class="mt-500 mb-500">
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
                    {{ module.title }}
                </VsHeading>
            </VsCol>

            <VsCol
                cols="12"
                lg="8"
            >
                <VsBody>
                    <VsBrRichText
                        v-if="module.introduction && module.introduction.value"
                        :input-content="module.introduction.value"
                    />

                    <template
                        v-for="(section, index) in module.sections"
                        :key="index"
                    >
                        <template
                            v-if="section.video"
                        >
                            <VsBrVideoModal
                                :is-video-modal="true"
                                :close-btn-text="configStore.getLabel('essentials.global', 'close')"
                                :modal-id="section.video.youtubeId"
                                :video="section.video"
                            />

                            <VsBrMedia
                                :image="section.video.image.cmsImage"
                                :image-description="section.video.image.description"
                                :is-video="true"
                                :video-id="section.video.youtubeId"
                                :video-title="section.video.label
                                    ? section.video.label
                                    : configStore.getLabel('video', 'video.play-btn')
                                "
                                :small-play-button="true"
                                :show-toggle="false"
                            />
                        </template>
                        <template
                            v-else-if="section.image"
                        >
                            <VsBrMedia
                                :image="section.image.cmsImage"
                                :image-description="section.image.description"
                                :rounded="true"
                                class="mb-100"
                            />
                        </template>

                        <template
                            v-if="section.copy"
                        >
                            <VsBrRichText :input-content="section.copy.value" />
                        </template>
                    </template>
                </VsBody>
            </VsCol>
        </VsRow>
    </VsContainer>

    <div
        v-if="module.mediaSection && checkFlags('rich-article-images')"
        :class="nextModuleArticle ? 'mb-n250' : ''"
    >
        <VsBrMedia
            v-if="module.mediaSection.type === 'image'"
            :image="module.mediaSection.image.cmsImage"
            :image-description="module.mediaSection.image.description"
            :full-bleed="true"
            class="mt-n250"
        />

        <VsBrMedia
            v-else-if="module.mediaSection.type === 'video'"
            :video-id="module.mediaSection.video.youtubeId"
            :video-with-media-caption="true"
            class="mt-n250"
        >
            <template #video-title>
                {{ module.mediaSection.video.label }}
            </template>
        </VsBrMedia>

        <VsContentSwiper
            v-else-if="module.mediaSection.type === 'carousel'"
            :next-button-label="configStore.getLabel('essentials.pagination', 'page.next')"
            :previous-button-label="configStore.getLabel('essentials.pagination', 'page.previous')"
            :contained="false"
            :slides-per-view-lg="2.2"
            class="mt-n250"
        >
            <VsContentSwiperSlide
                v-for="(slide, index) in module.mediaSection.items"
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
</template>

<script lang="ts" setup>
 

import {
    VsContainer,
    VsRow,
    VsCol,
    VsHeading,
    VsBody,
    VsContentSwiper,
    VsContentSwiperSlide,
} from '@visitscotland/component-library/components';

import VsBrVideoModal from './VsBrVideoModal.vue';
import VsBrMedia from '~/components/Modules/VsBrMedia.vue';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{
    module: object,
    nextModuleArticle: boolean,
}>();

const module: any = props.module;
const nextModuleArticle: boolean = props.nextModuleArticle;

</script>

<style lang="scss" scoped>
    .vs-content-swiper :deep(.vs-button) {
        scroll-margin-top: 18rem;
    }
</style>
