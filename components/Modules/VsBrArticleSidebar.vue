<template>
    <VsArticleSidebar
        :sidebar-align="alignment"
    >
        <template
            #vs-article-sidebar-img
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

                <VsBrImageWithCaption
                    :image="section.video.image.cmsImage"
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
                <VsBrImageWithCaption
                    :image="section.image.cmsImage"
                    :image-description="section.image.description"
                />
            </template>
        </template>

        <template
            #vs-article-sidebar-quote
            v-if="section.quote"
        >
            <VsBrQuote
                :quote="section.quote"
            />
        </template>
    </VsArticleSidebar>
</template>

<script lang="ts" setup>
import { VsArticleSidebar } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import VsBrImageWithCaption from '~/components/Modules/VsBrImageWithCaption.vue';
import VsBrQuote from '~/components/Modules/VsBrQuote.vue';

const configStore = useConfigStore();

const props = defineProps<{ section: any, alignment: string }>();
const section: any = props.section;
const alignment: string = props.alignment;

</script>
