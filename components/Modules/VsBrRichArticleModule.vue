<template>
    <VsContainer>
        <VsRow class="mt-500">
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
</template>

<script lang="ts" setup>
 

import {
    VsContainer,
    VsRow,
    VsCol,
    VsHeading,
    VsBody,
    VsImg,
    VsMediaCaption,
} from '@visitscotland/component-library/components';


import VsBrMedia from '~/components/Modules/VsBrMedia.vue';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{ module: object }>();
const module: any = props.module;

</script>
