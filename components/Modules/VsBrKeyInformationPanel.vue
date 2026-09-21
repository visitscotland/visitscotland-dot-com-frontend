<template>
    <div>
        <VsPanel class="key-information">
            <VsHeading
                level="2"
                heading-style="heading-s"
                no-margins
            >
                {{ module.title || 'Key Information Panel'}}
            </VsHeading>
    
            <VsBody class="d-flex flex-column flex-md-row">
                <div>
                    <ul class="key-information__highlights list-unstyled d-flex flex-column m-0 p-0 gap-075 mt-150 text-tertiary">
                        <li v-for="highlight in module.highlights" :key="highlight.category.key" class="d-flex gap-050">
                            <span class="highlight__icon-wrapper d-flex justify-content-center">
                                <VsIcon
                                    :icon="getIconName(highlight.category.key)"
                                    variant="tertiary"
                                    aria-hidden="true"
                                    size="sm"
                                />
                            </span>
                            <span class="highlight__text">
                                <span>{{ highlight.category.value }}: </span>
                                <span
                                    class="highlight__copy"
                                    v-html="highlight.copy.value"
                                />
                            </span>
                        </li>
                    </ul>
                    <!-- Desktop button -->
                    <VsButton
                        v-if="module.cta"
                        :href="module.cta.link"
                        class="key-information__cta-desktop mt-150 d-none d-sm-block"
                    >
                        {{ module.cta.label }}
                    </VsButton>
                </div>
                <div>
                    <div>
                        <!-- TODO Placeholder for map inclusion VS-1835 -->
                    </div>
                    <div>
                        <!-- Mobile button -->
                        <VsButton
                            v-if="module.cta"
                            :href="module.cta.link"
                            class="key-information__cta-mobile mt-150 d-sm-none"
                        >
                            {{ module.cta.label }}
                        </VsButton>
                    </div>
                </div>
            </VsBody>
        </VsPanel>
    </div>
</template>

<script setup lang="ts">
import {
    VsBody,
    VsButton,
    VsHeading,
    VsIcon,
    VsPanel,
} from '@visitscotland/component-library/components';
import getIconName from '~/composables/getIconName.ts';

interface KeyInformationHighlight {
    category: {
        key: string,
        value: string,
    },
    copy: {
        value: string,
    };
}

interface KeyInformationModule {
    title: string,
    cta?: {
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
    .key-information {
        max-width: 53.5rem /* 856px */;
        margin: 0 auto;
    }
    .key-information__highlights {
        color: #535396; /* Text tertiary */
        .highlight__icon-wrapper {
            min-width: 1.6rem;
        }
        /* :deep uses vue scoped css for dynamically rendered HTML */
        .highlight__copy :deep(p) {
            display: inline;
            margin: 0;
        }
    }
    .key-information__cta-desktop {
        width: fit-content;
    }
    .key-information__cta-mobile {
        width: 100%;
    }
</style>