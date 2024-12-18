<template>
    <VsMegaNavFeaturedItem
        :link="link.link"
        :alt="link.image.altText"
        :img-url="imageUrl"
    >
        <template #vs-featured-item-header>
            {{ link.label }}
        </template>

        <template #vs-featured-item-content>
            {{ link.teaser }}
        </template>

        <template #vs-featured-item-link>
            {{ link.cta }}
        </template>
    </VsMegaNavFeaturedItem>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import { VsMegaNavFeaturedItem } from '@visitscotland/component-library/components';

const page: Page | undefined = inject('page');

const props = defineProps<{ link: Object }>();
const link: any = props.link;

let imageUrl = '';

if (page) {
    const imageContent = page.getContent(link.image.cmsImage.$ref);

    if (imageContent) {
        imageUrl = imageContent.getOriginal().getUrl();
    }
}
</script>
