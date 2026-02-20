<template>
    <div class="d-flex flex-column gap-500">
        <VsHeroSection
            heading="whatever"
            lede="whatever"
        />
        <VsContainer class="mt-075 mt-lg-200">
            <VsRow>
                <VsCol>
                    <VsCardGroup
                        variant="grid"
                        :cards-per-row="4"
                    >
                        <VsCard
                            class="vs-favourite-card"
                            v-for="(card, index) in [1,2,3,4,5,6,7,8]"
                            :key="'card-list-2-' + index"
                        >
                            <template #vs-card-header>
               
                                    <VsBrSaveContentButton
                                        content="REMOVE"
                                    />
                                    <VsImg
                                        src="https://images.unsplash.com/photo-1761839259488-2bdeeae794f5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
                                        class="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                                    />
              
                            </template>

                            <template #vs-card-body>
                                <div>
                                    <VsHeading
                                        level="3"
                                        heading-style="heading-xs"
                                    >
                                        <VsLink
                                            href="#"
                                            class="stretched-link"
                                            variant="secondary"
                                        >
                                            <!-- {{ card.title }} -->
                                              TITLE
                                        </VsLink>
                                    </VsHeading>

                                    <VsBody class="mb-150">
                                        <p class="truncate-2-lines">
                                            <!-- {{ card.description }} -->
                                              DESCRIPTION
                                        </p>
                                    </VsBody>
                                </div>
                            </template>
                        </VsCard>
                    </VsCardGroup>
                </VsCol>
            </VsRow>
        </VsContainer>
        <!-- <VsContainer>
            <VsCol cols="12">
                <VsCard v-for="(card, index) in [1,2,3,4,5,6,7]" :key="index">
            <template #vs-card-header>
                <VsImg
                    src="https://images.unsplash.com/photo-1761839259488-2bdeeae794f5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
                    class="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover"
                />
            </template>

            <template #vs-card-body>
                <VsHeading
                    level="3"
                    heading-style="heading-s"
                >
                    <VsLink
                        href="#"
                        class="stretched-link"
                        variant="secondary"
                    >
                        blah
                    </VsLink>
                </VsHeading>

                <VsBody>
                  more blah
                </VsBody>
            </template>
        </VsCard>
            </VsCol>
            <VsRow>
                <VsCol>
                    <span class="vs-section-header__divider mb-0" />
                </VsCol>
            </VsRow>
        </VsContainer> -->
    </div>
    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrSocialShare
            :no-js="true"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrHorizontalLinksModule
            v-if="otyml"
            :module="otyml"
            theme="light"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrNewsletterSignpost
            v-if="!documentData.hideNewsletter && configStore.newsletterSignpost"
            :data="configStore.newsletterSignpost"
        />
    </NuxtLazyHydrate>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';
import VsBrSaveContentButton from '~/components/Modules/VsBrSaveContentButton.vue';

import {
    VsCard,
    VsImg,
    VsHeading,
    VsLink,
    VsBody,
    VsContainer,
    VsRow,
    VsCol,
    VsHeroSection,
    VsCardGroup,
} from '@visitscotland/component-library/components';

const configStore = useConfigStore();

const props = defineProps<{ component: Component, page: Page }>();

const { page, component } = toRefs(props);

let documentData : any = {
};

if (page.value) {
    const pageDocument = page.value.getContent(configStore.pageDocument);

    documentData = pageDocument.getData();
}
</script>

<style>
    /* .vs-favourite-card {
        border: solid 2px blueviolet;
    } */
    .vs-favourite-card .vs-card__header{
        position: relative;
    }
    .vs-favourite-card .vs-save-content-button{
        position: absolute;
        top: 0;
        right: 0;
    }
</style>
