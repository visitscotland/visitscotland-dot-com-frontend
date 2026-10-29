<template>
    <div :id="module.anchor || `supplier-listing-${id}`">
        <VsBrSectionHeader
            v-if="module.title || module.copy?.value"
            :heading="module.title || ''"
            :lede="module.copy?.value || ''"
        />

        <VsContainer>
            <VsBrSupplierListing />
        </VsContainer>
    </div>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import { VsContainer } from '@visitscotland/component-library/components';
import VsBrSectionHeader from './VsBrSectionHeader.vue';
import VsBrSupplierListing from './VsBrSupplierListing.vue';

defineProps<{
    module: {
        anchor?: string,
        title?: string,
        copy?: { value?: string },
    },
}>();

const id = useId();
</script>
