<template>
    <VsContainer
        class=" gap-150"
    >
        <VsRow>
            <VsCol
                cols="12"
                lg="8"
            >
                <VsHeading
                    style="color:#5B2487"
                    data-test="vs-hero-section__heading"
                    level="1"
                    heading-style="display-s"
                    id="main-heading"
                    no-margins
                >
                    <span v-html="content.title" />
                </VsHeading>
            </VsCol>
            <VsCol
                cols="12"
                lg="4"
                class="mt-150"
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
        </VsRow>
        <VsRow>
            <VsCol
                class="mt-300"
            >
                <VsImg
                    :src="imageSrc"
                    :alt="imageData.altText"
                    class="w-auto"
                />
                <VsMediaCaption
                    v-if="imageData.caption || imageData.credit"
                >
                    <template #caption>
                        {{ imageData.description }}
                    </template>
                    <template #credit>
                        {{ imageData.credit }}
                    </template>
                </VsMediaCaption>
            </VsCol>
        </VsRow>
    </VsContainer>
    <!-- <div
        class="vs-hero-section"
        data-test="vs-hero-section"
    >
        <div class="vs-hero-section__grid">
            <div
                class="vs-hero-section-image"
                data-test="vs-hero-section-image"
            >
                <VsImg
                    class="vs-hero-section-image__img"
                    :src="imageSrc"
                    :alt="imageData.altText"
                />
                <VsMediaCaption
                    v-if="imgCaption || imgCredit"
                    data-test="vs-hero-section-image__caption"
                >
                    <template #caption>
                        {{ imgCaption }}
                    </template>
                    <template #credit>
                        {{ imgCredit }}
                    </template>
                </VsMediaCaption>
            </div>
            <div class="vs-hero-section__text-container">
                <div class="vs-hero-section__text">
                    <VsHeading
                        class="vs-hero-section__heading"
                        data-test="vs-hero-section__heading"
                        level="1"
                        heading-style="display-s"
                        id="main-heading"
                    >
                        <span v-html="content.title" />
                    </VsHeading>

                    <VsBody
                        v-if="content.teaser"
                        class="vs-hero-section__lede"
                        data-test="vs-hero-section__lede"
                        variant="lead"
                    >
                        <p class="mb-0">
                            {{ content.teaser }}
                        </p>
                    </VsBody>
                </div>
            </div>
        </div>
    </div> -->
</template>

<script  setup lang="ts">
import { inject, toRefs } from 'vue';

import {
    VsHeading,
    VsBody,
    VsButton,
    VsImg,
    VsMediaCaption,
    VsContainer,
    VsRow,
    VsCol,
} from '@visitscotland/component-library/components';


const page: any = inject('page');

const props = defineProps<{
    content: any,
    image?: any,
}>();

const {
    content,
    image,
} = toRefs(props);

let imageValue = null;
let imageData = null;
let imageSrc = '';

if (image.value) {
    imageValue = page.getContent(image.value.$ref);
    imageData = imageValue.model.data;
    imageSrc = imageValue.getOriginal().getUrl();
}
</script>
