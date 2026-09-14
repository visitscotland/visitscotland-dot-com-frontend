<template>
    <VsPanel>
        <VsHeading
            level="2"
            heading-style="heading-s"
            noMargins
        >
            {{ module.title || 'Key Information' }}
        </VsHeading>

        <VsBody class="d-flex flex-column flex-md-row">
            <div>
                <ul class="key-information__highlights list-unstyled d-flex flex-column m-0 p-0 gap-075 mt-150 text-tertiary">
                    <li v-for="highlight in module.highlights" :key="highlight.category.key" class="d-flex gap-050">
                        <span class="key-information__icon-wrapper d-flex justify-content-center">
                            <VsIcon
                                :icon="getIconName(highlight.category.key)"
                                variant="tertiary"
                                aria-hidden="true"
                            />
                        </span>
                        <span>
                            <span>{{ highlight.category.label }}:</span> {{ highlight.copy }}
                        </span>
                    </li>
                </ul>
                <VsButton class="mt-150 d-none d-md-block">{{  module.cta.label }}</VsButton>
            </div>
            <div>
                <div>
                    <!-- TODO Placeholder for map inclusion VS-1835 -->
                     map
                </div>
                <div>
                    <VsButton class="mt-150 d-md-none">{{  module.cta.label }}</VsButton>
                </div>
            </div>
        </VsBody>
    </VsPanel>
</template>

<script setup lang="ts">
import {
    VsBody,
    VsButton,
    VsHeading,
    VsIcon,
    VsPanel,
} from '@visitscotland/component-library/components';
import getIconName from '~/composables/getIconName';

interface KeyInformationHighlight {
    category: {
        key: string,
        label: string,
    },
    copy: string;
}

interface KeyInformationModule {
    title: string,
    cta: {
        label: string,
        link: string,
        type: string,
    },
    highlights: KeyInformationHighlight[]
}

defineProps<{
    module: KeyInformationModule
}>();
</script>

<style lang="css" scoped>
    .key-information__highlights {
        color: #535396; /* Text tertiary */
        .key-information__icon-wrapper {
            min-width: 1.6rem;
        }
    }
</style>