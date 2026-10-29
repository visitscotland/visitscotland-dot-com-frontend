<template>
    <VsFilter
        :filter-id="props.filterId"
        :filter-label="props.filterLabel"
        @filter-updated="handleUpdate"
        ref="filter"
    >
        <slot />

        <VsFilterSection
            v-for="(group, index) in filterGroups"
            :key="index"
            :section-title="getSectionLabel(group)"
            :type="getGroupType(group)"
        >
            <template v-if="getGroupType(group) === 'list' && index === 0">
                <div
                    v-for="(listFilter, listIndex) in group"
                    :key="listIndex"
                    class="date-picker"
                >
                    <label :for="`${props.filterId}-${listFilter.key}`">
                        {{ listFilter.label }}
                    </label>
                    <div>
                        <input
                            type="date"
                            :id="`${props.filterId}-${listFilter.key}`"
                            :name="`${props.filterId}-${listFilter.key}`"
                            data-type="date"
                            :data-label="listFilter.label"
                        >
                    </div>
                </div>
            </template>
            <template v-else-if="getGroupType(group) === 'list'">
                <VsCheckbox
                    v-for="(listFilter, listIndex) in group"
                    :key="listIndex"
                    :field-name="`${props.filterId}-${listFilter.key}`"
                    :label="listFilter.label"
                    value="checked"
                    size="sm"
                    data-type="boolean"
                    :data-label="listFilter.label"
                />
            </template>
            <template v-else-if="getGroupType(group) === 'group'">
                <VsCheckbox
                    v-for="(groupFilter, groupIndex) in group[0].values"
                    :key="groupIndex"
                    :field-name="`${props.filterId}-${groupFilter.key}`"
                    :label="groupFilter.label"
                    value="checked"
                    size="sm"
                    :data-type="getSectionKey(group)"
                    :data-label="groupFilter.label"
                />
            </template>
        </VsFilterSection>
    </VsFilter>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import {
    VsFilter, VsFilterSection, VsCheckbox,
} from '@visitscotland/component-library/components';

const props = withDefaults(defineProps<{
    filters?: any[],
    filterId: string,
    filterLabel?: string,
}>(), {
    filters: () => [],
    filterLabel: 'Filters',
});

const emit = defineEmits(['filter-updated']);

const filter = ref();

const filterGroups = computed<any[][]>(() => Object.values(
    props.filters.reduce((acc: any, value: any) => {
        acc[value.group] = acc[value.group] || [];
        acc[value.group].push(value);
        return acc;
    }, Object.create(null)),
));

const getGroupType = (group: any) => {
    if (group.some((g: any) => g.type === 'DATE')) {
        return 'list';
    } if (group.some((g: any) => g.type === 'BOOLEAN')) {
        return 'list';
    } if (group.some((g: any) => g.type === 'MULTISELECT')) {
        return 'group';
    }

    return '';
};

const getSectionLabel = (group: any) => {
    if (group.some((g: any) => g.type === 'MULTISELECT')) {
        return group[0].label;
    }
    return null;
};

const getSectionKey = (group: any) => {
    if (group.some((g: any) => g.type === 'MULTISELECT')) {
        return group[0].key;
    }
    return null;
};

const resetAll = () => {
    filter.value.resetAll();
};

defineExpose({
    resetAll,
});

const cleanKey = (key: string) => key.slice(props.filterId.length + 1);

// Format date from 'YYYY-mm-dd' to 'dd/mm/YYYY'.
const formatDate = (value: string) => value.split('-').reverse().join('/');

// set and emit a payload when a filter input changes.
// This payload will be used by the parent to set the selected filters list and api query parameters.
const handleUpdate = (event: Event) => {
    const target = event.target as HTMLInputElement | null;
    if (!target?.dataset.type) return;

    const type = target.dataset.type;
    const fieldId: string = target.id;

    let key: string = cleanKey(target.id);
    let label = target.dataset.label || '';
    let value: string | boolean;

    if (type === 'date') {
        value = formatDate(target.value);
        label = `${label}: ${value}`;
    } else if (type === 'boolean') {
        value = !!target.checked;
    } else {
        key = type;
        value = cleanKey(target.id);
    }

    emit('filter-updated', {
        fieldId,
        key,
        label,
        type,
        value,
    });
};
</script>

<style lang="scss">
.vs-filter {
    .date-picker {
        margin-bottom: 0.75rem;
    }
}
</style>
