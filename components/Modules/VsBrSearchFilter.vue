<template>
    <div class="vs-search-filter">
        <VsBody
            v-if="heading"
            class="vs-search-filter__header mb-025 ms-025"
        >
            {{ heading }}
        </VsBody>

        <div class="vs-search-filter__scroll-container">
            <VsButton
                v-if="displayScrollButtons"
                :aria-label="scrollButtonLeftText"
                class="vs-search-filter__scroll-button me-050"
                icon="fa-regular fa-chevron-left"
                icon-only
                variant="secondary"
                @click="scroll('left')"
            >
                {{ scrollButtonLeftText }}
            </VsButton>

            <div
                class="vs-search-filter__scroll-rail"
                :class="filterClasses()"
                :id="`vs-search-filter__scroll-rail--${variant}`"
                ref="scrollRail"
            >
                <VsButton
                    v-for="item in sortedItems"
                    :key="item.Key"
                    class="vs-search-filter__category-button"
                    :href="isSearchWidget ? `${configStore.globalSearchPath}?category=${item.Key}` : null"
                    :icon="variant === 'primary' ? itemIconMap[item.Key] : null"
                    :size="variant === 'secondary' ? 'sm' : 'md'"
                    :variant="isActive(item.Key) ? 'primary' : 'secondary'"
                    @click="!isSearchWidget ? $emit('filter-updated', item) : null"
                >
                    {{ item.Label || item.Key }}
                </VsButton>
            </div>

            <VsButton
                v-if="displayScrollButtons"
                :aria-label="scrollButtonRightText"
                class="vs-search-filter__scroll-button ms-050"
                icon="fa-regular fa-chevron-right"
                icon-only
                variant="secondary"
                @click="scroll('right')"
            >
                {{ scrollButtonRightText }}
            </VsButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { VsBody, VsButton } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

type FilterCategory = {
    Key: string;
    Label: string;
    icon?: string;
};

type Props = {
    activeFilter?: string | string[];
    displayScrollButtons?: boolean;
    filterCategories: FilterCategory[];
    heading?: string;
    isSearchWidget?: boolean;
    scrollButtonLeftText?: string;
    scrollButtonRightText?: string;
    variant?: 'primary' | 'secondary';
    wrap?: boolean;
};

const {
    activeFilter,
    displayScrollButtons = false,
    filterCategories,
    heading,
    isSearchWidget = false,
    scrollButtonLeftText,
    scrollButtonRightText,
    variant = 'primary',
    wrap = false,
} = defineProps<Props>();

defineEmits(['filter-updated']);

// Defines the scroll rail from the Template
const scrollRail = ref(null);

// Map filter categories to an icon.
const itemIconMap: { [key: string]: string; } = {
    accommodation: 'fa-regular fa-bed',
    'active-adventure': 'fa-kit fa-vs-landscape',
    'city-break': 'fa-regular fa-city',
    'culture-history': 'fa-regular fa-chess-rook',
    events: 'fa-regular fa-calendar-range',
    'family-friendly': 'fa-regular fa-family',
    'food-drink': 'fa-regular fa-utensils',
    'nature-outdoors': 'fa-regular fa-leaf',
    tours: 'fa-regular fa-binoculars',
    'travel-information': 'fa-regular fa-circle-info',
    wellness: 'fa-regular fa-spa',
};

function isActive(category: string) {
    if (typeof activeFilter === 'string') {
        return activeFilter === category;
    }

    if (activeFilter && typeof activeFilter === 'object') {
        return activeFilter.includes(category);
    }

    return false;
}
/**
 * This is not the best solution by any means
 * There is a better solution that doesn't rely on JS,
 * but is not stable across all browsers yet.
 * We should look to implement it, if we chose to keep it,
 * when it does become stable on Safari & Firefox.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/::scroll-button
*/
function scroll(dir: 'left' | 'right') {
    if (dir === 'left') scrollRail.value?.scrollBy(-200, 0);
    else if (dir === 'right') scrollRail.value?.scrollBy(200, 0);
}

function resetScroll() {
    scrollRail.value?.scrollTo(0, 0);
}

defineExpose({
    resetScroll,
});

function filterClasses() {
    return [
        `vs-search-filter__scroll-rail--${variant}`,
        wrap ? 'vs-search-filter__scroll-rail--wrap' : '',
    ];
}

const sortedItems = computed(() => {
    const sortedArr = [...filterCategories];

    return sortedArr.sort((a, b) => {
        const aValue = (a.Label || a.Key || '').toLowerCase();
        const bValue = (b.Label || b.Key || '').toLowerCase();

        if (aValue < bValue) {
            return -1;
        }
        if (aValue > bValue) {
            return 1;
        }

        return 0;
    });
});
</script>

<style lang="scss">
.vs-search-filter {
    &__header {
        font-weight: 600;
    }

    &__scroll-container {
        display: flex;
    }

    &__scroll-rail {
        align-items: center;
        display: flex;
        overflow-x: auto;
        padding: 0.25rem;
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
        }

        &--primary {
            column-gap: 0.75rem;
            row-gap: 0.75rem
        }

        &--secondary {
            column-gap: 0.50rem;
            margin-top: 0.25rem;
        }

        &--wrap {
            @media (min-width: 992px) {
                overflow-x: hidden;
                scroll-snap-type: none;
                flex-wrap: wrap;
                row-gap: 0.50rem;

                .vs-search-filter__category-button {
                    margin-bottom: 0;

                     @media (max-width: 992px) {
                        margin-bottom: 1rem;
                     }
                }
            }
        }

        @media (prefers-reduced-motion: no-preference) {
            scroll-behavior: smooth;
        }
    }

    &__scroll-button {
        aspect-ratio: 1/1;
        flex: 0 0 max-content;
        margin-top: 0.25rem;
    }

    &__category-button {
        flex: 0 0 content;
        height: min-content;
        margin-bottom: 1rem;
    }
}
</style>
