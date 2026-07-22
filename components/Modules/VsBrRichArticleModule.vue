<template>
    <VsContainer>
        <VsRow>
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
                                :class="mediaHasTopMargin(index) ? 'mt-150' : ''"
                            />
                        </template>

                        <template
                            v-if="section.copy"
                        >
                            <VsBrRichText :input-content="section.copy.value" />
                        </template>

                        <template
                            v-if="section.quote"
                        >
                            <VsQuote
                                :use-legacy="false"
                                :quote-name="section.quote.authorName"
                                :class="index !== module.sections.length - 1 ? 'mb-150' : ''"
                            >
                                <template
                                    #quote-content
                                >
                                    <VsBody>
                                        <VsBrRichText :input-content="section.quote.quote.value" />
                                    </VsBody>
                                </template>

                                <template
                                    v-if="section.quote.authorTitle"
                                    #quote-details
                                >
                                    <span>{{ section.quote.authorTitle }}</span>
                                </template>
                            </VsQuote>
                        </template>
                    </template>
                </VsBody>
            </VsCol>
        </VsRow>
    </VsContainer>

    <div
        v-if="module.mediaSection"
        :class="nextModuleArticle ? 'mb-n250' : ''"
    >
        <VsBrMediaSection
            :media-section="module.mediaSection"
        />
    </div>
</template>

<script lang="ts" setup>
 

import {
    VsContainer,
    VsRow,
    VsCol,
    VsHeading,
    VsBody,
    VsQuote,
} from '@visitscotland/component-library/components';

import VsBrVideoModal from './VsBrVideoModal.vue';
import VsBrMediaSection from '~/components/Modules/VsBrMediaSection.vue';
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

const mediaHasTopMargin = (index : number) => {
    if (index !== 0) {
        return true;
    }

    if (module.introduction && module.introduction.value) {
        return true;
    }

    return false;
}

</script>

<style lang="scss" scoped>
    .vs-content-swiper :deep(.vs-button) {
        scroll-margin-top: 14rem;
    }
</style>
