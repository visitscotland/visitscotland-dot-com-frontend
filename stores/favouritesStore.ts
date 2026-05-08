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
            this.revision += 1;
        },
        remove(uuid) {
            if (!this.pages.includes(uuid)) {
                return;
            };
            this.pages = this.pages.filter(
                (item) => item !== uuid,
            );
            this.revision += 1;
        },
    },
});
