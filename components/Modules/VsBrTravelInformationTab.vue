<template>
    <VsTabItem :title="tab.title">
        <div class="px-075 px-md-150 px-lg-300 px-xl-400 pt-200 pb-125">
            <VsAccordion>
                <VsAccordionItem
                    v-for="(row, rowIndex) in tab.travelInformationTransportRows"
                    :key="rowIndex"
                    :open-by-default="rowIndex === 0 ? true : false"
                    variant="transparent"
                    :control-id="`{accordion-item-${row.transport.key}-${rowIndex}`"
                    :class="rowIndex === 0 ? 'border-top-0' : ''"
                >
                    <template #title>
                        <VsIcon
                            :icon="`fa-regular fa-${getTransportIcon(row.transport.key)}`"
                            size="sm"
                            class="me-050"
                        />
                        {{ row.transport.label }}
                    </template>
                    <template #icon-open>
                        <VsIcon icon="fa-regular fa-chevron-up" size="sm" />
                    </template>
                    <template #icon-closed>
                        <VsIcon icon="fa-regular fa-chevron-down" size="sm" />
                    </template>
                    <div
                        class="p-075"
                        v-html="row.copy.value"
                    />
                </VsAccordionItem>
            </VsAccordion>
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

const props = defineProps<{ tab: Object }>();
const tab: any = props.tab;

const getTransportIcon = (transportKey: string): string => {
    switch (transportKey) {
    case 'dsblaccess':
        return 'wheelchair';
    case 'cycling':
        return 'person-biking';
    case 'car':
        return 'car-side';
    case 'boat':
        return 'ferry';
    case 'map-marker':
        return 'location-dot';
    case 'tram':
        return 'train-subway';
    case 'transport':
        return 'taxi-bus';
    case 'walk':
        return 'person-walking';
    default:
        return transportKey;
    }
};

</script>
