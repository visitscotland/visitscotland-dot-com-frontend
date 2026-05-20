<template>
    <VsImg
        :src="imageSrc"
        :alt="imageData?.altText"
    />
    <VsMediaCaption
        v-if="imageData?.description || imageData?.credit"
        data-test="vs-hero-section-image__caption"
    >
        <template #caption>
            {{ imageData?.description }}
        </template>
        <template #credit>
            {{ imageData?.credit }}
        </template>
    </VsMediaCaption>
</template>

<script lang="ts" setup>
import { inject, toRefs } from 'vue';

import {
    VsImg,
    VsMediaCaption,
} from '@visitscotland/component-library/components';

const page: any = inject('page');

const props = defineProps<{
    image?: any,
}>();

const { image } = toRefs(props);

let imageValue = null;
let imageData = null;
let imageSrc = 'https://static.visitscotland.com/img/fallback-img.png';

if (image.value) {
    imageValue = page.getContent(image.value.$ref);
    imageData = imageValue.model.data;
    imageSrc = imageValue.getOriginal().getUrl();
}
</script>
