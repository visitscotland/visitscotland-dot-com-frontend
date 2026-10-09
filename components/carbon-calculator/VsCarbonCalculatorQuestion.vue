<template>
    <div
        :class="fieldClass"
        class="vs-carbon-calculator-question"
        data-test="vs-carbon-calculator-question"
    >
        <label class="vs-carbon-calculator-question__label mb-200" :for="fieldName">
            {{ label }}
        </label>
        <VsRadioButton
            v-if="fieldType === 'radio'"
            :field-name="fieldName"
            :options="options"
            :required="true"
            :hint-text="hint"
            @update-field-data="emit('updateFieldData', $event)"
        />
        <VsNumberInput
            v-else
            :field-name="fieldName"
            :increment-controls="true"
            :value="0"
            :minimum-number="minimum"
            :maximum-number="maximum"
            :hint-text="hint"
            @updated="emit('updateFieldData', $event)"
        />
    </div>
</template>

<script lang="ts" setup>
import { VsNumberInput, VsRadioButton } from '@visitscotland/component-library/components';
import type { CarbonFieldUpdate, CarbonOption } from '~/types/carbon-calculator';

withDefaults(defineProps<{
    label: string,
    hint?: string,
    fieldClass: string,
    fieldType: 'radio' | 'number',
    fieldName: string,
    options: CarbonOption[],
    minimum?: number,
    maximum?: number,
}>(), {
    hint: '',
    minimum: 0,
    maximum: 0,
});

const emit = defineEmits<{ updateFieldData: [data: CarbonFieldUpdate], }>();
</script>

<style scoped>
.vs-carbon-calculator-question { margin-bottom: 1.5rem; }
.vs-carbon-calculator-question__label { display: block; width: 100%; font-weight: 600; }
</style>
