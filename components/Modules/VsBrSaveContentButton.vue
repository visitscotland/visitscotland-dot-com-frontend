<template>
    <VsButton
        icon-position="right"
        :icon="buttonSavedState ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
        :variant="buttonSavedState ? 'primary' : 'secondary'"
        @click="toggleSaved(props.uuid)"
    >
        {{ buttonSavedState ? configStore.getLabel('favourites-button', 'button.remove.text') : configStore.getLabel('favourites-button', 'button.add.text') }}
    </VsButton>
</template>

<script lang="ts" setup>
import {
    ref,
    onMounted,
    onBeforeUnmount,
} from 'vue';

import { VsButton } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import dataLayerComposable from '~/composables/dataLayer.ts';


const configStore = useConfigStore();
const dataLayerHelper = dataLayerComposable();

const props = defineProps<{
    uuid: string,
    gtmData: object,
}>();

const savedContentArray = ref([]);
const localStoragePropertyName = 'vs-saved-pages';
const buttonSavedState = ref(false);
const dataForStorage = {
    uuid: props.uuid,
};

function pageInSaveList(uuid) {
    return savedContentArray.value.some((item) => item.uuid === uuid);
}

const refreshState = () => {
    if (JSON.parse(localStorage.getItem(localStoragePropertyName)) === null) {
        localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
    } else {
        savedContentArray.value = JSON.parse(localStorage.getItem(localStoragePropertyName));
    };
    buttonSavedState.value = pageInSaveList(props.uuid);
};

onMounted(() => {
    refreshState();
    buttonSavedState.value = pageInSaveList(props.uuid);
    window.addEventListener('storage', refreshState);
});

onBeforeUnmount(() => {
    window.removeEventListener('storage', refreshState);
});

function savePage(content) {
    savedContentArray.value.push(content);
    localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
    dataLayerHelper.createDataLayerObject('favouriteAddEvent', {
        content_title: props.gtmData.title,
        total_favourites: configStore.getFavouritesCount(),
        interaction_timestamp_ms: Date.now(),
    });
}; 

function removePage(uuid) {
    savedContentArray.value = savedContentArray.value.filter((item) => item.uuid !== uuid);
    localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
    dataLayerHelper.createDataLayerObject('favouriteRemoveEvent', {
        content_title: props.gtmData.title,
        total_favourites: configStore.getFavouritesCount(),
        interaction_timestamp_ms: Date.now(),
    });
};

function toggleSaved(uuid) {
    if (pageInSaveList(uuid)) {
        removePage(uuid);
    } else if (!pageInSaveList(uuid)) {
        savePage(dataForStorage);
    }
    buttonSavedState.value = pageInSaveList(props.uuid);
}

</script>
