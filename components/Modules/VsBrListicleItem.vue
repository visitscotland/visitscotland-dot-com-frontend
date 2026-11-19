<template>
    <li
        class="vs-listicle-item border"
        data-test="vs-listicle-item"
    >
        <slot name="hippo-details" />

        <div
            class="vs-listicle-item__header"
            data-test="vs-listicle-item-heading"
        >
            <div class="count__bg">
                <span
                    class="count"
                    aria-hidden="true"
                >
                    {{ index }}
                </span>
            </div>

            <VsHeading
                level="2"
                heading-style="heading-s"
                class="vs-listicle-item__title mb-025"
                no-margins
            >
                {{ title }}
            </VsHeading>

            <VsDetail
                class="vs-listicle-item__detail"
                no-margins
            >
                {{ subTitle }}
            </VsDetail>
        </div>

        <slot name="image-slot" />

        <VsRow>
            <VsCol
                cols="12"
                lg="8"
                class="mt-050 mt-sm-300 mb-100 mt-lg-050 pe-lg-300"
            >
                <VsBody>
                    <slot name="description-slot" />
                </VsBody>
            </VsCol>

            <VsCol
                cols="12"
                lg="4"
                class="key-facilities-list mt-lg-400"
                :class="{ 'has-facilities': hasKeyFacilitiesSlot() }"
            >
                <slot name="facilities-slot" />
            </VsCol>
        </VsRow>
    </li>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

import {
    VsBody,
    VsCol,
    VsDetail,
    VsHeading,
    VsRow,
} from '@visitscotland/component-library/components';

withDefaults(defineProps<{
    index?: string,
    title?: string,
    subTitle?: string,
}>(), {
    index: '',
    title: '',
    subTitle: '',
});

const slots = useSlots();

const hasKeyFacilitiesSlot = () => Boolean(slots['facilities-slot']);
</script>

<style lang="scss">
.vs-listicle-item {
    margin-bottom: 3rem;

    @media (min-width: 576px) {
        margin-bottom: 5rem;
    }

    &__header {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 1rem;
        margin-bottom: 0.75rem;

        .count__bg {
            grid-column: 1;
            grid-row: span 2;
            position: relative;
            background: #a8308c;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 3rem;
            height: 3rem;

            @media (min-width: 768px) {
                width: 67px;
                height: 67px;
            }

            .count {
                color: #fff;
                font-family: evelethclean-regular, sans-serif, "Source Sans Pro", -apple-system,
                    BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
                    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                font-size: 1.5rem;
                line-height: 1;
                display: block;
                text-align: center;
                width: 100%;

                @media (min-width: 768px) {
                    font-size: 1.875rem;
                }

                &::after {
                    content: "";
                    border-bottom: 1px solid rgb(255, 255, 255);
                    display: block;
                    margin: 0.25rem 1rem 0;

                    @media (min-width: 768px) {
                        margin: 0.25rem 1.5rem 0;
                    }
                }
            }
        }

        .vs-listicle-item__title,
        .vs-listicle-item__detail {
            grid-column: 2;
        }
    }

    &.border {
        padding: 1rem;

        @media (min-width: 768px) {
            padding: 2rem;
        }

        @media (min-width: 1200px) {
            padding: 5rem;
        }

        @media (min-width: 1400px) {
            padding: 6rem;
        }
    }

    .key-facilities-list.has-facilities {
        border-top: 1px solid rgb(233, 233, 233);
        padding-top: 1rem;

        @media (min-width: 576px) {
            border-top: 0;
            padding-top: 0;
        }

        @media (min-width: 992px) {
            border-left: 1px solid rgb(233, 233, 233);
        }

        .vs-icon-list {
            @media (min-width: 576px) {
                border-top: 1px solid rgb(233, 233, 233);
                padding-top: 1rem;
            }

            @media (min-width: 992px) {
                border-top: 0;
                padding: 0 0.5rem;
            }

            @media (min-width: 1200px) {
                padding: 0 1rem;
            }

            @media (min-width: 1400px) {
                padding: 0 3rem;
            }

            .vs-icon-list__item {
                width: 80px;

                @media (min-width: 576px) {
                    width: 90px;
                }

                @media (min-width: 992px) {
                    width: 80px;
                }
            }
        }
    }
}
</style>
