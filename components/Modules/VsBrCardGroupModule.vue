<template>
    <VsContainer class="mt-500">
        <VsRow>
            <VsCol>
                <template
                    v-if="module.introduction"
                    #vs-megalinks-intro
                >
                    <VsBrRichText :input-content="module.introduction.value" />
                </template>

                <div class="mb-250">
                    <VsBrSectionHeader
                        :heading="module.title"
                        :lede="module.introduction?.value"
                    />
                </div>

                <VsContainer>
                    <VsRow>
                        <VsCol>
                            <VsContentSwiper
                                :next-button-label="configStore.getLabel('essentials.pagination', 'page.next')"
                                :previous-button-label="configStore.getLabel('essentials.pagination', 'page.previous')"
                                :slides-per-view-xs="1.2"
                                :slides-per-view-sm="2.2"
                                :slides-per-view-md="2.7"
                                :slides-per-view-lg="4"
                            >
                                <VsContentSwiperSlide
                                    v-for="(link, index) in links"
                                    :key="index"
                                >
                                    <VsCard>
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
                                                    :no-visited-styles="true"
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
                                </VsContentSwiperSlide>
                            </VsContentSwiper>
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
 

import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsCard,
    VsImg,
    VsHeading,
    VsLink,
    VsBody,
    VsContainer,
    VsRow,
    VsCol,
    VsContentSwiper,
    VsContentSwiperSlide,
} from '@visitscotland/component-library/components';

import formatLink from '~/composables/formatLink.ts';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

import VsBrSectionHeader from './VsBrSectionHeader.vue';

const page: Page | undefined = inject('page');

const props = defineProps<{ module: object, theme: string }>();
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
