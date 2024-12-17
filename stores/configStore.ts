import { defineStore } from 'pinia';

interface IConfigState {
    activeSite: string,
    // pageItems: any[],
    labels: any,
    gtm: any,
    pageMetaData: any,
}

const useConfigStore = defineStore('configStore', {
    state: (): IConfigState => ({
        activeSite: '',
        // pageItems: [],
        labels: {
        },
        gtm: null,
        pageMetaData: {
        },
    }),
    actions: {
        getLabel(section: string, key: string): string {
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
