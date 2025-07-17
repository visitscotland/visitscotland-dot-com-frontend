<template>
    <ClientOnly>
        <VsModal
            :is-video-modal="isVideoModal"
            :close-btn-text="closeBtnText"
            :modal-id="modalId"
        >
            <VsRow>
                <VsCol cols="12">
                    <VsVideo
                        :video-title="video.label"
                        :video-id="video.youtubeId
                            ? video.youtubeId
                            : extractYoutubeId(video.url)
                        "
                        :locale="configStore.locale"
                        :single-minute-descriptor="configStore.getLabel('video', 'video.minute-text')"
                        :plural-minute-descriptor="configStore.getLabel('video', 'video.minutes-text')"
                        :no-cookies-message="configStore.getLabel('video', 'video.no-cookies')"
                        :no-js-message="configStore.getLabel('video', 'video.no-js')"
                        :cookie-btn-text="configStore.getLabel('essentials.global', 'cookie.link-message')"
                        :error-message="configStore.getLabel('essentials.global', 'third-party-error')"
                    />
                </VsCol>
            </VsRow>
            <VsRow>
                <VsCol
                    cols="10"
                    offset="1"
                >
                    <VsBody>
                        <p>{{ video.teaser }}</p>
                    </VsBody>
                </VsCol>
            </VsRow>
        </VsModal>
    </ClientOnly>
</template>

<script lang="ts" setup>
/* eslint no-undef: 0 */

import { toRefs, inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsModal, VsVideo, VsRow, VsCol, VsBody,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

interface IProps {
    isVideoModal: boolean,
    closeBtnText: string,
    modalId: string,
    video: any,
};

const props = withDefaults(defineProps<IProps>(), {
    isVideoModal: false,
    closeBtnText: 'Close',
    modalId: '',
    video: {
    },
});

const {
    isVideoModal,
    closeBtnText,
    modalId,
    video,
} = toRefs(props);

const page: Page | undefined = inject('page');

const contentUrl = video.value.youtubeId
    ? `https://youtube.com/watch?v=${video.value.youtubeId}`
    : video.value.url;

let imageValue : any = null;

if (page) {
    if (video.value.image.cmsImage) {
        imageValue = page.getContent(video.value.image.cmsImage.$ref);
        imageValue = imageValue.getOriginal().getUrl();
    } else {
        imageValue = video.value.image;
    }
}

useJsonld({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.value.label,
    description: video.value.teaser,
    contentUrl,
    thumbnailUrl: imageValue,
    uploadDate: video.value.publishedDate
        ? new Date(video.value.publishedDate).toISOString()
        : '',
});

</script>
