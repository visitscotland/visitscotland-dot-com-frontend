import { useLocalStorageStore } from '@/stores/localStorageStore.ts';
import type { ILocalStorageState } from '@/stores/localStorageStore';
import { watch } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
    const store = useLocalStorageStore(nuxtApp.$pinia);

    for (const key of Object.keys(store.$state) as (keyof ILocalStorageState)[]) {
        const raw = window.localStorage.getItem(key);

        if (raw !== null) {
            try {
                store.$patch({
                    [key]: JSON.parse(raw),
                });
            } catch (error) {
                console.log(
                    `Failed to parse localStorage value for key "${key}". Raw value:`,
                    raw,
                    error,
                );
            }
        }
    }

    // Deep watcher: persist all properties on any change, not just Pinia key events
    watch(
        () => store.$state,
        (newState) => {
            for (const key of Object.keys(newState) as (keyof ILocalStorageState)[]) {
                window.localStorage.setItem(
                    key,
                    JSON.stringify(newState[key]),
                );
            }
        },
        {
            deep: true,
        },
    );
});
