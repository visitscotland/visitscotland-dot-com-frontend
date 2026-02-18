<template>
    <VsContainer
        class="vs-daysection-wrapper"
    >
        <VsRow>
            <VsCol>
                <span class="vs-section-header__divider mb-0" />
            </VsCol>
        </VsRow>
        <div class="row gap-300 gap-lg-0">
            <VsCol
                cols="12"
                lg="4"
                class="mt-150"
            >
                <VsHeading
                    level="2"
                    heading-style="heading-l"
                    no-margins
                >
                    {{ dayLabel }} {{ dayNumber }} - {{ day.title }}
                </VsHeading>
            </VsCol>
            <VsCol
                cols="12"
                lg="8"
                class="d-flex flex-column gap-150"
            >
                <figure>
                    <VsImg
                        :src="imageSrc"
                        use-lazy-loading
                        class="rounded-2 w-100"
                        :alt="imageAlt"
                    />
                    <figcaption v-if="imageCredit || imageCaption">
                        <VsMediaCaption>
                            <template #caption>
                                {{ imageCaption }}
                            </template>
                            <template v-if="imageCredit" #credit>
                                {{ imageCredit }}
                            </template>
                        </VsMediaCaption>
                    </figcaption>
                </figure>
                <div>
                    <VsBody>
                        <VsBrRichText :input-content="day.introduction.value" />
                    </VsBody>
                </div>
                <div
                    class="d-flex flex-wrap gap-075"
                >
                    <VsButton
                        v-if="day.ctaLink.link && day.ctaLink.label"
                        :href="day.ctaLink.link"
                        variant="secondary"
                    >
                        {{ day.ctaLink.label }}
                    </VsButton>
                    <VsButton
                        v-if="day.mapLink.link"
                        :href="day.mapLink.link"
                        variant="subtle"
                        icon="fa-regular fa-map"
                    >
                        {{ day.mapLink.label }}
                    </VsButton>
                </div>
            </VsCol>
        </div>
    </VsContainer>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import useConfigStore from '~/stores/configStore.ts';

import {
    VsImg,
    VsHeading,
    VsButton,
    VsContainer,
    VsRow,
    VsCol,
    VsBody,
    VsMediaCaption,
} from '@visitscotland/component-library/components';
import VsBrRichText from './VsBrRichText.vue';

const configStore = useConfigStore();

const props = defineProps<{
    day: any,
    dayNumber: any,
}>();

const page: any = inject('page');
const day: any = props.day;
const dayNumber: any = props.dayNumber;
const imageValue = page.getContent(day.media[0].$ref);
const imageSrc = imageValue.getOriginal().getUrl();
const imageCaption = imageValue.description;
const imageAlt = imageValue.model.data.altText;
const imageCredit = imageValue.model.data.credit;
const dayLabel = configStore.getLabel('itinerary', 'day');

</script>

<style>
    .vs-daysection-wrapper h3 {
        margin-bottom: 1.25rem !important;
        margin-top: 0 !important;
    }

    .vs-daysection-wrapper figure {
        margin: 0;
    }
</style>
