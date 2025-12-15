<template>
    <VsContainer class="mt-075 mt-lg-200">
        <VsRow>
            <VsCol>
                <VsCardGroup scroll-snap="always">
                    <VsCard
                        card-style="overlay"
                        v-for="(card, index) in outLinks"
                        :key="`category-card-list-${index}`"
                    >
                        <template #vs-card-footer>
                            <div class="px-125 pb-125">
                                <VsHeading
                                    level="2"
                                    no-margins
                                    heading-style="heading-m"
                                >
                                    <VsLink
                                        :href="card.link"
                                        class="stretched-link text-decoration-none"
                                        variant="on-dark"
                                    >
                                        {{ card.label }}
                                    </VsLink>
                                </VsHeading>
                            </div>
                        </template>
                        <template
                            #vs-card-image
                            v-if="card.imageUrl"
                        >
                            <VsImg
                                :src="card.imageUrl"
                                class="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                            />
                        </template>
                    </VsCard>
                </VsCardGroup>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
import type { Page } from '@bloomreach/spa-sdk';

import { inject } from 'vue';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsImg,
    VsCardGroup,
    VsCard,
    VsLink,
    VsHeading,
} from '@visitscotland/component-library/components';

const page: Page | undefined = inject('page');

const props = defineProps<{
    links: any[],
}>();

const { links } = props;

const outLinks = [];

for (let x = 0; x < links.length; x++) {
    const nextLink = page?.getContent(links[x]);

    let image: any = '';

    if (nextLink.image.cmsImage) {
        image = page.getContent(nextLink.image.cmsImage.$ref);
        image = image.getOriginal().getUrl();
    }

    nextLink.imageUrl = image;

    outLinks.push(nextLink);
}

</script>
