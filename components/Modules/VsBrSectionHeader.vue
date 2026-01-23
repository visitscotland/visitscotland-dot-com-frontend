<template>
    <VsSectionHeader
        :heading="heading"
    >
        <template #section-header-lede>
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
