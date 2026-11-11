<template>
    <VsHeroSection
        :heading="content.title"
        :lede="content.teaser"
        :img-src="imageSrc"
        :video-src="video ? video.link : null"
        :img-caption="imageCaption"
        :img-credit="imageCredit"
        :play-button-label="configStore.getLabel('ambient-video', 'play-button.text')"
        :pause-button-label="configStore.getLabel('ambient-video', 'pause-button.text')"
        :inset
        :split
    >
        <template
            #hero-section-article-details
            v-if="blogAuthor"
        >
            <VsArticleDetails
                :article-author="blogAuthor"
                :article-publish-date="blogDate"
                :article-read-time="blogTime"
            />
        </template>
    </VsHeroSection>

    <VsContainer
        v-if="
            favourites.featureEnabled &&
                favourites.pageEnabled &&
                favouritesButton
        "
        class="mt-150"
    >
        <VsRow>
            <VsCol>
                <VsBrFavouriteButton
                    :uuid="content.id"
                    :gtm-data="{ title: content.title, }"
                />
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
import { inject, toRefs } from 'vue';

import {
    VsHeroSection, VsContainer, VsRow, VsCol, VsArticleDetails, 
} from '@visitscotland/component-library/components';

import VsBrFavouriteButton from '~/components/Modules/VsBrFavouriteButton.vue';

import useConfigStore from '~/stores/configStore.ts';
import { useFavourites } from '#imports';

const configStore = useConfigStore();
const favourites = useFavourites();

const page: any = inject('page');

const props = defineProps<{
    content: any,
    video?: any,
    image?: any,
    inset?: boolean,
    split?: boolean,
    blog?: any,
    favouritesButton?: boolean,
}>();

const {
    content,
    video,
    image,
    inset,
    split,
    blog,
    favouritesButton,
} = toRefs(props);

let imageValue = null;
let imageData = null;
let imageSrc = '';
let imageCaption = '';
let imageCredit = '';

if (image.value) {
    imageValue = page.getContent(image.value.$ref);
    imageData = imageValue.model.data;
    imageSrc = imageValue.getOriginal().getUrl();

    // The raw image document's description is always English. The heroImage component model
    // holds the caption localised for the current page, so prefer it on translated pages.
    imageCaption = configStore.heroImage?.description || imageData?.description;
    imageCredit = configStore.heroImage?.credit || imageData?.credit;
}

let blogAuthor = '';
let blogTime = '';
let blogDate = '';

if (blog.value) {
    blogAuthor = page.getContent(blog.value.author);

    if (blogAuthor && blogAuthor.model && blogAuthor.model.data) {
        blogAuthor = blogAuthor.model.data.displayName;
    }

    // TODO - localised labels for minute/s

    if (blog.value.readingTime > 1) {
        blogTime = `${blog.value.readingTime} minutes`;
    } else {
        blogTime = `${blog.value.readingTime} minute`;
    }

    blogDate = new Date(blog.value.publishDate).toLocaleString(
        'en-US',
        {
            year: 'numeric',
            day: 'numeric',
            month: 'long',
        },
    );
}

</script>
