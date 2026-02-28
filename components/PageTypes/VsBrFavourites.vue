<template>
    <div class="d-flex flex-column gap-500">
        <VsBrHeroSection
            :content="documentData"
        />
        <!-- {{ displayData }} -->
        {{ testData }}
        <br>
          <!-- {{ savedContentArray }} -->
        {{ requestBody }}
        <VsContainer class="mt-075 mt-lg-200">
            <VsRow>
                <VsCol>
                    <!-- <div v-if="savedContentArray.length < 1">
                        <p>
                            You don't have any saved pages yet.
                        </p>
                    </div> -->
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
                                        v-if="data.image"
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
                                                {{ data.description }}
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

function refreshState() {
    savedContentArray.value = JSON.parse(localStorage.getItem(localStoragePropertyName));
    requestBody.value.uuids = savedContentArray.value.map((o) => o.uid);
}

function removePage(uid) {
    savedContentArray.value = savedContentArray.value.filter((item) => item.uid !== uid);
    localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
};

const displayData = ref('no data retrieved');

async function getSavedPageData(uuidArray) {
    // eslint-disable-next-line no-undef
    const res = await $fetch('http://localhost:8080/site/api/favourites/get-favourites', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'post',
        body: JSON.stringify(uuidArray),
    });

    displayData.value = await res;
}

const testData = {
    uuids: [
        '03638a37-3acc-4c14-b07d-bbaaa816f576',
        'd660a005-456f-433d-842a-7ca180139771',
        // 'e16bdb89-c271-46f1-851f-2d2b82d631d4',
        // 'f846ac14-4bbe-43af-8bdd-1f60979abc11',
        // '8b4a3c11-8b84-4aa0-bccf-f407d18c1c44',
        // '9db81e99-3924-4c43-a336-f5559d6fbcd6',
        // 'c9ee3aa3-7163-4d2a-aa73-3bb84de975b2',
        // 'bc5bec32-9cbc-45a7-855b-342008ad8ef9',
        // 'bc5bec32-9cbc-45a7-855b-342dfdrd8ef9',
    ],
};

onMounted(() => {
    refreshState();
    window.addEventListener('storage', () => {
        refreshState();
    });
    // getSavedPageData(testData);
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
    /* .vs-favourite-card .vs-remove-content-button .btn {
        background-color: #200F2E;
        border-color: transparent;
    }
    .vs-favourite-card .vs-remove-content-button .btn:hover {
        background: #1f49d6;
    } */
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.5s ease;
        }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
