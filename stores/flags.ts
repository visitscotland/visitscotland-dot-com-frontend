import { defineStore } from 'pinia';

export const useFlagsStore = defineStore('flags', {
    state: () => ({
        flags: {},
    }),
});