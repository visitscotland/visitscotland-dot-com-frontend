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
});
