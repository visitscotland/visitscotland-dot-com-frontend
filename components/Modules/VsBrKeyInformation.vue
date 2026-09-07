<template>
    <VsPanel>
        <VsHeading
            level="2"
            heading-style="heading-s"
        >
            Key Information
        </VsHeading>

        <VsBody>
            Hello, Key Information Panel! This is a placeholder for content.
        </VsBody>
    </VsPanel>
</template>

<script setup lang="ts">
import {
    VsBody,
    VsHeading,
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
</script>