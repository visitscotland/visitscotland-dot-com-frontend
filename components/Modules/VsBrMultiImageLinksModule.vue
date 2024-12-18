<template>
    <!-- TODO - itinerary, themes -->
    <VsMegalinks
        :title="module.title"
        variant="single-image"
        :theme="theme"
        :cookie-link-text="configStore.getLabel('essentials.global', 'cookie.link-message')"
        :no-cookies-message="configStore.getLabel('video', 'video.no-cookies')"
        :no-js-message="configStore.getLabel('video', 'video.no-js')"
    >
        <template
            v-if="module.introduction"
            #vs-megalinks-intro
        >
            <VsBrRichText :input-content="module.introduction.value" />
        </template>

        <VsCol
            cols="10"
            offset="1"
        >
            <VsContainer>
                <VsRow>
                    <VsCol
                        v-if="module.featuredLinks.length > 0"
                        cols="12"
                        md="6"
                        xl="12"
                    >
                        <VsMegalinkMultiImage
                            featured
                            :img-src="featuredLinks[0].image ? featuredLinks[0].image : ''"
                            :theme="theme"
                            :link-type="featuredLinks[0].type"
                            :link-url="featuredLinks[0].url"
                            :error-message="featuredLinks[0]['error-message']"
                            :video-id="featuredLinks[0].type === 'video'
                                ? extractYoutubeId(featuredLinks[0].url)
                                : ''
                            "
                            :video-btn-text="configStore.getLabel('video', 'video.play-btn')"
                        >
                            <template #vs-multi-image-heading>
                                {{ featuredLinks[0].label }}
                            </template>

                            <template
                                #vs-multi-image-content
                                v-if="module.teaserVisible"
                            >
                                <p>{{ featuredLinks[0].teaser }}</p>
                            </template>
                        </VsMegalinkMultiImage>

                        <VsBrVideoModal
                            v-if="featuredLinks[0].type === 'video'"
                            :is-video-modal="true"
                            :close-btn-text="configStore.getLabel('essentials.global', 'close')"
                            :modal-id="extractYoutubeId(featuredLinks[0].url)"
                            :video="featuredLinks[0]"
                        />
                    </VsCol>

                    <VsCol
                        v-for="(link, index) in links"
                        :key="index"
                        cols="12"
                        md="6"
                        :lg="getLgSize(index, links.length)"
                    >
                        <VsMegalinkMultiImage
                            :img-src="link.image ? link.image : ''"
                            :theme="theme"
                            :link-type="link.type"
                            :link-url="link.url"
                            :error-message="link['error-message']"
                            :video-id="link.type === 'video'
                                ? extractYoutubeId(link.url)
                                : ''
                            "
                            :video-btn-text="configStore.getLabel('video', 'video.play-btn')"
                        >
                            <template #vs-multi-image-heading>
                                {{ link.label }}
                            </template>

                            <template
                                #vs-multi-image-content
                                v-if="module.teaserVisible"
                            >
                                <p>{{ link.teaser }}</p>
                            </template>
                        </VsMegalinkMultiImage>

                        <VsBrVideoModal
                            v-if="link.type === 'video'"
                            :is-video-modal="true"
                            :close-btn-text="configStore.getLabel('essentials.global', 'close')"
                            :modal-id="extractYoutubeId(link.url)"
                            :video="link"
                        />
                    </VsCol>

                    <VsCol
                        v-if="module.featuredLinks.length > 1"
                        cols="12"
                        md="6"
                        xl="12"
                    >
                        <VsMegalinkMultiImage
                            featured
                            last-featured
                            :img-src="featuredLinks[1].image ? featuredLinks[1].image : ''"
                            :theme="theme"
                            :link-type="featuredLinks[1].type"
                            :link-url="featuredLinks[1].url"
                            :error-message="featuredLinks[1]['error-message']"
                            :video-id="featuredLinks[1].type === 'video'
                                ? extractYoutubeId(featuredLinks[1].url)
                                : ''
                            "
                            :video-btn-text="configStore.getLabel('video', 'video.play-btn')"
                        >
                            <template #vs-multi-image-heading>
                                {{ featuredLinks[1].label }}
                            </template>

                            <template
                                #vs-multi-image-content
                                v-if="module.teaserVisible"
                            >
                                <p>{{ featuredLinks[1].teaser }}</p>
                            </template>
                        </VsMegalinkMultiImage>

                        <VsBrVideoModal
                            v-if="featuredLinks[1].type === 'video'"
                            :is-video-modal="true"
                            :close-btn-text="configStore.getLabel('essentials.global', 'close')"
                            :modal-id="extractYoutubeId(featuredLinks[1].url)"
                            :video="featuredLinks[1]"
                        />
                    </VsCol>
                </VsRow>
            </VsContainer>
        </VsCol>
    </VsMegalinks>
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */

import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsMegalinks,
    VsMegalinkMultiImage,
    VsCol,
    VsContainer,
    VsRow,
} from '@visitscotland/component-library/components';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import useConfigStore from '~/stores/configStore.ts';

import formatLink from '~/composables/formatLink.ts';

const configStore = useConfigStore();

const page: Page | undefined = inject('page');

const props = defineProps<{ module: Object, theme: string }>();
const module: any = props.module;
const theme: string = props.theme;

const links: any[] = [];
const featuredLinks: any[] = [];

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
            'error-message': configStore.getLabel('essentials.global', 'third-party-error'),
            label: nextLink.label,
            teaser: nextLink.teaser,
        });
    }
}

if (page && module.featuredLinks) {
    for (let x = 0; x < module.featuredLinks.length; x++) {
        const nextLink = module.featuredLinks[x];

        const image: any = nextLink.image.cmsImage
            ? page.getContent(nextLink.image.cmsImage.$ref)
            : page.getContent(nextLink.image.externalImage.$ref);

        featuredLinks.push({
            image: image?.getOriginal().getUrl(),
            type: nextLink.type.toLowerCase(),
            url: formatLink(nextLink.link),
            'error-message': configStore.getLabel('essentials.global', 'third-party-error'),
            label: nextLink.label,
            teaser: nextLink.teaser,
        });
    }
}

const getLgSize = (index: number, linksLength: number) => {
    if (linksLength === 2 || linksLength === 4) {
        return '6';
    }

    if (linksLength === 3 || linksLength === 6) {
        return '4';
    }

    if (linksLength === 5 && index < 3) {
        return '4';
    }

    return '6';
};

</script>

<style>
    div.multi-image-links-module {
        span {
            display: block;
        }

        .image-link {
            padding: 1rem;
        }
    }
</style>
