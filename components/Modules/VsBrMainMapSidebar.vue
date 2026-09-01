<!-- eslint-disable vue/component-name-in-template-casing -->
<template>
    <div
        class="vs-map-sidebar"
        ref="sidebar"
        :style="sidebarStyle"
        @pointerdown="startDrag"
        @pointermove="onDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
    >
        <div
            v-show="props.mapLoaded"
            class="vs-map-sidebar__panel1"
        >
            <div class="vs-map-sidebar__handle">
                <VsButton
                    variant="subtle"
                    @click="isOpen = !isOpen"
                >
                    <div class="vs-map-sidebar__handle-bar" />
                    <span class="sr-only">
                        {{ configStore.getLabel('map', 'map.open-panel') }}
                    </span>
                </VsButton>
            </div>

            <div class="vs-map-sidebar__content">
                <div class="vs-map-sidebar__section1">
                    <VsHeading
                        class="flex-grow-1"
                        data-test="vs-map-sidebar__heading"
                        heading-style="heading-xxs"
                        id="vs-map-sidebar__heading"
                        level="1"
                        no-margins
                    >
                        {{ props.heading }}
                    </VsHeading>

                    <div class="vs-map-sidebar__input d-flex mt-050 mb-050">
                        <VsInput
                            :aria-label="configStore.getLabel('map', 'map.search-map')"
                            autocomplete="off"
                            class="vs-map-sidebar__input flex-grow-1"
                            data-test="vs-map-search-input"
                            field-name="vs-map-search-input"
                            :placeholder="configStore.getLabel('map', 'map.placeholder')"
                            ref="search-input"
                            :value="mainMapStore.searchTerm"
                            @input="mainMapStore.searchTerm = $event.target.value"
                            @keyup.enter="emit('search-input-changed')"
                        />
                        <VsButton
                            class="vs-map-sidebar__search-button"
                            data-test="vs-map-sidebar__search-button"
                            icon="vs-icon-control-search"
                            icon-only
                            :rounded="false"
                            size="lg"
                            @click="emit('search-input-changed')"
                        >
                            {{ configStore.getLabel('map', 'map.search') }}
                        </VsButton>
                    </div>

                    <a
                        v-if="mainMapStore.query || mapCategoryStore.selectedCategory"
                        class="d-block"
                        href="#"
                        data-test="vs-map-sidebar__reset-map"
                        @click.prevent="emit('reset-map')"
                        @keyup.enter.prevent="emit('reset-map')"
                    >
                        {{ configStore.getLabel('map', 'map.clear') }}
                    </a>
                </div>

                <div class="vs-map-sidebar__section2">
                    <div v-if="mainMapStore.showDestinations && mapCategoryStore.featuredDestinationTypes">
                        <VsBrMainMapFilter
                            :detail-text="configStore.getLabel('map', 'locationSelect')"
                            has-icons
                            :items="mapCategoryStore.featuredDestinationTypes"
                            :selected-category="mapCategoryStore.selectedDestinationType"
                            @changed="(id) =>
                                handleDestinationTypeClick(id)"
                        />
                    </div>

                    <div v-if="mainMapStore.showCategories">
                        <VsBrMainMapFilter
                            has-icons
                            :items="filteredCategories"
                            :selected-category="mapCategoryStore.selectedCategory"
                            @changed="(id) =>
                                mapCategoryStore.selectCategory(id)"
                        />

                        <VsBrMainMapFilter
                            v-if="mapCategoryStore.selectedCategory && availableSubcategories.length"
                            :detail-text="configStore.getLabel('map', 'map.sub-filter')"
                            :items="availableSubcategories"
                            :selected-category="mapCategoryStore.selectedSubcategories"
                            @changed="(id) =>
                                mapCategoryStore.toggleSubcategory(id)"
                        />
                    </div>
                </div>

                <div class="vs-map-sidebar__section3">
                    <div class="vs-map-sidebar__search-results">
                        <VsHeading
                            v-if="mainMapStore.query || mapCategoryStore.selectedCategory"
                            data-test="vs-map-sidebar__search-result-query"
                            heading-style="heading-xxxs"
                            level="2"
                        >
                            {{ configStore.getLabel('map', 'map.search-results') }}
                            "{{ mainMapStore.query || mapCategoryStore.selectedCategory }}"
                        </VsHeading>

                        <a
                            v-if="mainMapStore.query || mapCategoryStore.selectedCategory"
                            href="#"
                            data-test="vs-map-sidebar__hard-reset-map"
                            @click.prevent="emit('reset-location')"
                            @keyup.enter.prevent="emit('reset-location')"
                        >
                            {{ configStore.getLabel('map', 'resetLocation') }}
                        </a>
                        
                        <div class="vs-map-sidebar__google-maps-container">
                            <!-- @Slot to contain Google Maps Places
                                UI Kit Search Results/Details components -->
                            <slot name="vs-map-sidebar-search-results" />
                        </div>
                    </div>

                    <VsRow
                        v-if="mainMapStore.showDestinations"
                        class="vs-map__destinations"
                    >
                        <VsBrMainMapFeaturedLocation
                            v-for="destination in mapCategoryStore.filteredDestinations"
                            :key="destination.properties.id"
                            :place="destination"
                        />
                    </VsRow>
                </div>
            </div>
        </div>

        <div v-show="isResultsOpen" class="vs-map-sidebar__panel2">
            <div class="vs-map-sidebar__handle">
                <VsButton
                    variant="subtle"
                    @click="isOpen = !isOpen"
                >
                    <div class="vs-map-sidebar__handle-bar" />
                    <span class="sr-only">
                        {{ configStore.getLabel('map', 'map.open-panel') }}
                    </span>
                </VsButton>
            </div>

            <div class="vs-map-detail-container">
                <VsButton
                    class="vs-map-detail-container__dismiss"
                    data-test="vs-map-detail-container__dismiss"
                    icon="vs-icon-control-dismiss"
                    icon-only
                    variant="subtle"
                    @click="isResultsOpen = false"
                >
                    {{ configStore.getLabel('map', 'map.close-panel') }}
                </VsButton>

                <gmp-place-details
                    v-show="showPlaceDetails"
                    id="placeDetails"
                >
                    <gmp-place-details-place-request
                        id="placeRequest"
                        ref="place-request"
                    />
                    <gmp-place-content-config>
                        <gmp-place-address />
                        <gmp-place-rating />
                        <gmp-place-type />
                        <gmp-place-price />
                        <gmp-place-accessible-entrance-icon />
                        <gmp-place-opening-hours />
                        <gmp-place-website />
                        <gmp-place-phone-number />
                        <gmp-place-summary />
                        <gmp-place-type-specific-highlights />
                        <gmp-place-reviews />
                        <gmp-place-feature-list />
                        <gmp-place-media lightbox-preferred />
                        <gmp-place-attribution
                            light-scheme-color="gray"
                            dark-scheme-color="gray"
                        />
                    </gmp-place-content-config>
                </gmp-place-details>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    computed,
    useTemplateRef,
    watch,
} from 'vue';
import {
    VsButton,
    VsHeading,
    VsInput,
    VsRow,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';
import useMainMapStore from '~/stores/mainMap.ts';
import useMapCategoryStore from '~/stores/mapCategory.ts';
import useSwipeDrawer from '~/composables/mainMap/useSwipeDrawer.ts';
import VsBrMainMapFeaturedLocation from './VsBrMainMapFeaturedLocation.vue';
import VsBrMainMapFilter from './VsBrMainMapFilter.vue';
import type { MapLabels } from '~/types/main-map-types.ts';

type Props = {
    /** Sidebar heading */
    heading: string;
    /** Whether the map is loaded or not. */
    mapLoaded?: boolean;
    /** Selected google maps result. */
    place?: google.maps.places.Place | null;
};

const props = withDefaults(defineProps<Props>(), {
    mapLoaded: false,
    place: undefined,
});

// Two-way binding for sidebar open/close state.
const isOpen = defineModel<boolean>('isOpen', {
    default: false,
});

// Two-way binding for results panel open/close state.
const isResultsOpen = defineModel<boolean>('isResultsOpen', {
    default: false,
});

const emit = defineEmits<{
    'destination-type-selected': [],
    'reset-location': [],
    'reset-map': [],
    'search-input-changed': [],
}>();

const sidebar = useTemplateRef('sidebar');
const placeRequest = useTemplateRef('place-request');

// Set the placeRequest value when a place has been selected.
watch(() => props.place, (place) => {
    if (!place || !placeRequest.value) return;

    placeRequest.value.place = place;
});

const configStore = useConfigStore();
const mainMapStore = useMainMapStore();
const mapCategoryStore = useMapCategoryStore();
const {
    endDrag,
    onDrag,
    startDrag,
    sidebarStyle,
} = useSwipeDrawer(isOpen, sidebar);

/**
 * Filter the categories to ignore the cmsData.
 */
const filteredCategories = computed(() =>
    mapCategoryStore.categoryLabelData.filter(
        (category: MapLabels) => !category.cmsData,
    ),
);

/**
 * set the subcategories based on the selected category.
 */
const availableSubcategories = computed(() => {
    const category = mapCategoryStore.categoryLabelData.find(
        (category: MapLabels) => category.id === mapCategoryStore.selectedCategory,
    );

    return category?.subCategory ?? [];
});

// Show places-details when a place has been selected.
const showPlaceDetails = computed(() => !!props.place);

function handleDestinationTypeClick(id: string) {
    mapCategoryStore.selectedDestinationType = id;
    emit('destination-type-selected');
}
</script>

<style lang="scss">
html.map-page,
body.map-page {
    height: 100%;
    overflow: hidden;
    overscroll-behavior-y: none;
}

.vs-map-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    
    @media (max-width: 768px) {
        height: 91dvh;
        max-height: 900px;
        min-height: 400px;
        overscroll-behavior: contain;
        top: auto;
        right: 0;
        bottom: 0;
        touch-action: none;
        width: 100vw;
    }

    @media (min-width: 768px) {
        display: flex;
        gap: 1rem;
        max-height: 85dvh;
        position: absolute;
        top: 1rem;
        left: 1rem;
    }

    &__panel1,
    &__panel2 {
        background: #FFFFFF;
        border-radius: 1rem 1rem 0 0;
        box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.30), 0px 1px 3px 1px rgba(0,0,0,0.15);
        overflow: hidden;
        padding: 0.75rem 1.25rem 1.75rem;

        @media (min-width: 768px) {
            border-radius: 1rem;
            overflow: auto;
            padding: 1.25rem;
            width: 23.3rem;
        }

        @media (max-width: 768px) {
            height: 100%;
        }
    }

    &__panel2 {
        @media (max-width: 768px) {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            z-index: 50;
        }
    }

    &__handle {
        display: flex;
        justify-content: center;
        padding: 0 0.75rem 0.75rem 0.75rem;
        touch-action: none;

        @media (min-width: 768px) {
            display: none;
        }
    }

    &__handle-bar {
        background: #A8308C;
        border-radius: 1rem;
        height: 4px;
        touch-action: none;
        width: 48px;
    }

    &__input input {
        margin: 0;
        border-radius: 0.5rem 0 0 0.5rem;
        border-right: none;
        height: 52px;
    }

    &__search-button {
        flex-grow: 0.125;
        border-radius: 0 0.5rem 0.5rem 0;
    }

    &__content {
        display: flex;
        flex-direction: column;
        height: 100%;
        
        .vs-map-sidebar__section1,
        .vs-map-sidebar__section2 {
            flex-shrink: 0;
        }

        .vs-map-sidebar__section3 {
            flex: 1;
            margin-bottom: 0.5rem;
            overflow: hidden auto;
        }
    }
}

.vs-map-detail-container {
    height: 100%;
    overflow: auto;
    position: relative;

    @media (max-width: 768px) {
        padding-bottom: 4rem;
    }

    &__dismiss {
        position: absolute !important;
        right: 1rem;
        z-index: 1001;
    }

    gmp-place-details {
        border: none;
    }
}
</style>
