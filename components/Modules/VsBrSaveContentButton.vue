<template>
    <VsButton
        icon-position="right"
        :icon="buttonSavedState ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
        :variant="buttonSavedState ? 'primary' : 'secondary'"
        @click="toggleSaved(props.uuid)"
    >
        {{ buttonSavedState ? configStore.getLabel('favourites', 'favourites.button.remove.text') : configStore.getLabel('favourites', 'favourites.button.add.text') }}
    </VsButton>
</template>

<script lang="ts" setup>
import {
    ref,
    onMounted,
} from 'vue';

import { VsButton } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{
    title: string,
    teaser: string,
    uuid: string,
    image: string,
    variant: string,
    size: string,
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

function refreshState() {
    if (JSON.parse(localStorage.getItem(localStoragePropertyName)) === null) {
        localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
    } else {
        savedContentArray.value = JSON.parse(localStorage.getItem(localStoragePropertyName));
    };
}

onMounted(() => {
    refreshState();
    buttonSavedState.value = pageInSaveList(props.uuid);
    window.addEventListener('storage', () => {
        refreshState();
        buttonSavedState.value = pageInSaveList(props.uuid);
    });
});

function savePage(content) {
    savedContentArray.value.push(content);
    localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
};

function removePage(uuid) {
    savedContentArray.value = savedContentArray.value.filter((item) => item.uuid !== uuid);
    localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
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
