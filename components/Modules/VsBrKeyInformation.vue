<template>
    <VsPanel>
        <VsHeading
            level="2"
            heading-style="heading-s"
        >
            {{ module.title || 'Key Information' }}
        </VsHeading>

        <VsBody>
            <div>
                <ul class="list-unstyled d-flex flex-column m-0 p-0 gap-075">
                    <li v-for="highlight in module.highlights" :key="highlight.category.key" class="d-flex gap-050">
                        <VsIcon
                            icon="vs-icon-control-dismiss"
                            aria-hidden="true" />
                        <span>
                            <span>{{ highlight.category.label }}:</span> {{ highlight.copy }}
                        </span>
                    </li>
                </ul>
                <VsButton>{{  module.cta.label }}</VsButton>
            </div>
            <div>
                <!-- TODO Placeholder for map inclusion VS-1835 -->
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