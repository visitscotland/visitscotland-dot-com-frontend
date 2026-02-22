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
                            v-for="(page, index) in savedContentArray"
                            :key="'card-list-2-' + index"
                        >
                            <template #vs-card-header>
                                <div class="vs-save-content-button">
                                    <VsButton
                                        icon-only
                                        icon="fa-solid fa-heart"
                                        :variant="variant"
                                        size="sm"
                                        @click="removePage(page.url)"
                                    />
                                </div>
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
                                            :href="page.url"
                                            class="stretched-link"
                                            variant="secondary"
                                        >
                                            {{ page.title }}
                                        </VsLink>
                                    </VsHeading>

                                    <VsBody class="mb-150">
                                        <p class="truncate-2-lines">
                                            {{ page.teaser }}
                                        </p>
                                    </VsBody>
                                </div>
                            </template>
                        </VsCard>
                    </VsCardGroup>
                </VsCol>
            </VsRow>
        </VsContainer>
        
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
import {
    toRefs, ref, onMounted,
} from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';

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
    VsButton,
} from '@visitscotland/component-library/components';

const configStore = useConfigStore();

const props = defineProps<{ component: Component, page: Page }>();

const { page } = toRefs(props);

let documentData : any = {
};

if (page.value) {
    const pageDocument = page.value.getContent(configStore.pageDocument);

    documentData = pageDocument.getData();
}

const savedContentArray = ref(null);
const savePageEnabled = ref(false);
const localStoragePropertyName = 'vs-saved-pages';

function refreshState() {
    const storageState = localStorage.getItem(localStoragePropertyName); // null || string
    if (storageState !== null && storageState.length > 0) {
        savePageEnabled.value = true;
        savedContentArray.value = JSON.parse(storageState);
    } else {
        savePageEnabled.value = false;
        savedContentArray.value = null;
    }
}

onMounted(() => {
    refreshState();
    window.addEventListener('storage', () => {
        refreshState();
    });
});

function removePage(uid) {
    const filteredArray = savedContentArray.value.filter((item) => item.url !== uid);
    savedContentArray.value = filteredArray;
    localStorage.setItem(localStoragePropertyName, JSON.stringify(filteredArray));
};

</script>

<style>
    .vs-favourite-card .vs-card__header{
        position: relative;
    }
    .vs-favourite-card .vs-save-content-button{
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 100;
    }
</style>
