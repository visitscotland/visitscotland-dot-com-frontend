<template>
    <VsBrSectionHeader
        :heading="module.title"
        :lede="module.introduction?.value"
    />

    <VsContainer>
        <VsRow>
            <VsCol>
                <VsContentSwiper
                    :next-button-label="configStore.getLabel('essentials.pagination', 'page.next')"
                    :previous-button-label="configStore.getLabel('essentials.pagination', 'page.previous')"
                    :slides-per-view-xs="1"
                    :slides-per-view-sm="2"
                    :slides-per-view-lg="3"
                    :slides-per-view-xl="4"
                >
                    <VsContentSwiperSlide
                        v-for="(link, index) in links"
                        :key="index"
                    >
                        <VsCard>
                            <template
                                #vs-card-header
                                v-if="link.image || link.category"
                            >
                                <VsBrMedia
                                    v-if="link.image"
                                    :image-string="link.image"
                                    image-classes="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                                />

                                <VsDetail
                                    v-if=link.category
                                    color="tertiary"
                                    class="mb-0"
                                >
                                    {{ link.category }}
                                </VsDetail>
                            </template>

                            <template #vs-card-body>
                                <VsHeading
                                    level="3"
                                    heading-style="heading-xs"
                                    class="mt-050"
                                >
                                    <VsLink
                                        :href="link.url"
                                        class="stretched-link"
                                        variant="secondary"
                                        :type="link.type"
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
    VsDetail,
} from '@visitscotland/component-library/components';

import VsBrSectionHeader from './VsBrSectionHeader.vue';

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
