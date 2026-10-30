<template>
    <VsContainer :id="`supplier-listing-${id}`">
        <VsBrSupplierListing />
    </VsContainer>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import VsBrSupplierListing from './VsBrSupplierListing.vue';

import { VsContainer } from '@visitscotland/component-library/components';


const id = useId();
</script>
