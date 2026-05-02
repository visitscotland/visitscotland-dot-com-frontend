<template>
    <VsButton
        icon-position="right"
        :icon="buttonSavedState ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
        :variant="buttonSavedState ? 'primary' : 'secondary'"
        @click="toggleSaved(props.uuid)"
    >
        {{ buttonSavedState
            ? configStore.getLabel('favourites-button', 'button.remove.text')
            : configStore.getLabel('favourites-button', 'button.add.text')
        }}
    </VsButton>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { VsButton } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import { useLocalStorageStore } from '~/stores/localStorageStore.ts';
import dataLayerComposable from '~/composables/dataLayer.ts';

const configStore = useConfigStore();
const localStorageStore = useLocalStorageStore();
const dataLayerHelper = dataLayerComposable();

const props = defineProps<{
    uuid: string,
    gtmData: object,
}>();

// Derived state: is this page saved?
const buttonSavedState = computed(() => {
    return localStorageStore.favourites.includes(props.uuid);
});

// Toggle logic using the Pinia store
function toggleSaved(uuid: string) {
    if (localStorageStore.favourites.includes(uuid)) {
        localStorageStore.favourites = localStorageStore.favourites.filter(
            (item) => item !== uuid,
        );

        dataLayerHelper.createDataLayerObject('favouriteRemoveEvent', {
            content_title: props.gtmData.title,
            total_favourites: configStore.getFavouritesCount(),
            interaction_timestamp_ms: Date.now(),
        });
    } else {
        localStorageStore.favourites = [
            ...localStorageStore.favourites,
            uuid,
        ];

        dataLayerHelper.createDataLayerObject('favouriteAddEvent', {
            content_title: props.gtmData.title,
            total_favourites: configStore.getFavouritesCount(),
            interaction_timestamp_ms: Date.now(),
        });
    }
}
</script>
