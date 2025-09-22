import { defineStore } from 'pinia';

interface IConfigState {
    activeSite: string,
    productSearch: any,
    otyml: any,
    pageItems: any[],
    labels: any,
    newsletterSignpost: any,
    gtm: any,
    locale: string,
    pageMetaData: any,
    heroVideo: any,
}

const useConfigStore = defineStore('configStore', {
    state: (): IConfigState => ({
        activeSite: '',
        productSearch: {
        },
        otyml: null,
        pageItems: [],
        labels: {
        },
        newsletterSignpost: {
        },
        gtm: null,
        locale: '',
        pageMetaData: {
        },
        heroVideo: null,
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
    },
});

export default useConfigStore;
