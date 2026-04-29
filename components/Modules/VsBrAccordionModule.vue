<template>
    <VsSectionHeader
        :heading="title"
        class="mb-250 mt-250"
    >
        <template
            #:section-header-lede
            v-if="introduction.value"
        >
            <div v-html="introduction.value" />
        </template>
    </VsSectionHeader>

    <VsContainer>
        <VsCol class="col-md-8">
            <VsAccordion>
                <VsAccordionItem
                    v-for="(item, index) in sections"
                    :key="index"
                    :control-id="`${props.idPrefix}${index}`"
                    :heading-level="3"
                    variant="subtle"
                >
                    <template #title>
                        {{ item.heading }}
                    </template>
                    <template #icon-open>
                        <VsIcon icon="fa-regular fa-chevron-up" size="sm" />
                    </template>
                    <template #icon-closed>
                        <VsIcon icon="fa-regular fa-chevron-down" size="sm" />
                    </template>
                    <div class="p-075">
                        <VsBody>
                            <VsBrRichText :input-content="item.copy.value" />
                        </VsBody>
                    </div>
                </VsAccordionItem>
            </VsAccordion>
        </VsCol>
    </VsContainer>
</template>

<script setup lang="ts">
import {
    VsAccordion,
    VsAccordionItem,
    VsContainer,
    VsSectionHeader,
    VsCol,
    VsBody,
    VsIcon,
} from '@visitscotland/component-library/components';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

const props = defineProps<{
    idPrefix: string,
    module: any,
}>();

const {
    anchor,
    introduction,
    nested,
    sections,
    themeValue,
    title,
} = props.module;
</script>
