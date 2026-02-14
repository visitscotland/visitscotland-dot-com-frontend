<template>
    <div class="vs-save-content-button">
        <VsButton
            v-if="savePageEnabled"
            icon-only
            :icon="pageInSaveList(props.content) ? 'fa-solid fa-star' : 'fa-regular fa-star'"
            variant="subtle"
            size="md"
            @click="toggleSaved(props.content)"
        />
    </div>
</template>

<script lang="ts" setup>
import {
    ref,
    onMounted,
} from 'vue';

import { VsButton } from '@visitscotland/component-library/components';

const props = defineProps<{
    content: string
}>();

const savedContentArray = ref(null);

const savePageEnabled = ref(false);
const localStoragePropertyName = 'vs-saved-pages';

function refreshState() {
    const storageState = localStorage.getItem(localStoragePropertyName); // null || string
    if (storageState !== null && storageState.length > 0) {
        savePageEnabled.value = true;
        savedContentArray.value = JSON.parse(storageState);
    } else {
        savePageEnabled.value = false;
        savedContentArray.value = null;
    }
}

const pageSaved = ref(false);

onMounted(() => {
    refreshState();
    window.addEventListener('storage', () => {
        refreshState();
    });
});

function pageInSaveList(uid) {
    return savePageEnabled.value && savedContentArray.value.includes(uid);
}

function savePage(uid) {
    savedContentArray.value.push(uid);
    localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
};

function removePage(uid) {
    const filteredArray = savedContentArray.value.filter((pin) => pin !== uid);
    savedContentArray.value = filteredArray;
    localStorage.setItem(localStoragePropertyName, JSON.stringify(filteredArray));
};

function toggleSaved(uid) {
    if (pageSaved.value) {
        pageSaved.value = false;
    } else {
        pageSaved.value = true;
    }
    if (pageInSaveList(uid)) {
        removePage(uid);
    } else {
        savePage(uid);
    };
}

</script>

<style>
    .vs-save-content-button {
        position: fixed;
        top: 100px;
        right: 10px;
        z-index: 100;
    }
</style>
