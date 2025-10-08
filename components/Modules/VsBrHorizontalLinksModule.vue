<template>
    <VsModuleWrapper
        :theme="theme"
    >
        <template #vs-module-wrapper-heading>
            {{ module.title }}
        </template>

        <template
            #vs-module-wrapper-intro
            v-if="module.introduction && module.introduction.value"
        >
            <VsBrRichText :input-content="module.introduction.value" />
        </template>

        <VsCarousel
            :next-text="configStore.getLabel('essentials.pagination', 'page.next')"
            :prev-text="configStore.getLabel('essentials.pagination', 'page.previous')"
            :slides-xs="1"
            :slides-sm="2"
            :slides-md="3"
            :slides-lg="4"
        >
            <template #vs-carousel-navigate>
                {{ configStore.getLabel('essentials.pagination', 'page.navigate-to-page') }}
            </template>

            <template #vs-carousel-of>
                {{ configStore.getLabel('essentials.pagination', 'page.of') }}
            </template>

            <VsCarouselSlide
                v-for="(link, index) in links"
                :key="index"
                :slide-index="`${index}`"
                :link-url="link.url"
                :link-type="link.type"
                :img-src="link.image ? link.image : ''"
                :transport-name="link.transportName"
                :transport="link.transport"
                :days-label="link.daysLabel"
                :days="link.itineraryDays.toString()"
            >
                <template #vs-carousel-slide-heading>
                    {{ link.label }}
                </template>
            </VsCarouselSlide>
        </VsCarousel>
    </VsModuleWrapper>
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */
/* eslint-disable no-undef */

import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsModuleWrapper,
    VsCarousel,
    VsCarouselSlide,
} from '@visitscotland/component-library/components';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import useConfigStore from '~/stores/configStore.ts';

import formatLink from '~/composables/formatLink.ts';

const configStore = useConfigStore();

const props = defineProps<{ module: Object, theme: string }>();
const module: any = props.module;
const theme: string = props.theme;

const page: Page | undefined = inject('page');
const links: any[] = [];

if (page && module.links) {
    for (let x = 0; x < module.links.length; x++) {
        const nextLink = module.links[x];

        const image: any = nextLink.image.cmsImage
            ? page.getContent(nextLink.image.cmsImage.$ref)
            : page.getContent(nextLink.image.externalImage.$ref);

        links.push({
            image: image?.getOriginal().getUrl(),
            type: nextLink.type.toLowerCase(),
            url: formatLink(nextLink.link),
            'error-message': '',
            label: nextLink.label,
            teaser: nextLink.teaser,
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

<style>
    div.link-list-module {
        span {
            display: block;
        }
    }
</style>
