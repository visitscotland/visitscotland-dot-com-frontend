import { defineStore } from 'pinia';

interface IConfigState {
    // isBusinessEvents: boolean,
    // pageItems: any[],
    labels: any,
    pageMetaData: any,
}

const useConfigStore = defineStore('configStore', {
    state: (): IConfigState => ({
        // isBusinessEvents: false,
        // pageItems: [],
        labels: {
        },
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
