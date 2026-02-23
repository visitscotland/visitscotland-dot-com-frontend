import { defineStore } from 'pinia';

interface IConfigState {
    activeSite: string,
    productSearch: any,
    otyml: any,
    pageItems: any[],
    heroImage: any,
    labels: any,
    newsletterSignpost: any,
    pageIntro: any,
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
    cludoApiOperator: string,
    googleMapApiKey: string,
    isMainMapPageFlag: boolean,
    pageDocument: any,
    enableHeroSection: boolean,
    pathIfError: string,
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
        pageIntro: {
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
        cludoApiOperator: 'or',
        googleMapApiKey: '',
        isMainMapPageFlag: false,
        pageDocument: null,
        enableHeroSection: false,
        pathIfError: '',
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
