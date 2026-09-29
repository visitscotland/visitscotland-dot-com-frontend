<template>
    <VsSectionHeader
        :heading="heading"
        class="mb-200 mb-xl-300"
    >
        <template
            #section-header-lede
            v-if="lede"
        >
            <div v-html="lede" />
        </template>
    </VsSectionHeader>
</template>

<script lang="ts" setup>
import { VsSectionHeader } from '@visitscotland/component-library/components';

const props = defineProps<{
    heading: string,
    lede: string,
}>();

const { heading, lede } = props;

</script>
