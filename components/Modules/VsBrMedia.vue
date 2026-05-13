<template>
    <VsBrImageWithCaption
        v-if="videoId"
        :image="image"
        :image-string="imageString"
        :image-data-set="imageDataSet"
        :image-description="imageDescription"
        :variant="variant"
        :is-hero="isHero"
        :is-video="isVideo"
        :mobile-overlap="mobileOverlap"
        :alignment="alignment"
        :video-id="videoId"
        :video-title="videoTitle"
        :video-btn="videoBtn"
        :small-play-button="smallPlayButton"
        :use-lazy-loading="useLazyLoading"
        :no-alt-text="noAltText"
        :show-toggle="showToggle"
    >
        <template #video-title>
            <slot name="video-title" />
        </template>
    </VsBrImageWithCaption>
    <template v-else>
        <div
            class="vs-br-media"
            :class="{
                'vs-br-media--mobile-overlap': mobileOverlap,
                'vs-br-media--full-bleed': fullBleed,
            }"
        >
            <div class="vs-br-media__img-wrapper">
                <VsImg
                    :src="imageSrc"
                    :alt="altText"
                    class="vs-br-media__img"
                    :class="`${imageClasses} ${rounded ? 'rounded-2' : ''}`"
                />
            </div>
            <VsMediaCaption
                v-if="imageData"
                :right-align="alignment === 'right'"
            >
                <template #caption>
                    {{ descriptionString }}
                </template>
                <template #credit>
                    <template
                        v-if="imageData.source"
                    >
                        <VsSocialCreditLink
                            :credit="imageData.credit
                                ? imageData.credit
                                : configStore.getLabel('essentials.global', 'image.no.credit')"
                            :social-post-url="imageData.postUrl ? imageData.postUrl : ''"
                            :source="imageData.source"
                        />
                    </template>
                    <template
                        v-if="!imageData.source && imageData.credit"
                    >
                        &copy; {{ imageData.credit }}
                    </template>
                </template>
            </VsMediaCaption>
        </div>
    </template>
</template>

<script lang="ts" setup>
/* eslint no-undef: 0 */

import { toRefs, inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsImg,
    VsMediaCaption,
    VsSocialCreditLink,
} from '@visitscotland/component-library/components';

import VsBrImageWithCaption from '~/components/Modules/VsBrImageWithCaption.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

interface IProps {
    image?: any,
    imageString?: string,
    imageDataSet?: any,
    imageDescription?: string,
    imageClasses?: string,
    variant?: string,
    isHero?: boolean,
    isVideo?: boolean,
    mobileOverlap?: boolean,
    alignment?: string,
    videoId?: string,
    videoTitle?: string,
    videoBtn?: string,
    smallPlayButton?: boolean,
    useLazyLoading?: boolean,
    noAltText?: boolean,
    showToggle?: boolean,
    rounded?: boolean,
    fullBleed?: boolean,
};

const props = withDefaults(defineProps<IProps>(), {
    image: null,
    imageString: '',
    imageDataSet: null,
    imageDescription: '',
    imageClasses: '',
    variant: 'fullwidth',
    isHero: false,
    isVideo: false,
    mobileOverlap: false,
    alignment: 'left',
    smallPlayButton: false,
    useLazyLoading: true,
    noAltText: false,
    showToggle: true,
    videoId: '',
    videoTitle: '',
    videoBtn: '',
    rounded: false,
    fullBleed: false,
});

const {
    image,
    imageString,
    imageDataSet,
    imageDescription,
    imageClasses,
    variant,
    isHero,
    isVideo,
    mobileOverlap,
    alignment,
    videoId,
    videoTitle,
    videoBtn,
    smallPlayButton,
    useLazyLoading,
    noAltText,
    showToggle,
    fullBleed,
} = toRefs(props);

const page: Page | undefined = inject('page');
let imageValue: any;
let imageData: any;

let imageSrc = 'https://static.visitscotland.com/img/fallback-img.png';

let descriptionString = '';

let longitude = '';
let latitude = '';
let altText = '';

if (page) {
    if (image.value) {
        imageValue = page.getContent(image.value.$ref);
        imageData = imageValue.model.data;
        imageSrc = imageValue.getOriginal().getUrl();

        if (image.value.coordinates) {
            imageData.coordinates = image.value.coordinates;
        } else if (configStore.heroImage && configStore.heroImage.coordinates) {
            imageData.coordinates = configStore.heroImage.coordinates;
        }

        if (isHero.value) {
            imageData.description = configStore.heroImage.description;
        }

        if (imageData.coordinates) {
            if (imageData.coordinates.longitude) {
                longitude = imageData.coordinates.longitude.toString();
            }
            if (imageData.coordinates.latitude) {
                latitude = imageData.coordinates.latitude.toString();
            }
        }

        altText = (noAltText.value || !imageData)
            ? configStore.getLabel('essentials.global', 'default.alt-text')
            : imageData.altText;

        if (isVideo.value) {
            descriptionString = `${configStore.getLabel('essentials.global', 'image.title')}: ${imageData.description}`;
        } else if (imageDescription.value) {
            descriptionString = imageDescription.value;
        } else if (imageData) {
            descriptionString = imageData.description;
        }
    }

    if (imageString.value) {
        imageSrc = imageString.value;
    }

    if (imageDataSet.value) {
        imageData = imageDataSet.value;
        descriptionString = imageData.description;
    }
}
</script>

<style lang="scss">
    .vs-br-media__img-wrapper {
        position: relative;
        aspect-ratio: 3/2;

        @supports not (aspect-ratio: 3/2) {
            padding-bottom: 66.6%;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            align-self: flex-start;
            flex-shrink: 0; // IE11 fix, prevents image vertical stretching
        }
    }

    .vs-br-media--full-bleed {
        .vs-br-media__img-wrapper {
            width: 100%;
            height: 386px;
            object-fit: cover;

            @media (min-width: 576px) {
                height: 514px;
            }

            @media (min-width: 992px) {
                height: 648px;
            }
        }
    }

    @media (min-width: 992px) {
        .vs-megalink-single-image .vs-br-media {
            margin: 0 0 calc(var(--negative-margin) - 4rem);
        }
    }
</style>
