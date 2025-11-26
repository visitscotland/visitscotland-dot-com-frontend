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
                    :compact="module.layout === compact ? true : false"
                />
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */

import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsSpotlightSection,
    VsContainer,
    VsRow,
    VsCol,
} from '@visitscotland/component-library/components';

import formatLink from '~/composables/formatLink.ts';

const page: Page | undefined = inject('page');

const props = defineProps<{ module: Object }>();
const module: any = props.module;

let image: any = module.image.cmsImage
    ? page.getContent(module.image.cmsImage.$ref)
    : page.getContent(module.image.externalImage.$ref);

image = image?.getOriginal().getUrl();

const description = module.copy.value.replace(/<[^>]+>/g, '');

</script>

<style>
    /* TEMP VS-580: Add vertical whitespace between spotlight and adjacent grey sections.
   Remove when grey backgrounds are eliminated from navigation pages OR when layout layer manages inter-module spacing. */

    @supports selector(:has(.vs-spotlight-section)) {
        [class$="--grey"] + [id^="section-"]:has(.vs-spotlight-section),
        [id^="section-"]:has(.vs-spotlight-section) + [id^="section-"]:has(>[class$="--grey"]) {
            margin-block-start: var(--vs-space-500, 5rem);
        }
    }
</style>
