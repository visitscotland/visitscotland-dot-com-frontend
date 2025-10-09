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

const image: any = module.image.cmsImage
    ? page.getContent(module.image.cmsImage.$ref)
    : page.getContent(module.image.externalImage.$ref);

const description = module.copy.content.replace(/<[^>]+>/g, '');

</script>
