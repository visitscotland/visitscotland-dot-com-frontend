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
    allowFavourite: boolean,
    isFavouritesPage: boolean,
    featureFavouritesEnabled: boolean,
    featureFavouritesUrl: string,
    featureFavouritesEndpoint: string,
    globalSearchPath: string,
    cludoCustomerId: string,
    cludoExperienceId: string,
    cludoEngineId: string,
    cludoLanguage: string,
    searchDmsBased: boolean,
    eventsApiUrl: string,
    showSearchWidget: boolean,
    searchFilters: object,
    cludoApiOperator: string,
    googleMapApiKey: string,
    isMainMapPageFlag: boolean,
    mainMapPath: string,
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
        allowFavourite: false,
        featureFavouritesEnabled: false,
        featureFavouritesUrl: '',
        featureFavouritesEndpoint: '',
        globalSearchPath: '',
        isFavouritesPage: false,
        cludoCustomerId: '',
        cludoExperienceId: '',
        cludoEngineId: '',
        cludoLanguage: '',
        searchDmsBased: false,
        eventsApiUrl: '',
        showSearchWidget: false,
        searchFilters: {
        },
        cludoApiOperator: 'or',
        googleMapApiKey: '',
        isMainMapPageFlag: false,
        mainMapPath: '',
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

        getFavouritesCount(): number {
            try {
                const raw = localStorage.getItem('vs-saved-pages');
                const parsed = raw ? JSON.parse(raw) : null;
                return Array.isArray(parsed) ? parsed.length : 0;
            } catch {
                return 0;
            }
        },
    },
});

export default useConfigStore;
