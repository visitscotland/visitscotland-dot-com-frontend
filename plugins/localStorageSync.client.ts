import { useLocalStorageStore } from '@/stores/localStorageStore.ts';
import type { ILocalStorageState } from '@/stores/localStorageStore';
import { watch } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
    const store = useLocalStorageStore(nuxtApp.$pinia);

    // -----------------------------
    // 1. Hydrate store from localStorage
    // -----------------------------
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

    // -----------------------------
    // 2. Persist store → localStorage on any change
    // -----------------------------
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

    // -----------------------------
    // 3. Cross‑tab sync:
    //    When another tab updates localStorage,
    //    patch THIS tab's store so UI updates instantly.
    // -----------------------------
    window.addEventListener('storage', (event) => {
        // Ignore events without a key
        if (!event.key) {
            return;
        }

        // Only handle keys that exist in the store
        if (event.key in store.$state) {
            try {
                const parsed = event.newValue ? JSON.parse(event.newValue) : null;

                store.$patch({
                    [event.key]: parsed,
                });
            } catch (error) {
                console.log(
                    `Failed to parse updated localStorage value for key "${event.key}".`,
                    event.newValue,
                    error,
                );
            }
        }
    });
});
