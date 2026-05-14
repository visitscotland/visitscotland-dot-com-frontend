<template>
    <VsContainer class="mt-075 mt-lg-200">
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
                        v-for="(card, index) in outLinks"
                        :key="`category-card-list-${index}`"
                    >
                        <VsCard
                            card-style="overlay"
                        >
                            <template #vs-card-footer>
                                <div class="px-125 pb-125">
                                    <VsHeading
                                        level="2"
                                        no-margins
                                        heading-style="heading-m"
                                    >
                                        <VsLink
                                            :href="formatLink(card.link)"
                                            class="stretched-link text-decoration-none"
                                            variant="on-dark"
                                            :no-visited-styles="true"
                                        >
                                            {{ card.label }}
                                        </VsLink>
                                    </VsHeading>
                                </div>
                            </template>
                            <template
                                #vs-card-image
                                v-if="card.imageUrl"
                            >
                                <VsImg
                                    :src="card.imageUrl"
                                    class="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                                />
                            </template>
                        </VsCard>
                    </VsContentSwiperSlide>
                </VsContentSwiper>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
import type { Page } from '@bloomreach/spa-sdk';

import { inject } from 'vue';

import formatLink from '~/composables/formatLink.ts';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsImg,
    VsCard,
    VsLink,
    VsHeading,
    VsContentSwiper,
    VsContentSwiperSlide,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const page: Page | undefined = inject('page');

const props = defineProps<{
    links: any[],
}>();

const { links } = props;

const outLinks = [];

for (let x = 0; x < links.length; x++) {
    const nextLink = links[x];

    let image: any = '';

    if (nextLink.image) {
        image = page?.getContent(nextLink.image.cmsImage.$ref);
        image = image.getOriginal().getUrl();
    }

    nextLink.imageUrl = image;

    outLinks.push(nextLink);
}

</script>
