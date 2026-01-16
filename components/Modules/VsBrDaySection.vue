<template>
    <VsContainer>
        <div class="row gap-175 gap-lg-0">
            <VsCol
                cols="12"
                lg="4"
            >
                <VsHeading
                    level="2"
                    heading-style="heading-l"
                    no-margins
                >
                    <!-- Presumably "Day" here will need to come from the label so it will be translated. Capitalise with CSS -->
                    Day {{ dayNumber }} - {{ day.title }}
                </VsHeading>
            </VsCol>
            <VsCol
                cols="12"
                lg="8"
                class="d-flex flex-column gap-150"
            >
                <figure>
                    <VsImg
                        src="http://localhost:8080/site/binaries/content/gallery/visitscotland/static/placeholder-logo.jpg?size=lg"
                        use-lazy-loading
                        class="rounded-2 w-100"
                        alt="day.image.altText"
                    />
                    <!-- <figcaption>
                        <VsMediaCaption>
                            <template #caption>
                                Caption placeholder
                            </template>
                            <template #credit>
                                Credit placeholder
                            </template>
                        </VsMediaCaption>
                    </figcaption> -->
                </figure>
                <div>
                    <!-- All VsBody does is add my I don't want  -->
                    <VsBrRichText :input-content="day.introduction.value" />
                </div>
                <div
                    class="d-flex flex-wrap gap-125"
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
                        <!-- "Explore on Google Maps"
                        default value set in back end -->
                        {{ day.mapLink.label }}
                    </VsButton>
                </div>
            </VsCol>
        </div>
    </VsContainer>
</template>

<script setup lang="ts">
import {
    VsImg,
    VsHeading,
    VsButton,
    VsContainer,
    VsCol,
    VsRow,
    VsBody,
    // VsMediaCaption,
} from '@visitscotland/component-library/components';
import VsBrRichText from './VsBrRichText.vue';

const props = defineProps<{
    day: any,
    dayNumber: any,
}>();
const day: any = props.day;
const dayNumber: any = props.dayNumber;

</script>
