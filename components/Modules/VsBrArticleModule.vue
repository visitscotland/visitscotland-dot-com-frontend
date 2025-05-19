<template>
    <VsArticle
        :title="module.title"
        :anchor-link="module.anchor ? formatLink(module.anchor) : ''"
    >
        <template
            #vs-article-img
            v-if="module.video"
        >
            <VsVideo
                :video-title="module.video.label"
                :video-id="module.video.youtubeId"
                :locale="configStore.locale"
                :single-minute-descriptor="configStore.getLabel('video', 'video.minute-text')"
                :plural-minute-descriptor="configStore.getLabel('video', 'video.minutes-text')"
                :no-cookies-message="configStore.getLabel('video', 'video.no-cookies')"
                :no-js-message="configStore.getLabel('video', 'video.no-js')"
                :cookie-btn-text="configStore.getLabel('essentials.global', 'cookie.link-message')"
                :error-message="configStore.getLabel('essentials.global', 'third-party-error')"
            />
            <VsVideoCaption
                :video-id="module.video.youtubeId"
            >
                <template #video-title>
                    {{ module.video.label ?? configStore.getLabel('video', 'video.play-btn') }}
                </template>?
            </VsVideoCaption>
        </template>
        <template
            #vs-article-img
            v-else-if="module.image"
        >
            <VsBrImageWithCaption
                :image="module.image.cmsImage"
            />
        </template>

        <template
            #vs-article-intro
            v-if="module.introduction"
        >
            <VsBrRichText :input-content="module.introduction.value" />
        </template>

        <VsArticleSection
            v-for="(section, index) in articleSections"
            :key="index"
            :sidebar-align="section.alignment"
        >
            <template
                #article-sidebar
                v-if="section.video || section.quote || section.image"
            >
                <VsBrArticleSidebar
                    :section="section"
                    :alignment="section.alignment"
                />
            </template>

            <template
                v-if="section.copy"
            >
                <VsBrRichText :input-content="section.copy.value" />
            </template>
        </VsArticleSection>
    </VsArticle>
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */

import {
    VsArticle,
    VsArticleSection,
    VsVideoCaption,
    VsVideo,
} from '@visitscotland/component-library/components';

import formatLink from '~/composables/formatLink.ts';

import VsBrImageWithCaption from '~/components/Modules/VsBrImageWithCaption.vue';
import VsBrArticleSidebar from '~/components/Modules/VsBrArticleSidebar.vue';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{ module: Object }>();
const module: any = props.module;

const articleSections: any[] = [];

let sidebarCount = -1;

for (let x = 0; x < module.sections.length; x++) {
    const nextSection = module.sections[x];
    let alignment = '';

    if (nextSection.quote || nextSection.image || nextSection.video) {
        sidebarCount += 1;

        if (sidebarCount % 2 !== 0) {
            alignment = 'left';
        } else {
            alignment = 'right';
        }
    } else {
        alignment = 'right';
    }

    nextSection.alignment = alignment;

    articleSections.push(nextSection);
}

</script>
