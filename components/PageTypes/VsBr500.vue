<template>
    <VsBrHeroSection
        :content="documentData"
    />

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrNewsletterSignpost
            v-if="!documentData.hideNewsletter && configStore.newsletterSignpost"
            :data="configStore.newsletterSignpost"
        />
    </NuxtLazyHydrate>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrHeroSection from '~/components/Modules/VsBrHeroSection.vue';

const configStore = useConfigStore();

let documentData : any = {
};

const page: Page | undefined = inject('page');

if (configStore.pageDocument) {
    const pageDocument = page.getContent(configStore.pageDocument);

    documentData = pageDocument.getData();
}

</script>
