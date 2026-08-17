<template>
    <VsCol cols="6">
        <VsCard
            card-style="overlay"
            class="vs-map__controls-featured-place-card"
            @click="featuredPlaceClick(props.place)"
        >
            <template #vs-card-footer>
                <div class="px-125 pb-125">
                    <VsHeading
                        class="vs-map__controls-featured-place-card-heading"
                        heading-style="heading-xxxs"
                        level="2"
                        no-margins
                    >
                        <VsLink
                            class="stretched-link text-decoration-none"
                            href="#"
                            variant="on-dark"
                            @keyup.enter.prevent="featuredPlaceClick(props.place)"
                            @keyup.space.prevent="featuredPlaceClick(props.place)"
                        >
                            {{ props.place.properties.title }}
                        </VsLink>
                    </VsHeading>
                </div>
            </template>
            <template
                v-if="props.place.properties.image"
                #vs-card-image
            >
                <VsImg
                    class="vs-map__controls-featured-place-img 
						w-100 rounded-1 object-fit-cover img-zoom-on-hover"
                    :src="props.place.properties.image"
                    :use-lazy-loading="false"
                />
            </template>
        </VsCard>
    </VsCol>
</template>

<script setup>
import { inject } from 'vue';
import {
    VsCard,
    VsCol,
    VsHeading,
    VsImg,
    VsLink,
} from '@visitscotland/component-library/components';

import useMainMapStore from '~/stores/mainMap.ts';

const props = defineProps({
    place: {
        type: Object,
        default: () => {},
    },
});

const mainMapStore = useMainMapStore();
const onFeaturedLocationClick = inject('onFeaturedLocationClick');

function featuredPlaceClick(place) {
    mainMapStore.showDestinations = false;
    onFeaturedLocationClick(place);
}
</script>

<style lang="scss">
    .vs-map__controls-featured-place-card {
        height: 15rem;
        margin-bottom: 1rem;

        @media (min-width: 767.98px) {
            height: 11rem;
        }

        &-heading {
            position: relative;
            z-index: 2;
        }
    
        .vs-card__media {
            z-index: 1;

            & img {
                height: 15rem;

                @media (min-width: 767.98px) {
                    height: 11rem;
                }
            }
        }
    }
</style>
