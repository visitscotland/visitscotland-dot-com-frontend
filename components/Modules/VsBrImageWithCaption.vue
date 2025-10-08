<template>
    <VsImageWithCaption
        :variant="variant"
        :is-hero-image="isHero"
        :mobile-overlap="mobileOverlap"
        :is-video="isVideo"
        :show-toggle="showToggle"
        :error-message="configStore.getLabel('essentials.global', 'third-party-error')"
        :cookie-link-text="configStore.getLabel('essentials.global', 'cookie.link-message')"
        :no-cookies-message="configStore.getLabel('video', 'video.no-cookies')"
        :no-js-message="configStore.getLabel('video', 'video.no-js')"
        :video-id="videoId"
        :small-play-button="smallPlayButton"
        :play-button-text="videoBtn ? videoBtn : configStore.getLabel('video', 'video.play-btn')"
        :image-src="imageSrc"
        :alt-text="(noAltText || !imageData)
            ? configStore.getLabel('essentials.global', 'default.alt-text')
            : imageData.altText"
        :use-lazy-loading="useLazyLoading"
        :toggle-button-text="configStore.getLabel('essentials.global', 'image.toggle.text')"
    >
        <template #video-title>
            {{ videoTitle }}
        </template>

        <template
            #img-caption
            v-if="imageData"
        >
            <VsCaption
                :variant="variant"
                :text-align="alignment"
                :latitude="latitude"
                :longitude="longitude"
            >
                <template
                    #caption
                >
                    {{ descriptionString }}
                </template>

                <template
                    v-if="imageData.source"
                    #toggle-icon
                >
                    <VsIcon
                        :icon="`fa-kit fa-${imageData.source}-filled`"
                        size="md"
                    />
                </template>

                <template
                    #credit
                >
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

                <!-- TODO - image source -->
            </VsCaption>
        </template>
    </VsImageWithCaption>
</template>

<script lang="ts" setup>
/* eslint no-undef: 0 */

import { toRefs, inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsImageWithCaption,
    VsCaption,
    VsSocialCreditLink,
    VsIcon,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

interface IProps {
    image?: any,
    imageString?: string,
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
};

const props = withDefaults(defineProps<IProps>(), {
    image: null,
    imageString: '',
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
});

const {
    image,
    imageString,
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
} = toRefs(props);

const page: Page | undefined = inject('page');
let imageValue: any;
let imageData: any;

let imageSrc = '';

let descriptionString = '';

let longitude = '';
let latitude = '';

if (page) {
    if (image.value) {
        imageValue = page.getContent(image.value.$ref);
        imageData = imageValue.model.data;
        imageSrc = imageValue.getOriginal().getUrl();

        if (image.value.coordinates) {
            imageData.coordinates = image.value.coordinates;
            if (imageData.coordinates.longitude) {
                longitude = imageData.coordinates.longitude.toString();
            }
            if (imageData.coordinates.latitude) {
                latitude = imageData.coordinates.latitude.toString();
            }
        }

        if (isVideo.value) {
            descriptionString = `${configStore.getLabel('essentials.global', 'image.title')}: ${imageData.description}`;
        } else if (imageData) {
            descriptionString = imageData.description;
        }
    }

    if (imageString.value) {
        imageSrc = imageString.value;
    }
}

</script>
