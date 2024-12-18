<template>
    <VsArticle
        :title="module.title"
        :anchor-link="module.anchor ? formatLink(module.anchor) : ''"
    >
        <template
            #vs-article-img
            v-if="module.image"
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
} from '@visitscotland/component-library/components';

import formatLink from '~/composables/formatLink.ts';

import VsBrImageWithCaption from '~/components/Modules/VsBrImageWithCaption.vue';
import VsBrArticleSidebar from '~/components/Modules/VsBrArticleSidebar.vue';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

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
