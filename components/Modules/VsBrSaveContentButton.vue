<template>
    <VsButton
        icon-position="right"
        :icon="buttonSavedState ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
        :variant="buttonSavedState ? 'primary' : 'secondary'"
        @click="toggleSaved(props.uuid)"
    >
        <!-- two alternate labels -->
        {{ buttonSavedState ? "Remove from favourites" : "Add to favourites" }}
    </VsButton>
</template>

<script lang="ts" setup>
import {
    ref,
    onMounted,
} from 'vue';

import { VsButton } from '@visitscotland/component-library/components';

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
    title: props.title,
    teaser: props.teaser,
    uuid: props.uuid,
    image: props.image,
};

function pageInSaveList(uuid) {
    return savedContentArray.value.some((item) => item.uuid === uuid);
}

function refreshState() {
    savedContentArray.value = JSON.parse(localStorage.getItem(localStoragePropertyName));
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
