<template>
    <div class="vs-save-content-button">
        <VsButton
            icon-position="right"
            :icon="buttonSavedState ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
            :variant="buttonSavedState ? 'primary' : 'secondary'"
            :size="size"
            @click="toggleSaved(props.uid)"
        >
            <!-- two alternate labels -->
            {{ buttonSavedState ? "Remove from favourites" : "Add to favourites" }}
        </VsButton>
    </div>
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

function pageInSaveList(uid) {
    return savedContentArray.value.some((item) => item.uid === uid);
}

function refreshState() {
    savedContentArray.value = JSON.parse(localStorage.getItem(localStoragePropertyName));
}

onMounted(() => {
    refreshState();
    buttonSavedState.value = pageInSaveList(props.uid);
    window.addEventListener('storage', () => {
        refreshState();
        buttonSavedState.value = pageInSaveList(props.uid);
    });
});

function savePage(content) {
    savedContentArray.value.push(content);
    localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
};

function removePage(uid) {
    savedContentArray.value = savedContentArray.value.filter((item) => item.uid !== uid);
    localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
};

function toggleSaved(uid) {
    if (pageInSaveList(uid)) {
        removePage(uid);
    } else if (!pageInSaveList(uid)) {
        savePage(dataForStorage);
    }
    buttonSavedState.value = pageInSaveList(props.uid);
}

</script>
