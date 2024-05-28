/* eslint no-undef: 0 */

import { BrSdk } from '@bloomreach/vue3-sdk';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(BrSdk);
});
