import type { PiniaPluginContext } from 'pinia';

type SyncConfig = Record<string, string[]>;

const SYNC_CONFIG: SyncConfig = {
    favourites: ['pages', 'shareId', 'revision'],
};

export default defineNuxtPlugin((nuxtApp) => {
    const pinia = nuxtApp.$pinia;

    pinia.use(({ store }: PiniaPluginContext) => {
        const paths = SYNC_CONFIG[store.$id];
        if (!paths) return;

        const storageKey = `vs-${store.$id}`;

        // This is a guard against the store and storage
        // getting in a recursive update loop. 
        let syncingFromStorage = false;

        // -----------------------------
        // 1. Hydrate store
        // -----------------------------
        const raw = localStorage.getItem(storageKey);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                syncingFromStorage = true;

                store.$patch((state) => {
                    for (const key of paths) {
                        if (key in parsed) {
                            (state as any)[key] = parsed[key];
                        }
                    }
                });
            } catch {
                // ignore
            } finally {
                syncingFromStorage = false;
            }
        }

        // -----------------------------
        // 2. Store → localStorage
        // -----------------------------
        store.$subscribe((_mutation, state) => {
            if (syncingFromStorage) return;

            const payload: Record<string, unknown> = {
                
            };
            for (const key of paths) {
                payload[key] = (state as any)[key];
            }

            localStorage.setItem(storageKey, JSON.stringify(payload));
        });

        // -----------------------------
        // 3. Cross‑tab sync
        // -----------------------------
        window.addEventListener('storage', (event) => {
            if (event.key !== storageKey || !event.newValue) return;

            try {
                const parsed = JSON.parse(event.newValue);
                syncingFromStorage = true;

                store.$patch((state) => {
                    for (const key of paths) {
                        if (key in parsed) {
                            (state as any)[key] = parsed[key];
                        }
                    }
                });
            } catch {
                // ignore
            } finally {
                syncingFromStorage = false;
            }
        });
    });
});
