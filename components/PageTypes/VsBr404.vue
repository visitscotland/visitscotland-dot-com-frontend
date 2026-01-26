<template>
    <VsBrPageIntro
        :content="documentData"
        :light-background="true"
    />
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrPageIntro from '~/components/Modules/VsBrPageIntro.vue';

const configStore = useConfigStore();

let documentData : any = {
};

const page: Page | undefined = inject('page');

if (configStore.pageDocument) {
    const pageDocument = page.getContent(configStore.pageDocument);

    documentData = pageDocument.getData();
}

</script>
