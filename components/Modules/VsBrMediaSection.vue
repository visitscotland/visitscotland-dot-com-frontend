<template>
    <VsContainer
        v-if="mediaSection.type === 'image'"
    >
        <VsRow>
            <VsCol>
                <VsBrMedia
                    :image="mediaSection.image.cmsImage"
                    :image-description="mediaSection.image.description"
                    :full-bleed="true"
                    class="mt-n250"
                />
            </VsCol>
        </VsRow>
    </VsContainer>

    <VsContainer
        v-if="mediaSection.type === 'video'"
    >
        <VsRow>
            <VsCol>
                <VsBrMedia
                    :video-id="mediaSection.video.youtubeId"
                    :video-with-media-caption="true"
                    class="mt-n250"
                >
                    <template #video-title>
                        {{ mediaSection.video.label }}
                    </template>
                </VsBrMedia>
            </VsCol>
        </VsRow>
    </VsContainer>

    <VsContentSwiper
        v-else-if="mediaSection.type === 'carousel'"
        :next-button-label="configStore.getLabel('essentials.pagination', 'page.next')"
        :previous-button-label="configStore.getLabel('essentials.pagination', 'page.previous')"
        :contained="false"
        :slides-per-view-lg="2.2"
        class="mt-n250"
    >
        <VsContentSwiperSlide
            v-for="(slide, index) in mediaSection.items"
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
</template>

<script lang="ts" setup>
import {
    VsContentSwiper,
    VsContentSwiperSlide,
    VsContainer,
    VsRow,
    VsCol,
} from '@visitscotland/component-library/components';

import VsBrMedia from '~/components/Modules/VsBrMedia.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{
    mediaSection: object,
}>();

const mediaSection: any = props.mediaSection;

</script>
