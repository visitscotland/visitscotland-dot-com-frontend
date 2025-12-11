import { defineStore } from 'pinia';

interface IConfigState {
    activeSite: string,
    productSearch: any,
    otyml: any,
    pageItems: any[],
    heroImage: any,
    labels: any,
    newsletterSignpost: any,
    gtm: any,
    locale: string,
    pageMetaData: any,
    heroVideo: any,
    isLocalVideoheader: boolean,
    globalSearchUrl: string,
}

const useConfigStore = defineStore('configStore', {
    state: (): IConfigState => ({
        activeSite: '',
        productSearch: {
        },
        otyml: null,
        pageItems: [],
        heroImage: null,
        labels: {
        },
        newsletterSignpost: {
        },
        gtm: null,
        locale: '',
        pageMetaData: {
        },
        heroVideo: null,
        isLocalVideoheader: false,
        globalSearchUrl: '',
    }),
    actions: {
        getLabel(section: string, key: string) {
            if (!this.labels || !this.labels[section]) {
                return '';
            }

            if (this.labels[section][key]) {
                return this.labels[section][key];
            }

            return '';
        },
        getLabelMap(section: string) {
            if (!this.labels || !this.labels[section]) {
                return '';
            }

            return this.labels[section];
        },
    },
});

export default useConfigStore;
