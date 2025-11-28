<template>
    <!-- {{ imageValue }} -->
    <!-- {{ content }} -->
    <VsHeroSection
        :heading="content.title"
        :lede="content.teaser"
        :img-src="imageSrc"
        :video-src="video ? video.link : null"
        :video-btn-text="configStore.getLabel('video', 'video.play-btn')"
        :img-caption="imageValue.caption"
        :img-credit="imageValue.credit"
        :inset
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
    inset: boolean
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
