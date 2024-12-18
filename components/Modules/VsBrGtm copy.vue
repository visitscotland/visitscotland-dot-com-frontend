<template>
    <template v-if="id">
        <noscript>
            <iframe
            :src="`https://www.googletagmanager.com/ns.html?id=${id}${queryString}`"
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
let queryString = '';

if (configStore.gtm) {
    id = configStore.gtm['gtm.container-id'];
    queryString = configStore.gtm['gtm.is-production'] === 'true'
        ? ''
        : configStore.gtm['gtm.preview-query-string'];
}

if (id) {
    useHead({
        script: [
            `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '${queryString}';f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${id}');`,
        ],
    });
}

if (page && page.isPreview() && window) {
    window.bypassCookieChecks = true;
}

</script>
