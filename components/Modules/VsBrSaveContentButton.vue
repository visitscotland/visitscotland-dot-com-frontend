<template>
    <div class="vs-save-content-button">
        <VsButton
            v-if="savePageEnabled"
            icon-only
            :icon="pageSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
            :variant="variant"
            :size="size"
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
    content: string,
    size: string,
}>();

const savedContentArray = ref(null);
const savePageEnabled = ref(false);
const localStoragePropertyName = 'vs-saved-pages';
const pageSaved = ref(false);
let pageUrl = null;

function pageInSaveList(uid) {
    return savePageEnabled.value && savedContentArray.value.some((item) => item.url === uid);
}

function refreshState() {
    const storageState = localStorage.getItem(localStoragePropertyName); // null || string
    if (storageState !== null && storageState.length > 0) {
        savePageEnabled.value = true;
        savedContentArray.value = JSON.parse(storageState);
        pageSaved.value = pageInSaveList(pageUrl);
    } else {
        savePageEnabled.value = false;
        savedContentArray.value = null;
    }
}

onMounted(() => {
    refreshState();
    window.addEventListener('storage', () => {
        refreshState();
    });
    pageUrl = window.location.href;
});

function savePage(content) {
    savedContentArray.value.push(content);
    localStorage.setItem(localStoragePropertyName, JSON.stringify(savedContentArray.value));
};

function removePage(uid) {
    const filteredArray = savedContentArray.value.filter((item) => item.url !== uid);
    savedContentArray.value = filteredArray;
    localStorage.setItem(localStoragePropertyName, JSON.stringify(filteredArray));
};

function toggleSaved(data) {
    const content = data;
    content.url = pageUrl;

    if (pageSaved.value) {
        pageSaved.value = false;
        removePage(content.uid);
    } else {
        pageSaved.value = true;
        savePage(content);
    }
}

</script>
