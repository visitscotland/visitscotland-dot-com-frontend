import { watch } from 'vue';
import { useFavourites } from '@/stores/favouritesStore.ts';
import type { IFavouritesState } from '@/stores/favouritesStore';

/**
 * Keys that are persisted for reload / refresh
 */
const PERSIST_KEYS: (keyof IFavouritesState)[] = [
    'pages',
    'shareId',
    'revision',
    'lastSharedRevision',
];

/**
 * Keys that are live‑synced across tabs
 */
const LIVE_SYNC_KEYS: (keyof IFavouritesState)[] = ['pages', 'shareId'];

export default defineNuxtPlugin((nuxtApp) => {
    const favouritesStore = useFavourites(nuxtApp.$pinia);

    // -----------------------------
    // 1. Hydrate store from localStorage
    // -----------------------------
    for (const key of PERSIST_KEYS) {
        const raw = window.localStorage.getItem(key);

        if (raw !== null) {
            try {
                const parsed = JSON.parse(raw);

                if (key === 'pages') {
                    favouritesStore.pages = Array.isArray(parsed) ? parsed : [];
                } else {
                    favouritesStore.$patch({ 
                        [key]: parsed,
                    });
                }
            } catch {
                // ignore malformed values
            }
        }
    }

    // -----------------------------
    // 2. Persist store → localStorage
    // -----------------------------
    watch(
        () => ({
            pages: favouritesStore.pages,
            shareId: favouritesStore.shareId,
            revision: favouritesStore.revision,
            lastSharedRevision: favouritesStore.lastSharedRevision,
        }),
        (state) => {
            for (const key of PERSIST_KEYS) {
                window.localStorage.setItem(key, JSON.stringify(state[key]));
            }
        },
        {
            deep: true,
        },
    );

    // -----------------------------
    // 3. Cross‑tab live sync (one‑way)
    // -----------------------------
    window.addEventListener('storage', (event) => {
        if (!event.key) {
            return;
        }

        if (!LIVE_SYNC_KEYS.includes(event.key as keyof IFavouritesState)) {
            return;
        }

        try {
            const value = event.newValue ? JSON.parse(event.newValue) : [];

            // Special handling for pages
            if (event.key === 'pages') {
                const current = favouritesStore.pages;

                // Only react if the array actually changed
                const changed =
                    JSON.stringify(value) !== JSON.stringify(current);

                if (!changed) {
                    return;
                }

                // Assign directly instead of $patch
                favouritesStore.pages = value;

                // Record that this tab observed a mutation
                favouritesStore.revision += 1;

                return;
            }

            // ✅ unchanged behavior for other live‑sync keys (e.g. shareId)
            favouritesStore.$patch({
                [event.key]: value,
            });
        } catch {
            // ignore malformed values
        }
    });
});
