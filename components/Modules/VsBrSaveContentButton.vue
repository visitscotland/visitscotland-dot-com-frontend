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
import { useFavourites } from '~/stores/favouritesStore.ts';
import dataLayerComposable from '~/composables/dataLayer.ts';

const configStore = useConfigStore();
const favourites = useFavourites();
const dataLayerHelper = dataLayerComposable();

const props = defineProps<{
    uuid: string,
    gtmData: object,
}>();

// Derived state: is this page saved?
const buttonSavedState = computed(() => {
    return favourites.pages.includes(props.uuid);
});

// Toggle logic using the Pinia store
function toggleSaved(uuid: string) {
    if (favourites.pages.includes(uuid)) {
        favourites.pages = favourites.pages.filter(
            (item) => item !== uuid,
        );
        favourites.revision += 1;
        // Analytics event
        dataLayerHelper.createDataLayerObject('favouriteRemoveEvent', {
            content_title: props.gtmData.title,
            total_favourites: configStore.favourites.pages.length,
            interaction_timestamp_ms: Date.now(),
        });
    } else {
        favourites.pages = [
            ...favourites.pages,
            uuid,
        ];
        favourites.revision += 1;
        // Analytics event
        dataLayerHelper.createDataLayerObject('favouriteAddEvent', {
            content_title: props.gtmData.title,
            total_favourites: configStore.favourites.pages.length,
            interaction_timestamp_ms: Date.now(),
        });
    }
}
</script>
