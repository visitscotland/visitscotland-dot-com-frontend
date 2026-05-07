<template>
    <VsContainer class="mt-075 mt-lg-200">
        <VsRow>
            <VsCol>
                <div v-if="uiState === 'error'">
                    <div class="d-flex justify-content-center">
                        <div
                            class="d-flex flex-column gap-200 align-items-center"
                            style="max-width: 478px">
                            <svg
                                width="189" height="189" viewBox="0 0 189 189" fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M118.974 98.9297C122.444 99.8895 126.098 100.406 129.938 100.406C152.271 100.406 170.469 82.6875 171.244 60.5391L161.905 69.8783C157.475 74.308 151.458 76.7812 145.183 76.7812H135.844C122.813 76.7812 112.219 66.1869 112.219 53.1562V43.7801C112.219 37.5047 114.692 31.4877 119.122 27.058L128.461 17.7557C106.312 18.4939 88.5938 36.7295 88.5938 59.0625C88.5938 62.8646 89.1105 66.5561 90.0703 70.026C91.7684 76.1537 89.9965 82.7244 85.493 87.2279L21.0779 151.606C18.9 153.747 17.7188 156.7 17.7188 159.764C17.7188 166.113 22.8867 171.281 29.2359 171.281C32.2998 171.281 35.216 170.063 37.3939 167.922L101.772 103.507C106.276 99.0035 112.846 97.2686 118.974 98.9297ZM156.737 14.5441L131.672 39.6088C130.565 40.7162 129.938 42.2297 129.938 43.7801V53.1562C129.938 56.4047 132.595 59.0625 135.844 59.0625H145.22C146.77 59.0625 148.284 58.435 149.391 57.3275L174.456 32.2629C177.114 29.6051 181.58 30.085 183.204 33.4811C186.933 41.233 189 49.9078 189 59.0625C189 91.6945 162.57 118.125 129.938 118.125C124.511 118.125 119.269 117.387 114.323 116.021L49.9078 180.436C44.4076 185.936 36.9879 189 29.2359 189C13.1045 189 0 175.896 0 159.764C0 152.012 3.06387 144.592 8.56406 139.092L72.9791 74.6771C71.6133 69.7307 70.875 64.4889 70.875 59.0625C70.875 26.4305 97.3055 0 129.938 0C139.092 0 147.767 2.1041 155.519 5.79551C158.915 7.41973 159.395 11.8863 156.737 14.5441ZM32.4844 150.609C34.0508 150.609 35.5531 151.232 36.6607 152.339C37.7684 153.447 38.3906 154.949 38.3906 156.516C38.3906 158.082 37.7684 159.584 36.6607 160.692C35.5531 161.8 34.0508 162.422 32.4844 162.422C30.9179 162.422 29.4157 161.8 28.308 160.692C27.2004 159.584 26.5781 158.082 26.5781 156.516C26.5781 154.949 27.2004 153.447 28.308 152.339C29.4157 151.232 30.9179 150.609 32.4844 150.609Z"
                                    fill="#E5E5F0"
                                />
                            </svg>
                            <VsHeading
                                level="2"
                                heading-style="heading-l"
                            >
                                {{ configStore.getLabel('favourites', 'favourites.error.failed-fetch.header') }}
                            </VsHeading>
                            <p class="text-center">
                                {{ configStore.getLabel('favourites', 'favourites.error.failed-fetch.text') }}
                            </p>
                        </div>
                    </div>
                </div>
                <div v-else-if="uiState === 'loading'">
                    <!-- Flash of content was flagged as an issue in QA, but Loading state has not
                    been designed for.    -->
                </div>
                <div v-else-if="uiState === 'empty'">
                    <div class="d-flex justify-content-center">
                        <div
                            class="d-flex flex-column gap-200 align-items-center"
                            style="max-width: 478px"
                        >
                            <svg
                                width="202" height="189" viewBox="0 0 202 189" fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M88.9088 183.857L87.9244 182.862L18.9394 112.54C6.85125 100.222 0 82.9334 0 64.8235V63.3972C0 32.9689 19.6875 6.86292 46.935 1.15763C62.4488 -2.12724 78.3169 1.80595 90.9563 11.5741C94.5 14.3403 97.8075 17.5387 100.8 21.2126C102.454 19.1379 104.226 17.2362 106.116 15.4641C107.573 14.081 109.069 12.7843 110.644 11.5741C123.283 1.80595 139.151 -2.12724 154.665 1.11441C181.913 6.8197 201.6 32.9689 201.6 63.3972V64.8235C201.6 82.9334 194.749 100.222 182.661 112.54L113.676 182.862L112.691 183.857C109.463 187.141 105.21 189 100.8 189C96.39 189 92.1375 187.185 88.9088 183.857ZM94.1456 44.1634C93.9881 44.0337 93.87 43.8609 93.7519 43.688L86.7431 35.0436L86.7038 35.0004C77.6081 23.8059 63.8663 18.7057 50.4788 21.5151C32.13 25.3619 18.9 42.91 18.9 63.3972V64.8235C18.9 77.1417 23.5856 88.9413 31.815 97.3263L100.8 167.648L169.785 97.3263C178.014 88.9413 182.7 77.1417 182.7 64.8235V63.3972C182.7 42.9532 169.47 25.3619 151.161 21.5151C137.773 18.7057 123.992 23.8491 114.936 35.0004C114.936 35.0004 114.936 35.0004 114.896 35.0436C114.857 35.0868 114.896 35.0436 114.857 35.0868L107.848 43.7312C107.73 43.9041 107.573 44.0338 107.454 44.2066C105.683 46.1516 103.281 47.2322 100.8 47.2322C98.3194 47.2322 95.9175 46.1516 94.1456 44.2066V44.1634Z"
                                    fill="#E5E5F0" />
                            </svg>
                            <VsHeading
                                level="2"
                                heading-style="heading-l"
                            >
                                {{ configStore.getLabel('favourites', 'favourites.error.empty-state.heading') }}
                            </VsHeading>
                            <p class="text-center">
                                {{ configStore.getLabel('favourites', 'favourites.error.empty-state.text') }}
                            </p>
                        </div>
                    </div>
                </div>
                <div v-else-if="uiState === 'ready'">
                    <VsCardGroup
                        variant="grid"
                        :cards-per-row="3">
                        <TransitionGroup name="fade">
                            <VsCard
                                class="vs-favourite-card rounded-2"
                                v-for="data in cardData"
                                :key="data.uuid"
                                card-style="outlined">
                                <template #vs-card-header>
                                    <div class="vs-remove-content-button">
                                        <VsButton
                                            icon-only
                                            icon="fa-solid fa-heart"
                                            size="sm"
                                            @click="removeContent(data.uuid, data.title)"
                                        >
                                            {{ configStore.getLabel('favourites-button', 'button.remove.text') }}
                                        </VsButton>
                                    </div>

                                    <VsImg
                                        :src="data.image"
                                        class="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover img-zoom-on-hover" />
                                </template>

                                <template #vs-card-body>
                                    <div class="px-075">
                                        <VsHeading
                                            level="2"
                                            heading-style="heading-xxs"
                                        >
                                            <VsLink
                                                :href="data.url"
                                                class="stretched-link"
                                                variant="secondary"
                                                @click="gtmPush"
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
                </div>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>


<script lang="ts" setup>
import {
    ref,
    watch,
    onMounted,
} from 'vue';

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

import useConfigStore from '~/stores/configStore.ts';
import { useFavourites } from '~/stores/favouritesStore.ts';
import dataLayerComposable from '~/composables/dataLayer.ts';

const configStore = useConfigStore();
const favourites = useFavourites();
const dataLayerHelper = dataLayerComposable();

const uiState = computed(() => {
    if (fetchRequestStatus.value === 'error') {
        return 'error';
    }
    if (fetchRequestStatus.value === 'pending') {
        return 'loading';
    }
    if (favourites.pages.length === 0) {
        return 'empty';
    }
    if (cardData.value.length === 0) {
        return 'empty';
    }
    return 'ready';
});

const fetchRequestStatus = ref('pending');
const cardData = ref<any[]>([]);

const favouritesEndpoint = configStore.featureFavouritesEndpoint;

// Fetch CMS data for a list of UUIDs
async function getSavedContentData() {
    try {
        const res = await $fetch(
            favouritesEndpoint,
            {
                method: 'POST',
                body: {
                    uuids: favourites.pages,
                },
            },
        );

        cardData.value = Array.isArray(res.cards) ? res.cards : [];
        fetchRequestStatus.value = 'done';
    } catch (err) {
        console.error('Failed to fetch saved content data:', err);
        fetchRequestStatus.value = 'error';
    }
}

// Remove content from the favourites list and update display data
function removeContent(uuid, title) {
    // Update store
    favourites.pages = favourites.pages.filter(
        (item) => item !== uuid,
    );
    // Update rendered CMS data
    if (cardData.value) {
        cardData.value = cardData.value.filter(
            (o) => o.uuid !== uuid,
        );
    }
    dataLayerHelper.createDataLayerObject('favouriteRemoveEvent', {
        content_title: title,
        total_favourites: favourites.pages.length,
        interaction_timestamp_ms: Date.now(),
    });
    favourites.revision += 1;
}

// Analytics helper
function gtmPush() {
    dataLayerHelper.createDataLayerObject('favouritesClickEvent', {
        list_position: 2,
        total_favourites: favourites.pages.length,
        interaction_timestamp_ms: Date.now(),
    });
}

// Fetch data on mount
onMounted(() => {
    dataLayerHelper.createDataLayerObject('favouritesPageViewEvent', {
        favourite_owner: 'self',
        total_favourites: favourites.pages.length,
        shared_list_id: ' ',
    });

    // Initial fetch
    getSavedContentData(favourites.pages);
});

// Re-fetch CMS data whenever the favourites list changes
watch(
    () => favourites.pages,
    (newList) => {
        getSavedContentData(newList);
    },
    {
        deep: true,
    },
);
</script>


<style>
.vs-favourite-card .vs-card__header {
    position: relative;
}

.vs-favourite-card .vs-remove-content-button {
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
