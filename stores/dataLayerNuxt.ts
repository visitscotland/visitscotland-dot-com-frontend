import { ref } from 'vue';
import { defineStore } from 'pinia';

type Tag = {
    key: string;
    value: string;
};

const useDataLayerNuxtStore = defineStore('datalayer-nuxt', () => {
    const pageUrl = ref('');
    const tagsTestRun = ref(false);
    const GTMData = ref<any>({
    });

    function setTestRun(payload: boolean) {
        tagsTestRun.value = payload;
    }

    function setPageUrl(payload: string) {
        pageUrl.value = payload;
    }

    function processPayload(payload: Tag) {
        GTMData.value[payload.key] = payload.value;
    }

    function getValueFromKey(key: string) {
        return GTMData.value[key];
    }

    return {
        pageUrl,
        tagsTestRun,
        GTMData,
        getValueFromKey,
        setTestRun,
        setPageUrl,
        processPayload,
    };
});

export default useDataLayerNuxtStore;
