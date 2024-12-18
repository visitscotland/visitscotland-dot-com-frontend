<template>
    <!-- TODO - no-js label, default search values-->
    <VsProductSearch
        no-js-message=""
        v-bind="$attrs"
    >
        <template #vs-module-heading>
            {{ productSearch.title }}
        </template>

        <template #vs-module-intro>
            {{ productSearch.description }}
        </template>
    </VsProductSearch>
</template>

<script lang="ts" setup>

import useConfigStore from '~/stores/configStore.ts';

import { VsProductSearch } from '@visitscotland/component-library/components';

const configStore = useConfigStore();

const productSearch : any = configStore.productSearch;

</script>
