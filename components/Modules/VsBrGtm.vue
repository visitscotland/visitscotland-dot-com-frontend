<template>
    <template v-if="id && !isPreviewMode">
        <noscript>
            <iframe
            :src="`https://www.googletagmanager.com/ns.html?id=${id}`"
            height="0"
            width="0"
            style="display:none;visibility:hidden"
            ></iframe>
        </noscript>
    </template>
</template>

<script lang="ts" setup>
import useConfigStore from '~/stores/configStore.ts';

/* eslint no-undef: 0 */
import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

const configStore = useConfigStore();

const page: Page | undefined = inject('page');

let id = '';

if (configStore.gtm) {
    id = configStore.gtm['gtm.container-id'];
}

let isPreviewMode = false;

if (page && page.isPreview()) {
    isPreviewMode = true;
}

// Checks if a given dataLayer event represents either Civic loading or cookie
// permissions updating, and fires off events for the component library.
const checkEvent = (event) => {
    if (event === 'cookie_permission_loaded') {
        setTimeout(() => {
            window.dispatchEvent(new Event('cookieManagerLoaded'));
        });
    }

    if (event === 'cookie_permission_changed') {
        setTimeout(() => {
            window.dispatchEvent(new Event('cookiesUpdated'));
        });
    }
};

// To avoid an awkward race condition, we need to check if civic was loaded before we find the
// datalayer, as well as listening for it being loaded afterwards.
const checkIfCivicLoaded = () => {
    for (let x = 0; x < window.dataLayer.length; x++) {
        const dataLayerEvent = window.dataLayer[x];

        const eventString = dataLayerEvent?.value?.event ?? dataLayerEvent?.event ?? '';

        checkEvent(eventString);
    }
};

const attachCivicEvents = (counter = 1) => {
    if (counter < 20) {
        if (typeof window !== 'undefined' && window.google_tag_manager) {
            checkIfCivicLoaded();

            // GTM can't call browser events directly, so we need to listen for events on the
            // datalayer and then latch our code onto those.
            const originalDataLayerPush = window.dataLayer.push;

            window.dataLayer.push = (arg) => {
                let res = null;

                if (arg && arg !== null && typeof arg !== 'undefined') {
                    res = originalDataLayerPush.apply(window.dataLayer, [arg]);

                    const eventString = arg.event || (arg.value && arg.value.event) || '';

                    checkEvent(eventString);

                    return res;
                }

                return originalDataLayerPush.apply(window.dataLayer, [arg]);
            };
        } else {
            setTimeout(() => {
                attachCivicEvents(counter + 1);
            }, 500);
        }
    }
};

if (id && !isPreviewMode) {
    // Nuxt 4.5 uses an import map for multi-app async chunks. Wait until Nuxt has
    // consumed that map before GTM is allowed to inject any additional scripts.
    onNuxtReady(() => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js',
        });

        if (!document.getElementById('vs-gtm-script')) {
            const gtmScript = document.createElement('script');

            gtmScript.id = 'vs-gtm-script';
            gtmScript.async = true;
            gtmScript.src = `/metrics/?id=${encodeURIComponent(id)}`;

            document.head.appendChild(gtmScript);
        }

        attachCivicEvents();
    });
}

if (isPreviewMode && typeof window !== 'undefined') {
    window.bypassCookiesRequired = true;
    window.bypassCookiesLoaded = true;
}

</script>
