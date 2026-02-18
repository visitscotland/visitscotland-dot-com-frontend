<template>
    <div
        class="vs-hero-section"
        data-test="vs-hero-section"
    >
        <!-- HERO SECTION IMAGE -->
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
                        <span :v-html="content.title" />
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
    </div>
</template>

<script  setup lang="ts">
import { inject, toRefs } from 'vue';

import {
    VsHeading,
    VsBody,
    VsButton,
    VsImg,
} from '@visitscotland/component-library/components';

// export default {
//     name: 'VsHeroSection',
//     status: 'prototype',
//     release: '0.0.1',
//     components: {
//         VsHeading,
//         VsBody,
//         VsHeroSectionImage,
//     },
//     props: {
//         /**
//         * The text for the heading
//         */
//         heading: {
//             type: String,
//             default: '',
//             required: true,
//         },
//         /**
//         * The text for the summary
//         */
//         lede: {
//             type: String,
//             default: '',
//             required: true,
//         },
//         /**
//         * The image src url to display
//         */
//         imgSrc: {
//             type: String,
//             default: '',
//         },
//         /**
//         * The alt text for the image if applicable
//         */
//         imgAlt: {
//             type: String,
//             default: '',
//         },
//         /**
//         * The caption text for the image
//         */
//         imgCaption: {
//             type: String,
//             default: '',
//         },
//         /**
//         * The author credit for the image
//         */
//         imgCredit: {
//             type: String,
//             default: '',
//         },
//     },
// };

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
    // imageCaption = imageValue.model.data.description;
    // imageAlt = imageValue.model.data.altText;
    // imageCredit = imageValue.model.data.credit;
}
</script>

<style lang="scss">
    .vs-hero-section {
        // background: $vs-color-background-primary;

        --grid-columns: 12px 1fr 1fr 12px;
        --content_maxwidth: 100%;
        --container-col: 2 / span 2;
        --container-row: 1;
        --image-col: 1 / -1;
        --image-row: 2;
        --inset-image-col: 2 / span 2;
        --divider-col: 2 / span 2;
        --divider-row: 2;

        // @include media-breakpoint-up(sm) {
        //     --content_maxwidth: #{$grid-container-width-sm};
        //     --grid-columns: 1fr min-content min-content 1fr;
        // }

        // @include media-breakpoint-up(md) {
        //     --content_maxwidth: #{$grid-container-width-md};
        // }

        // @include media-breakpoint-up(lg) {
        //     --content_maxwidth: #{$grid-container-width-lg};
        // }

        // @include media-breakpoint-up(xl) {
        //     --content_maxwidth: #{$grid-container-width-xl};
        // }

        // @include media-breakpoint-up(xxl) {
        //     --content_maxwidth: #{$grid-container-width-xxl};
        // }

        &__grid {
            display: grid;
            grid-template-columns: var(--grid-columns);
            width: 100%;
            position: relative;
        }

        &__image {
            grid-row: var(--image-row);
            grid-column: var(--image-col);

            &--inset {
                grid-column: var(--inset-image-col);
                padding: 0;
            }
        }

        &__text-container {
            position: relative;
            grid-row: var(--container-row);
            grid-column: var(--container-col);
            width: var(--content_maxwidth);
            // padding: $vs-spacer-150 0 $vs-spacer-250 0;

            // @include media-breakpoint-up(lg) {
            //     padding: $vs-spacer-300 0;
            // }
        }

        &__text {
            width: 100%;

            // @include media-breakpoint-up(sm) {
            //     width: 80%;
            // }

            // @include media-breakpoint-up(md) {
            //     width: 70%;
            // }

            // @include media-breakpoint-up(lg) {
            //     width: 100%;
            //     display: grid;
            //     grid-template-columns: 1.5fr 1fr;
            //     gap: 6rem;
            // }

            // @include media-breakpoint-up(xl) {
            //     grid-template-columns: 1.5fr 0.75fr;
            // }

            .vs-hero-section__heading.vs-heading {
                // color: $vs-color-text-brand;

                // @include media-breakpoint-up(lg) {
                //     margin: 0;
                // }
            }
        }

        &__video-wrapper {
            grid-row: 1;
            grid-column: 1 / -1;
            position: relative;
            line-height: 0; //removes any extra space in the container

            .vs-hero-section__video {
                width: 100%;
                height: 560px;
                object-fit: cover;

                // @include media-breakpoint-up(sm) {
                //     height: 648px;
                // }
                // @include media-breakpoint-up(lg) {
                //     height: 812px;
                // }
            }

            .vs-hero-section__video-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transition: opacity 1s;
                background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 40%, rgba(0, 0, 0, 0.40) 100%);
            }
        }

        .vs-hero-section__text-container--video {
            // color: $vs-color-text-inverse;

            .vs-hero-section-video-control {
                position: absolute;
                // bottom: $vs-spacer-500;
                // right: $vs-spacer-125;
            }

            .vs-hero-section__text {
                display: grid;
                grid-template-columns: 1fr;
                gap: 0;
                position: absolute;
                // bottom: $vs-spacer-500;
                width: 70%;

                // @include media-breakpoint-up(md) {
                //     width: 50%;
                // }

                .vs-hero-section__heading.vs-heading {
                    // color: $vs-color-text-inverse;
                    text-wrap: balance;

                    // @include media-breakpoint-up(lg) {
                    //     margin: 0 0 $vs-spacer-150 0;
                    // }
                }
            }
        }

        &__divider {
            height: 2px;
            margin: 0;
            // color: $vs-color-border-primary;
            grid-row: var(--divider-row);
            grid-column: var(--divider-col);
        }

        &--split {
            --split-image-row: 1;
            --split-image-col:  1 / -1;
            --split-container-row: 2;
            --split-container-col: 2 / -2;

            // @include media-breakpoint-up(lg) {
            //     --split-container-row: 1;
            //     --split-container-col: 2 / span 2;
            //     --split-image-row: 1;
            //     --split-image-col: 3 / span 2;
            // }

            .vs-hero-section__image {
                grid-row: var(--split-image-row);
                grid-column: var(--split-image-col);
                position: relative;
                overflow: hidden;
                z-index: 0;
                min-height: 14rem;
                max-width: 1000px;

                // @include media-breakpoint-up(lg) {
                //     grid-row: var(--split-image-row);
                //     grid-column: var(--split-image-col);
                // }
            }

            .vs-hero-section__text-container {
                grid-row: var(--split-container-row);
                grid-column: var(--split-container-col);
                padding-top: 0;
            }

            .vs-hero-section__text {
                height: 100%;
                width: 100%;
                padding: 0;

                // @include media-breakpoint-up(sm) {
                //     width: 75%;
                // }

                // @include media-breakpoint-up(lg) {
                //     display: grid;
                //     grid-template-columns: 1fr;
                //     gap: 0;
                //     place-content: center;
                //     width: 42%;
                // }

                // @include media-breakpoint-up(xxl) {
                //     width: 40%;
                // }

                .vs-hero-section__heading.vs-heading {
                    // @include media-breakpoint-up(lg) {
                    //     margin: 0 0 $vs-spacer-150 0;
                    // }
                }
            }
        }
    }
</style>
