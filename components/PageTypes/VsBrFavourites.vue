<template>
    <div class="d-flex flex-column gap-500">
        <VsBrHeroSection
            :content="documentData"
        />
        <VsContainer class="mt-075 mt-lg-200">
            <VsRow>
                <VsCol>
                    <!-- <p>

                     displayData: {{ displayData }}
                    </p> -->
                    <div v-if="savedContentArray.length < 1">
                        <div class="d-flex justify-content-center">
                            <div class="d-flex flex-column gap-200 align-items-center" style="max-width: 478px">
                                <svg width="202" height="189" viewBox="0 0 202 189" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M88.9088 183.857L87.9244 182.862L18.9394 112.54C6.85125 100.222 0 82.9334 0 64.8235V63.3972C0 32.9689 19.6875 6.86292 46.935 1.15763C62.4488 -2.12724 78.3169 1.80595 90.9563 11.5741C94.5 14.3403 97.8075 17.5387 100.8 21.2126C102.454 19.1379 104.226 17.2362 106.116 15.4641C107.573 14.081 109.069 12.7843 110.644 11.5741C123.283 1.80595 139.151 -2.12724 154.665 1.11441C181.913 6.8197 201.6 32.9689 201.6 63.3972V64.8235C201.6 82.9334 194.749 100.222 182.661 112.54L113.676 182.862L112.691 183.857C109.463 187.141 105.21 189 100.8 189C96.39 189 92.1375 187.185 88.9088 183.857ZM94.1456 44.1634C93.9881 44.0337 93.87 43.8609 93.7519 43.688L86.7431 35.0436L86.7038 35.0004C77.6081 23.8059 63.8663 18.7057 50.4788 21.5151C32.13 25.3619 18.9 42.91 18.9 63.3972V64.8235C18.9 77.1417 23.5856 88.9413 31.815 97.3263L100.8 167.648L169.785 97.3263C178.014 88.9413 182.7 77.1417 182.7 64.8235V63.3972C182.7 42.9532 169.47 25.3619 151.161 21.5151C137.773 18.7057 123.992 23.8491 114.936 35.0004C114.936 35.0004 114.936 35.0004 114.896 35.0436C114.857 35.0868 114.896 35.0436 114.857 35.0868L107.848 43.7312C107.73 43.9041 107.573 44.0338 107.454 44.2066C105.683 46.1516 103.281 47.2322 100.8 47.2322C98.3194 47.2322 95.9175 46.1516 94.1456 44.2066V44.1634Z" fill="#E5E5F0" />
                                </svg>
                                <p class="vs-heading vs-heading--display-s text-center">
                                    NO ITEMS SAVED YET!
                                </p>
                                <p class="text-center">
                                    Click the heart icon placed around the site to favourite items! They will be saved here until you remove them.
                                </p>
                            </div>
                        </div>
                    </div>
                    <VsCardGroup
                        variant="grid"
                        :cards-per-row="4"
                        class="row-gap-lg-500"
                    >
                        <TransitionGroup name="fade">
                            <VsCard
                                class="vs-favourite-card"
                                v-for="(data) in displayData.cards"
                                :key="data.uuid"
                            >
                                <template #vs-card-header>
                                    <div class="vs-remove-content-button">
                                        <VsButton
                                            icon-only
                                            icon="fa-solid fa-heart"
                                            :variant="variant"
                                            size="sm"
                                            @click="removePage(data.uuid)"
                                        />
                                    </div>
                                    <VsImg
                                        :src="data.image"
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
                                                :href="data.url"
                                                class="stretched-link"
                                                variant="secondary"
                                            >
                                                {{ data.title }}
                                            </VsLink>
                                        </VsHeading>

                                        <VsBody class="mb-150">
                                            <p class="truncate-2-lines">
                                                {{ data.teaser }}
                                            </p>
                                        </VsBody>
                                    </div>
                                </template>
                            </VsCard>
                        </TransitionGroup>
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
import VsBrHeroSection from '~/components/Modules/VsBrHeroSection.vue';
import {
    VsCard,
    VsImg,
    VsHeading,
    VsLink,
    VsBody,
    VsContainer,
    VsRow,
    VsCol,
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

const savedContentArray = ref([]);
const requestBody = ref({
    uuids: [],
});

const localStoragePropertyName = 'vs-saved-pages';
const displayData = ref('no data retrieved');

async function getSavedPageData(uuidArray) {
    // eslint-disable-next-line no-undef
    const res = await $fetch('https://feature.visitscotland.com/site/api/favourites/get-favourites?vs_brxm_host=172.28.87.25&vs_brxm_port=8018&vs-no-redirect=true', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'post',
        body: JSON.stringify(uuidArray),
    });

    displayData.value = await res;
}

function refreshState() {
    savedContentArray.value = JSON.parse(localStorage.getItem(localStoragePropertyName));
    requestBody.value.uuids = savedContentArray.value.map((o) => o.uuid);
    getSavedPageData(requestBody.value);
}

function removePage(uuid) {
    // Remove from working data:
    savedContentArray.value = savedContentArray.value.filter((item) => item.uuid !== uuid);
    // Remove from display data:
    displayData.value.cards = displayData.value.cards.filter((o) => o.uuid !== uuid);
    // Update localStorage:
    localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
};

onMounted(() => {
    refreshState();
    window.addEventListener('storage', () => {
        refreshState();
    });
    getSavedPageData(requestBody.value);
});

</script>

<style>
    .vs-favourite-card .vs-card__header{
        position: relative;
    }
    .vs-favourite-card .vs-remove-content-button{
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 100;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.5s ease;
        }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
