<template>
    <div class="vs-save-content-button">
        {{ buttonSavedState }}
        <VsButton
            icon-only
            :icon="buttonSavedState ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
            :variant="variant"
            :size="size"
            @click="toggleSaved(props.uid)"
        />
        {{ savedContentArray }}
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
    description: string,
    uid: string,
    image: string,
}>();

const savedContentArray = ref([]);
const localStoragePropertyName = 'vs-saved-pages';
const buttonSavedState = ref(false);

function pageInSaveList(uid) {
    return savedContentArray.value.some((item) => item.uid === uid);
}

function refreshState() {
    savedContentArray.value = JSON.parse(localStorage.getItem(localStoragePropertyName));
    buttonSavedState.value = pageInSaveList(props.uid);
}

onMounted(() => {
    refreshState();
    window.addEventListener('storage', () => {
        refreshState();
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
        savePage(props);
    }
    buttonSavedState.value = pageInSaveList(props.uid);
}
</script>
