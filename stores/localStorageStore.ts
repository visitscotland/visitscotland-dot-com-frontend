import { defineStore } from 'pinia';

export interface ILocalStorageState {
  favourites: string[];
  shareId: string;
}

export const useLocalStorageStore = defineStore('localStorage', {
    state: (): ILocalStorageState => ({
        favourites: [],
        shareId: '',
    }),
});
