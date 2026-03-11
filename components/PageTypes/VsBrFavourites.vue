<template>
    <div class="d-flex flex-column gap-500">
        <VsBrHeroSection
            :content="documentData"
        />
        <VsContainer class="mt-075 mt-lg-200">
            <VsRow>
                <VsCol>
                    <div v-if="savedContentArray.length < 1">
                        <p>
                            You don't have any saved pages yet.
                        </p>
                    </div>
                    <VsCardGroup
                        variant="grid"
                        :cards-per-row="4"
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
