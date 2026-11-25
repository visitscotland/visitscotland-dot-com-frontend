<template>
    <div class="vs-map-unavailable">
        <VsHeading
            :id="headingId"
            level="1"
            heading-style="heading-s"
            class="vs-map-unavailable__heading mb-150"
            no-margins
        >
            {{ configStore.getLabel('map', 'map.main-map.error-cta-title') }}
        </VsHeading>
        <!-- VsWarning wraps both slots in a <p>, so only inline content
            can go in them (no headings or divs) -->
        <VsWarning
            icon="fa-regular fa-triangle-exclamation"
            class="vs-map-unavailable__warning"
            role="alert"
        >
            <strong class="vs-map-unavailable__warning-title d-block mb-100">
                {{ configStore.getLabel('map', 'map.main-map.error-title') }}
            </strong>
            {{ configStore.getLabel('map', 'map.main-map.error-copy') }}
            <template #extra-content>
                <VsButton
                    size="sm"
                    class="mb-050"
                    :href="props.ctaHref ?? configStore.getLabel('map', 'map.main-map.error-cta-link')"
                >
                    {{ configStore.getLabel('map', 'map.main-map.error-cta-title') }}
                </VsButton>
            </template>
        </VsWarning>
    </div>
</template>

<script setup lang="ts">
/**
 * Message shown in a map's sidebar when Google Maps fails to load.
 * Used by VsBrGoogleMapWithSidebar and VsBrMainMapSidebar.
 */
import {
    VsButton,
    VsHeading,
    VsWarning,
} from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = withDefaults(defineProps<{
    /**
     * Where the call to action button links to. Defaults to the
     * `map.main-map.error-cta-link` CMS label.
     */
    ctaHref?: string,
    /**
     * Optional id for the heading. Pass `main-heading` where this
     * replaces the page's main heading (e.g. the /map page).
     */
    headingId?: string,
}>(), {
    ctaHref: undefined,
    headingId: undefined,
});
</script>

<style lang="scss">
    .vs-map-unavailable {
        &__warning {
            max-width: 29.625rem; /* 474px */
        }

        // figma specifies 20px at mobile and desktop for this one
        .vs-map-unavailable__warning-title {
            font-size: 1.25rem; /* 20px */
        }
    }
</style>
