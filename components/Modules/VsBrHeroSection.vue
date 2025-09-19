<template>
    <VsHeroSection
        :heading="content.title"
        :lede="content.teaser"
        :img-src="imageSrc"
        :video-src="video.link"
        :video-btn-text="configStore.getLabel('video', 'video.play-btn')"
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
    video: any,
    image: any,
}>();

const {
    content,
    video,
    image,
} = toRefs(props);

let imageValue = null;
let imageSrc = '';

if (image.value) {
    imageValue = page.getContent(image.value.$ref);
    imageSrc = imageValue.getOriginal().getUrl();
}

</script>
