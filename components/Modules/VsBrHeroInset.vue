<template>
    <VsContainer>
        <VsRow>
            <VsCol
                cols="12"
                sm="8"
                md="9"
                lg="7"
            >
                <VsHeading
                    level="1"
                    heading-style="display-s"
                    id="main-heading"
                    no-margins
                    class="text-brand"
                >
                    {{ content.title }}
                </VsHeading>
            </VsCol>
            <VsCol
                cols="12"
                sm="9"
                lg="4"
                class="mt-100 mt-lg-0 offset-lg-1"
            >
                <VsBody
                    v-if="content.teaser"
                    variant="lead"
                >
                    <p class="mb-0">
                        {{ content.teaser }}
                    </p>
                </VsBody>
            </VsCol>
            <VsCol
                v-if="$slots.button"
                cols="12"
                class="mt-200 d-flex flex-column flex-sm-row"
            >
                <slot name="button"/>
            </VsCol>
        </VsRow>
        <VsRow
            class="mt-300"
        >
            <VsCol>
                <VsImg
                    :src="imageSrc"
                    :alt="imageAltText"
                    fluid
                />
                <VsMediaCaption
                    v-if="imageCaption || imageCredit"
                    data-test="vs-hero-section-image__caption"
                >
                    <template #caption>
                        {{ imageCaption }}
                    </template>
                    <template #credit>
                        {{ imageCredit }}
                    </template>
                </VsMediaCaption>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
import { inject, toRefs } from 'vue';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsHeading,
    VsBody,
    VsImg,
    VsMediaCaption,
} from '@visitscotland/component-library/components';

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
    image,
} = toRefs(props);

let imageValue = null;
let imageData = null;
let imageSrc = 'https://static.visitscotland.com/img/fallback-img.png';
let imageCaption = '';
let imageCredit = '';
let imageAltText = '';

if (image.value) {
    imageValue = page.getContent(image.value.$ref);
    imageData = imageValue.model.data;
    imageSrc = imageValue.getOriginal().getUrl();

    // The raw image document's fields are always English. The heroImage component model holds
    // them localised for the current page, so prefer it on translated pages.
    imageCaption = configStore.heroImage?.description || imageData?.description;
    imageCredit = configStore.heroImage?.credit || imageData?.credit;
    imageAltText = configStore.heroImage?.altText || imageData?.altText;
}

</script>
