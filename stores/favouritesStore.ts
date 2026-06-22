import { defineStore } from 'pinia';

export interface IFavouritesState {
    pages: string[];                        // CMS page UUIDs
    shareId: string;                        // db collection number
    revision: number;                       // changes to collection
    lastSharedRevision: number;             // only update db after changes
    pageEnabled: boolean,                   // per-page BR API property
    featureEnabled: boolean,                // per-instance BR API setting
    isDisplayPage: boolean,                 // my- or share- favourites
    isSharePage: boolean,                   // shared-favourites
    displaySavedUrl: string,                // my-favourites url (label) - myFavesUrl
    brGetPagesEndpoint: string,             // CMS get-favourites url (label) - brGetFaveEndpoint
    displaySharedUrl: string,               // share-favourites url (label) - sharedFaveUrl
    serviceUrl: string,                     // share service base URL (get-list | update-list | create-list)
}

export const useFavourites = defineStore('favourites', {
    state: (): IFavouritesState => ({
        pages: [],
        shareId: '',
        revision: 0,
        lastSharedRevision: 0,
        pageEnabled: false,
        featureEnabled: false,
        isDisplayPage: false,
        isSharePage: false,
        displaySavedUrl: '',
        displaySharedUrl: '',
        brGetPagesEndpoint: '',
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
    },
});
