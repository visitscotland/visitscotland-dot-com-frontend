/* eslint no-undef: 0 */

export default defineNuxtPlugin((nuxtApp) => {
    const silentWarnings = [
        'Component <Anonymous> is missing template or render function',
        'failed to resolve component',
    ];

    // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unused-vars
    nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
        if (silentWarnings.some((warning) => msg.includes(warning))) {
            return;
        }

        console.warn(`[Vue warn]: ${msg}\n${trace}`);
    };
});
