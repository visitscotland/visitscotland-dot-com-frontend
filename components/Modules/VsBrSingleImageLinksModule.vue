<template>
    <VsMegalinks
        :title="module.title"
        variant="single-image"
        :theme="theme"
        :cookie-link-text="configStore.getLabel('essentials.global', 'cookie.link-message')"
        :no-cookies-message="configStore.getLabel('video', 'video.no-cookies')"
        :no-js-message="configStore.getLabel('video', 'video.no-js')"
    >
        <template
            v-if="module.introduction"
            #vs-megalinks-intro
        >
            <VsBrRichText :input-content="module.introduction.value" />
        </template>

        <VsCol
            cols="12"
        >
            <VsMegalinkSingleImage
                :title="module.innerTitle"
                :button-link="module.cta && module.cta.link ? formatLink(module.cta.link) : ''"
                :alternate="module.alternate"
            >
                <template
                    #vs-single-image
                    v-if="module.image"
                >
                    <VsBrMedia
                        ref="media"
                        :mobile-overlap="true"
                        :alignment="module.alternate === true ? 'left' : 'right'"
                        :image="module.image.cmsImage
                            ? module.image.cmsImage
                            : module.image.externalImage"
                        :image-description="module.image.description"
                        :style="cssVars"
                    />
                </template>

                <template
                    #vs-single-image-content
                    v-if="module.innerIntroduction"
                >
                    <VsBrRichText :input-content="module.innerIntroduction.value" />
                </template>

                <template
                    #vs-single-image-button-text
                    v-if="module.cta && module.cta.label"
                >
                    {{ module.cta.label }}
                </template>

                <template #vs-single-image-links>
                    <template
                        v-for="(link, index) in module.links"
                        :key="index"
                    >
                        <VsLinkListItem
                            :type="link.youtubeId
                                ? 'video'
                                : null"
                            :href="link.youtubeId
                                ? '#'
                                : formatLink(link.link)
                            "
                            :video-id="link.youtubeId
                                ? link.youtubeId
                                : ''
                            "
                            :video-descriptor="configStore.getLabel('video', 'video.video-descriptor')"
                        >
                            {{ link.label }}
                        </VsLinkListItem>

                        <VsBrVideoModal
                            v-if="link.youtubeId"
                            :is-video-modal="true"
                            :close-btn-text="configStore.getLabel('essentials.global', 'close')"
                            :modal-id="link.youtubeId"
                            :video="link"
                        />
                    </template>
                </template>
            </VsMegalinkSingleImage>
        </VsCol>
    </VsMegalinks>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import {
    VsMegalinks,
    VsMegalinkSingleImage,
    VsCol,
    VsLinkListItem,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

import formatLink from '~/composables/formatLink.ts';

import VsBrMedia from '~/components/Modules/VsBrMedia.vue';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

const configStore = useConfigStore();

const props = defineProps<{ module: object, theme: string }>();
const module: any = props.module;
const theme: string = props.theme;

const media = ref(null);

let negativeMargin = ref('200px');

const cssVars  = computed(() => {
    return {
        '--negative-margin': `-${negativeMargin.value}`,
    };
});

onMounted(() => {
    if (media.value) {
        const img = media.value.$el.querySelector('img');

        img.addEventListener('load', () => {
            const offsetPercentToMiddle = img.clientHeight / 2.5 / img.clientWidth;
            negativeMargin.value = `${offsetPercentToMiddle * 100}%`;
        });
    }
});

</script>

<style lang="scss">
    .vs-megalink-single-image {
         .vs-br-media {
            overflow: hidden;
            margin: 0 -12px;
        }

        @media (min-width: 576px) {
            .vs-br-media {
                margin-bottom: 0;
            }
        }

        @media (min-width: 992px) {
            .vs-br-media {
                width: 100%;
                margin: 0 0 calc(var(--negative-margin) - 4rem);
            }
        }
    }
</style>
