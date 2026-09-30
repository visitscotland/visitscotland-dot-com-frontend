<template>
    <VsTabItem :title="props.tab.title">
        <div class="px-075 px-md-150 px-lg-300 px-xl-400 pt-200 pb-125">
            <VsAccordion v-if="props.tab.type === 'transport'">
                <VsAccordionItem
                    v-for="(row, rowIndex) in transportContent"
                    :key="rowIndex"
                    :open-by-default="Number(rowIndex) === 0"
                    variant="transparent"
                    :control-id="`accordion-item-tab-${props.tabIndex}-${row.transport.key}-${rowIndex}`"
                    :class="Number(rowIndex) === 0 ? 'border-top-0' : ''"
                >
                    <template #title>
                        <VsIcon
                            :icon="getDMSIconName(row.transport.key)"
                            size="sm"
                            class="me-050 pt-050 pb-025"
                        />
                        {{ row.transport.label }}
                    </template>
                    <template #icon-open>
                        <VsIcon icon="fa-regular fa-chevron-up" size="sm" />
                    </template>
                    <template #icon-closed>
                        <VsIcon icon="fa-regular fa-chevron-down" size="sm" />
                    </template>
                    <div class="p-075">
                        <VsBrRichText :input-content="row.copy.value" />
                    </div>
                </VsAccordionItem>
            </VsAccordion>

            <div v-else-if="articleContent">
                <VsBrRichText :input-content="articleContent.value" />
            </div>
        </div>
    </VsTabItem>
</template>

<script lang="ts" setup>
import {
    VsTabItem,
    VsAccordion,
    VsAccordionItem,
    VsIcon,
} from '@visitscotland/component-library/components';

import type { TravelInformation } from '~/types/types';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

type Props = {
    tab: TravelInformation,
    tabIndex: string | number,
};

const props = defineProps<Props>();

const transportContent = computed(() => {
    if (props.tab.type !== 'transport') return [];

    return props.tab.practicalInformationContent;
});

const articleContent = computed(() => {
    if (props.tab.type !== 'article') return null;

    return props.tab.practicalInformationContent;
});
</script>
