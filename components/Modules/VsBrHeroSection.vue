<template>
    <VsHeroSection
        :heading="content.title"
        :lede="content.teaser"
        :img-src="imageSrc"
        :video-src="video ? video.link : null"
        :video-btn-text="configStore.getLabel('video', 'video.play-btn')"
        :img-caption="imageData?.description"
        :img-credit="imageData?.credit"
    />
</template>

<script lang="ts" setup>
import { inject, toRefs } from 'vue';

import { VsHeroSection } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const page: any = inject('page');

const props = defineProps<{
    content: any,
    video?: any,
    image?: any,
}>();

const {
    content,
    video,
    image,
} = toRefs(props);

let imageValue = null;
let imageData = null;
let imageSrc = '';

if (image.value) {
    imageValue = page.getContent(image.value.$ref);
    imageData = imageValue.model.data;
    imageSrc = imageValue.getOriginal().getUrl();
    // imageCaption = imageValue.model.data.description;
    // imageAlt = imageValue.model.data.altText;
    // imageCredit = imageValue.model.data.credit;
}

</script>
