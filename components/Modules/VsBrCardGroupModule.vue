<template>
    <VsContainer>
        <VsRow>
            <VsCol>
                <template
                    v-if="module.introduction"
                    #vs-megalinks-intro
                >
                    <VsBrRichText :input-content="module.introduction.value" />
                </template>

                <VsBrSectionHeader
                    :heading="module.title"
                    :lede="module.introduction?.value"
                />

                <VsContainer>
                    <VsRow>
                        <VsCol>
                            <VsCardGroup
                                scroll-snap
                                :cards-per-row="cardsPerRow"
                            >
                                <VsCard
                                    v-for="(link, index) in links"
                                    :key="index"
                                >
                                    <template #vs-card-header>
                                        <VsImg
                                            :src="link.image"
                                            class="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                                        />
                                    </template>
                                    <template #vs-card-body>
                                        <VsHeading
                                            level="3"
                                            heading-style="heading-xs"
                                        >
                                            <VsLink
                                                :href="link.link"
                                                class="stretched-link"
                                                variant="secondary"
                                            >
                                                {{ link.label }}
                                            </VsLink>
                                        </VsHeading>
                                        <VsBody class="mb-150">
                                            <p class="truncate-2-lines">
                                                {{ link.teaser }}
                                            </p>
                                        </VsBody>
                                    </template>
                                </VsCard>
                            </VsCardGroup>
                        </VsCol>
                    </VsRow>
                </VsContainer>

                <template #vs-megalinks-button v-if="module.cta">
                    {{ module.cta.label }}
                </template>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */

import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsCardGroup,
    VsCard,
    VsImg,
    VsHeading,
    VsLink,
    VsBody,
    VsContainer,
    VsRow,
    VsCol,
} from '@visitscotland/component-library/components';

import formatLink from '~/composables/formatLink.ts';

import VsBrSectionHeader from './VsBrSectionHeader.vue';

const page: Page | undefined = inject('page');

const props = defineProps<{ module: Object, theme: string }>();
const module: any = props.module;

const cardsPerRow = module.layout === 'Grid 4' ? 4 : 3;

const links: any[] = [];

if (page && module.links) {
    for (let x = 0; x < module.links.length; x++) {
        const nextLink = module.links[x];

        const image: any = nextLink.image.cmsImage
            ? page.getContent(nextLink.image.cmsImage.$ref)
            : page.getContent(nextLink.image.externalImage.$ref);

        links.push({
            image: image?.getOriginal().getUrl(),
            link: formatLink(nextLink.link),
            label: nextLink.label,
            teaser: nextLink.teaser,
        });
    }
}

</script>
