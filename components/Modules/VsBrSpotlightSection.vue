<template>
    <VsContainer>
        <VsRow>
            <VsCol>
                <VsSpotlightSection
                    :heading="module.title"
                    :image-src="image"
                    :cta-link="formatLink(module.cta.link)"
                    :cta-text="module.cta.label"
                    :description="description"
                    :compact="module.layout === 'compact' ? true : false"
                >
                    <template
                        v-if="module.ambientVideo"
                        #vs-spotlight-section-media
                    >
                        <VsVideo
                            video-type="html5"
                            :video-src="module.ambientVideo"
                            ref="spotlightVideo"
                            post-image-src="image"
                            :play-button-label="configStore.getLabel('ambient-video', 'play-button.text')"
                            :pause-button-label="configStore.getLabel('ambient-video', 'pause-button.text')"
                            :show-toggle="false"
                            :video-id="videoId"
                        />
                    </template>

                    <template
                        v-if="module.ambientVideo"
                        #vs-spotlight-section-overlay-controls
                    >
                        <VsToggleButton
                            variant="overlay"
                            icon="vs-icon-control-pause"
                            pressed-icon="vs-icon-control-play"
                            :label="configStore.getLabel('ambient-video', 'play-button.text')"
                            :pressed-label="configStore.getLabel('ambient-video', 'pause-button.text')"
                            :aria-controls="videoId"
                            @click="toggleVideo()"
                        />
                    </template>
                </VsSpotlightSection>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
 

import { inject, ref, getCurrentInstance } from 'vue';

import { decode } from 'html-entities';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsSpotlightSection,
    VsContainer,
    VsRow,
    VsCol,
    VsVideo,
    VsToggleButton,
} from '@visitscotland/component-library/components';

import formatLink from '~/composables/formatLink.ts';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const spotlightVideo = ref(null);

const page: Page | undefined = inject('page');

const props = defineProps<{ module: object }>();
const module: any = props.module;

const instance = getCurrentInstance();
const videoId = `spotlight-video-${instance?.uid}`;

let image: any = null;

if (module.image.cmsImage) {
    image = page.getContent(module.image.cmsImage.$ref);
    image = image.getOriginal().getUrl();
} else if (module.image.externalImage) {
    if (module.image.externalImage.$ref) {
        image = page.getContent(module.image.externalImage.$ref);
        image = image.getOriginal().getUrl();
    } else {
        image = module.image.externalImage;
    }
}

if (image.startsWith('assets')) {
    image = `/${image}`;
}

// Strip out paragraph tags that are only sometimes present
let description = module.copy.value.replace(/<[^>]+>/g, '');
// Parse html entities that the editor is sending
description = decode(description);

const toggleVideo = () => {
    if (spotlightVideo.value) {
        spotlightVideo.value.toggleVideo();
    }
};

</script>

<style>
    /* TEMP VS-580 & VS-1501: Add vertical whitespace between spotlight and adjacent grey sections.
    Remove when grey backgrounds are eliminated from navigation pages OR when layout layer manages inter-module spacing. */

    @supports selector(:has(.vs-spotlight-section)) {
        [class$="--grey"] + [id^="section-"]:has(.vs-spotlight-section),
        [id^="section-"]:has(.vs-spotlight-section) + [id^="section-"]:has(>[class$="--grey"]),
        [id^="section-"]:has(.vs-spotlight-section) + [id^="section-"]:has(>[class^="vs-ugc"]),
        [id^="section-"]:has(.vs-spotlight-section) + [id^="section-"]:has(>[class^="vs-article"]){
            margin-block-start: var(--vs-space-500, 5rem);
        }
    }

</style>
