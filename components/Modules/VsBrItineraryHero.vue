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
                v-if="configStore.featureFavouritesEnabled && configStore.allowFavourite && checkFlag('favourites')"
                cols="12"
                class="mt-200 d-flex flex-column flex-sm-row"
            >
                <VsBrSaveContentButton
                    :uuid="content.id"
                />
            </VsCol>
        </VsRow>
        <VsRow
            class="mt-300"
        >
            <VsImg
                :src="imageSrc"
                :alt="imageData.altText"
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

import VsBrSaveContentButton from '~/components/Modules/VsBrSaveContentButton.vue';

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

if (image.value) {
    imageValue = page.getContent(image.value.$ref);
    imageData = imageValue.model.data;
    imageSrc = imageValue.getOriginal().getUrl();
}

</script>
