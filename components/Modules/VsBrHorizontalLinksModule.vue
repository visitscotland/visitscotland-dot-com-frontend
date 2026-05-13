<template>
    <VsSectionHeader
        :heading="module.title"
        class="mb-250 mt-250"
    >
        <template
            #section-header-lede
            v-if="module.introduction && module.introduction.value"
        >
            <div v-html="module.introduction.value" />
        </template>
    </VsSectionHeader>

    <VsContainer>
        <VsRow>
            <VsCol>
                <VsContentSwiper
                    :next-button-label="configStore.getLabel('essentials.pagination', 'page.next')"
                    :previous-button-label="configStore.getLabel('essentials.pagination', 'page.previous')"
                    :slides-per-view-xs="1"
                    :slides-per-view-sm="2"
                    :slides-per-view-md="3"
                    :slides-per-view-lg="4"
                >
                    <VsContentSwiperSlide
                        v-for="(link, index) in links"
                        :key="index"
                    >
                        <VsCard>
                            <template
                                #vs-card-header
                                v-if="link.image"
                            >
                                <VsBrMedia
                                    :image-string="link.image"
                                    image-classes="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                                />
                            </template>

                            <template #vs-card-body>
                                <VsHeading
                                    level="3"
                                    heading-style="heading-xs"
                                >
                                    <VsLink
                                        :href="link.url"
                                        class="stretched-link"
                                        variant="secondary"
                                    >
                                        {{ link.label }}
                                    </VsLink>
                                </VsHeading>
                            </template>
                        </VsCard>
                    </VsContentSwiperSlide>
                </VsContentSwiper>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsContentSwiper,
    VsContentSwiperSlide,
    VsCard,
    VsHeading,
    VsLink,
    VsSectionHeader,
} from '@visitscotland/component-library/components';


import useConfigStore from '~/stores/configStore.ts';

import formatLink from '~/composables/formatLink.ts';

const configStore = useConfigStore();

const props = defineProps<{ module: object, theme: string }>();
const module: any = props.module;

const page: Page | undefined = inject('page');
const links: any[] = [];

if (page && module.links) {
    for (let x = 0; x < module.links.length; x++) {
        const nextLink = module.links[x];

        let image: any = '';

        if (nextLink.image.cmsImage) {
            image = page.getContent(nextLink.image.cmsImage.$ref);
            image = image.getOriginal().getUrl();
        } else if (nextLink.image.externalImage) {
            if (nextLink.image.externalImage.$ref) {
                image = page.getContent(nextLink.image.externalImage.$ref);
                image = image.getOriginal().getUrl();
            } else {
                image = nextLink.image.externalImage;
            }
        }

        links.push({
            image,
            type: nextLink.type.toLowerCase(),
            url: formatLink(nextLink.link),
            'error-message': '',
            label: nextLink.label,
            teaser: nextLink.teaser,
            categoryLabel: configStore.getLabel('otyml', 'otyml.category'),
            category: nextLink.category,
            transportName: nextLink.itineraryMainTransport
                ? nextLink.itineraryMainTransport.displayName
                : '',
            transport: nextLink.itineraryTransport
                ? getDMSIconName(nextLink.itineraryTransport)
                : '',
            itineraryDays: nextLink.itineraryDays,
            daysLabel: nextLink.itineraryDays && nextLink.itineraryDays > 1
                ? configStore.getLabel('megalinks', 'days')
                : configStore.getLabel('megalinks', 'day'),
        });
    }
}

</script>
