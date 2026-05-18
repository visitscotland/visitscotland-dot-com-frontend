import { defineStore } from 'pinia';

export interface IFavouritesState {
  pages: string[];
  shareId: string;
  revision: number;
  lastSharedRevision: number;
}

export const useFavourites = defineStore('favourites', {
    state: (): IFavouritesState => ({
        pages: [],
        shareId: '',
        revision: 0,
        lastSharedRevision: 0,
    }),
    actions: {
        add(uuid) {
            if (this.pages.includes(uuid)) {
                return;
            };
            this.pages.push(uuid);
            // IFF previously shared, update db on copy link
            if (this.shareId){ this.revision += 1; }
        },
        remove(uuid) {
            if (!this.pages.includes(uuid)) {
                return;
            };
            this.pages = this.pages.filter(
                (item) => item !== uuid,
            );
            // IFF previously shared, update db on copy link
            if (this.shareId){ this.revision += 1; }
        },
        // A temporary action to update the stores of anyone with favourites before the property key changed
        migrateSavedPages(): void {
            const oldKey = 'vs-saved-pages';
            const newKey = 'vs-favourites';

            const oldRaw = localStorage.getItem(oldKey);
            if (!oldRaw) {
                return;
            };

            const oldData = JSON.parse(oldRaw);
            if (!Array.isArray(oldData) || oldData.length === 0) {
                return;
            };

            const uuids = oldData.map((item) => item.uuid);

            const favRaw = localStorage.getItem(newKey);
            const favData = favRaw ? JSON.parse(favRaw) : {
                pages: [],
            };

            if (!Array.isArray(favData.pages)) {
                favData.pages = [];
            };

            uuids.forEach((uuid) => {
                if (!favData.pages.includes(uuid)) {
                    favData.pages.push(uuid);
                }
            });
            this.pages = [...favData.pages];
            localStorage.setItem(newKey, JSON.stringify(favData));
            localStorage.removeItem(oldKey);
        },
    },
});
