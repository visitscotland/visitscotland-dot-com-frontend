<template>
    <VsCannedSearch
        :api-url="module.cannedSearchEndpoint"
        :search-type="module.productType"
        :carousel-next-text="configStore.getLabel('essentials.pagination', 'page.next')"
        :carousel-previous-text="configStore.getLabel('essentials.pagination', 'page.previous')"
        :heading="module.title"
    >
        <template
            #vs-canned-search-intro
            v-if="module.description"
        >
            <VsBrRichText :input-content="module.description.value" />
        </template>

        <template
            #vs-canned-search-buttons
            v-if="module.viewAllLink"
        >
            <VsButton
                :href="module.viewAllLink.link"
            >
                {{ module.viewAllLink.label }}
            </VsButton>
        </template>

        <template
            #vs-canned-search-credit
            v-if="module.credit"
        >
            {{ module.credit }}
        </template>

        <template #vs-canned-search-of>
            {{ configStore.getLabel('essentials.pagination', 'page.of') }}
        </template>
    </VsCannedSearch>
</template>

<script lang="ts" setup>

import {
    VsCannedSearch,
    VsButton,
} from '@visitscotland/component-library/components';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{ module: Object }>();
const module: any = props.module;

</script>
