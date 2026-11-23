<template>
    <div class="vs-map-unavailable">
        <VsHeading
            :id="headingId"
            level="1"
            heading-style="heading-s"
            class="vs-map-unavailable__heading mb-150"
            no-margins
        >
            {{ mapUnavailableTitle }}
        </VsHeading>
        <VsPanel
            variant="information"
            class="vs-map-unavailable__panel p-125 rounded-0"
            role="alert"
        >
            <div class="d-flex flex-column flex-sm-row">
                <VsIcon
                    icon="fa-regular fa-triangle-exclamation"
                    size="sm"
                    class="me-125 mt-025 mb-050"
                    variant="highlight"
                />
                <div>
                    <VsHeading
                        level="2"
                        heading-style="heading-xxs"
                        class="vs-map-unavailable__panel-title mb-100"
                        no-margins
                    >
                        {{ mapUnavailablePanelTitle }}
                    </VsHeading>
                    <VsBody>
                        {{ mapUnavailableMessage }}
                    </VsBody>
                    <VsButton
                        size="sm"
                        class="mt-125 mb-050"
                        :href="ctaHref"
                    >
                        {{ mapUnavailableButtonCTA }}
                    </VsButton>
                </div>
            </div>
        </VsPanel>
    </div>
</template>

<script setup lang="ts">
/**
 * Message shown in a map's sidebar when Google Maps fails to load.
 * Used by VsBrGoogleMapWithSidebar and VsBrMainMapSidebar.
 */
import {
    VsBody,
    VsButton,
    VsHeading,
    VsIcon,
    VsPanel,
} from '@visitscotland/component-library/components';

withDefaults(defineProps<{
    /** Where the call to action button links to. */
    ctaHref?: string,
    /**
     * Optional id for the heading. Pass `main-heading` where this
     * replaces the page's main heading (e.g. the /map page).
     */
    headingId?: string,
}>(), {
    ctaHref: '#section-1',
    headingId: undefined,
});

// TODO: move to CMS labels
const mapUnavailableTitle = 'Explore Scotland';
const mapUnavailablePanelTitle = 'Map temporarily unavailable';
const mapUnavailableMessage = 'We\'re having trouble displaying the map at the moment. '
    + 'You can still explore Scotland using search, navigation and destination pages '
    + 'while we work to restore the map.';
const mapUnavailableButtonCTA = 'Explore Scotland\'s Destinations';
</script>

<style lang="scss">
    .vs-map-unavailable {
        &__panel {
            max-width: 29.625rem; /* 474px */
        }

        // figma specifies 20px at mobile and desktop for this one
        .vs-map-unavailable__panel-title {
            font-size: 1.25rem; /* 20px */
        }
    }
</style>
