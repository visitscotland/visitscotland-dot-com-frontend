<template>
    <template v-if="sameLine">
        {{ filteredAddress.join(', ') }}
    </template>

    <template v-else>
        <span v-for="(line, index) in filteredAddress" :key="index">
            {{ line }}<template v-if="index < filteredAddress.length - 1">, </template>
        </span>
    </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    address: any,
    sameLine: Boolean,
}>();

const filteredAddress = computed(() => {
    const { line1, line2, line3, city, postCode } = props.address;

    return [line1, line2, line3, city, postCode]
        .filter((line) => line !== null && line !== undefined && line !== '');
});
</script>
