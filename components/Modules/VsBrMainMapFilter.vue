<template>
    <div class="vs-map-filter">
        <VsDetail
            v-if="props.detailText"
            color="secondary"
            size="small"
        >
            {{ props.detailText }}
        </VsDetail>

        <div class="vs-map-filter__buttons">
            <VsButton
                v-for="(item, index) in props.items"
                :key="item.id"
                :icon="props.hasIcons ? iconMap[item.id] : undefined" 
                size="sm"
                :variant="setButtonVariant(item.id)"
                @click="$emit('changed', {id: item.id, key: index })"
            >
                {{ item.label }}
            </VsButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    VsButton,
    VsDetail,
} from '@visitscotland/component-library/components';

type Item = {
    id: string;
    label: string;
};

type Props = {
    detailText?: string;
    hasIcons?: boolean;
    items: Item[];
    selectedCategory: string | string[] | undefined;
};

type Icon = Record<string, string>;

const props = withDefaults(defineProps<Props>(), {
    detailText: undefined,
    hasIcons: false,
});

defineEmits<{
    changed: [{
        id: string;
        key: number | string;
    }],
}>();

/**
 * Set the button variant depending on if the category has been selected.
 * The button should be `secondary` unless it has been selected, then it will
 * be `primary`
 * 
 * @param {string} id - id of the category. 
 */
function setButtonVariant(id: string) {
    if (!props.selectedCategory) return 'secondary';

    if (typeof props.selectedCategory === 'string') {
        return props.selectedCategory === id ? 'primary' : 'secondary';
    } else {
        return props.selectedCategory.includes(id) ? 'primary' : 'secondary';
    }
};

// Object to map the category id to an icon for the button.
const iconMap: Icon = {
    cities: 'fa-regular fa-city',
    regions: 'fa-regular fa-map-location-dot',
    islands: 'fa-regular fa-island-tropical',
    towns: 'fa-regular fa-house-chimney-window',
    'national-parks': 'fa-kit fa-vs-icon-national-park',
    'things-to-do': 'fa-kit fa-vs-landscape',
    accommodation: 'fa-regular fa-bed',
    'food-drink': 'fa-regular fa-cutlery',
    'travel-information': 'fa-regular fa-circle-info',
};
</script>

<style lang="scss">
.vs-map-filter__buttons {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;

    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-track {
        background: #F2F2F8;
        border-radius: 0.25rem;
    }

    &::-webkit-scrollbar-thumb {
        background: #1F49D6;
        border-radius: 0.25rem;
        cursor: grab;
    }

    &::-webkit-scrollbar-track {
        margin: 0 1rem 0 0;
    }

    column-gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.25rem 0.75rem;
    pointer-events: all;

    .vs-button {
        flex: 0 0 max-content;
    }
}
</style>
