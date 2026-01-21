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
    langString: string,
    pageMetaData: any,
    heroVideo: any,
    isLocalVideoheader: boolean,
    globalSearchPath: string,
    cludoCustomerId: string,
    cludoExperienceId: string,
    cludoEngineId: string,
    cludoLanguage: string,
    searchDmsBased: boolean,
    eventsApiUrl: string,
    showSearchWidget: boolean,
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
        langString: '',
        pageMetaData: {
        },
        heroVideo: null,
        isLocalVideoheader: false,
        globalSearchPath: '',
        cludoCustomerId: '',
        cludoExperienceId: '',
        cludoEngineId: '',
        cludoLanguage: '',
        searchDmsBased: false,
        eventsApiUrl: '',
        showSearchWidget: false,
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
