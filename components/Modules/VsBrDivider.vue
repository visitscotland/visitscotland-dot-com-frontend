<template>
    <hr
        class="vs-divider"
        :class="variant ? `vs-divider--${variant}` : null"
    >
</template>

<script setup lang="ts">
type Props = {
    variant?: 'primary' | 'secondary' | 'inverse';
};

const { variant = 'primary' } = defineProps<Props>();
</script>

<style lang="scss">
$variants: (
    primary: #E9E9E9,
    secondary: #A3A3CC,
    inverse: #FFFFFF,
);

.vs-divider {
    border-top: 1px solid;
    margin: 1rem auto;

    @each $variant in map-keys($variants) {
        &.vs-divider--#{$variant} {
            color: map-get($variants, $variant);
        }
    }
}
</style>
