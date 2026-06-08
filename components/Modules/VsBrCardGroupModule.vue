<template>
    <div class="mt-500">
        <div class="mb-050">
            <VsBrSectionHeader
                :heading="module.title"
                :lede="module.introduction?.value"
            />
        </div>

        <VsContentSwiper
            class=""
            :next-button-label="configStore.getLabel('essentials.pagination', 'page.next')"
            :previous-button-label="configStore.getLabel('essentials.pagination', 'page.previous')"
            :slides-per-view-xs="1.7"
            :slides-per-view-sm="1.9"
            :slides-per-view-md="2"
            :slides-per-view-lg="2.6"
            :slides-per-view-xl="cardsPerRow"
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
    </div>
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
