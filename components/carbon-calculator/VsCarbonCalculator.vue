<template>
    <div class="vs-carbon-calculator__wrapper">
        <VsContainer class="vs-carbon-calculator" data-test="vs-carbon-calculator">
            <VsRow v-if="!loadError" class="vs-carbon-calculator__survey">
                <VsCol>
                    <VsCarbonCalculatorIntro v-if="activeStage === 0" :labels-map="labelsMap" />
                    <form v-else @submit.prevent>
                        <fieldset>
                            <VsProgressBar
                                ref="progress"
                                :max="formData.stages"
                                :current-step="Math.min(activeStage, formData.stages)"
                                :is-stepped="true"
                                :is-full="activeStage > formData.stages"
                                :progress-label="labelsMap.progress"
                            />
                            <div v-show="activeStage <= formData.fields.length">
                                <VsHeading v-if="currentCategory" level="2" heading-style="heading-m">
                                    {{ currentCategory }}
                                </VsHeading>
                                <VsCarbonCalculatorQuestion
                                    v-for="(field, index) in formData.fields"
                                    v-show="field.stage === activeStage"
                                    :key="field.name"
                                    :ref="element => setQuestionRef(element, field.stage)"
                                    tabindex="-1"
                                    :label="questionLabel(field, index)"
                                    :hint="questionHint(field, index)"
                                    :field-class="conditionalElementClass(field.name)"
                                    :field-type="field.element"
                                    :field-name="field.name"
                                    :options="questionOptions(field, index)"
                                    :minimum="field.validation?.min || 0"
                                    :maximum="field.validation?.max || 0"
                                    @update-field-data="updateFieldData"
                                />
                            </div>
                        </fieldset>
                    </form>
                    <VsButton
                        v-if="isRepeatable(activeStage)"
                        class="my-100"
                        variant="secondary"
                        icon="fa-regular fa-plus"
                        @click="duplicateCurrentStage"
                    >
                        {{ activeStageRepeatable }}
                    </VsButton>
                    <VsCarbonCalculatorTip v-if="currentTip" :labels-map="labelsMap" :tip="currentTip" />
                </VsCol>
                <VsCol cols="12">
                    <VsCarbonCalculatorRunningTotal
                        v-if="activeStage > 0 && activeStage <= formData.stages"
                        :labels-map="labelsMap"
                        :total-kilos="totalKilos"
                        :language="language"
                    />
                    <VsCarbonCalculatorResults
                        v-if="activeStage > formData.stages"
                        :labels-map="labelsMap"
                        :total-kilos="totalKilos"
                        :transport-kilos="transportKilos"
                        :food-kilos="foodKilos"
                        :accommodation-kilos="accommodationKilos"
                        :stay-duration="stayDuration"
                        :comparison-replacements="formData.comparisonReplacements"
                        :language="language"
                    />
                </VsCol>
                <VsCol v-if="!loading" cols="12" class="vs-carbon-calculator__actions">
                    <VsButton v-if="activeStage === 0" variant="primary" @click="forwardPage">
                        {{ labelsMap.begin }}
                    </VsButton>
                    <VsButton v-if="activeStage > 1 && activeStage <= formData.stages" variant="secondary" @click="backwardPage">
                        {{ labelsMap.previous }}
                    </VsButton>
                    <VsButton v-if="activeStage > 0 && activeStage < formData.stages" variant="primary" :disabled="!answerSet" @click="forwardPage">
                        {{ labelsMap.next }}
                    </VsButton>
                    <VsButton v-if="activeStage === formData.stages" variant="primary" :disabled="!answerSet" @click="forwardPage">
                        {{ labelsMap.results }}
                    </VsButton>
                    <VsButton v-if="activeStage > formData.stages" variant="primary" @click="restart">
                        {{ labelsMap.restart }}
                    </VsButton>
                </VsCol>
            </VsRow>
            <VsWarning v-else>
                {{ labelsMap.loadError || labelsMap.noJsMessage }}
            </VsWarning>
        </VsContainer>
        <noscript><VsWarning>{{ labelsMap.noJsMessage }}</VsWarning></noscript>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import {
    VsButton, VsCol, VsContainer, VsHeading, VsProgressBar, VsRow, VsWarning,
} from '@visitscotland/component-library/components';
import VsCarbonCalculatorIntro from './VsCarbonCalculatorIntro.vue';
import VsCarbonCalculatorQuestion from './VsCarbonCalculatorQuestion.vue';
import VsCarbonCalculatorResults from './VsCarbonCalculatorResults.vue';
import VsCarbonCalculatorRunningTotal from './VsCarbonCalculatorRunningTotal.vue';
import VsCarbonCalculatorTip from './VsCarbonCalculatorTip.vue';
import type {
    CarbonField, CarbonFieldUpdate, CarbonFormData, CarbonLabels, CarbonOption,
} from '~/types/carbon-calculator';
import dataLayerComposable from '~/composables/dataLayer.ts';

const props = withDefaults(defineProps<{ labelsMap: CarbonLabels, language?: string, }>(), {
    language: 'en-gb', 
});
const emptyForm = (): CarbonFormData => ({
    stages: 0,
    fields: [],
    comparisonReplacements: [], 
});
const formData = ref<CarbonFormData>(emptyForm());
const form = reactive<Record<string, string | number>>({
});
const conditionalFields = reactive<Record<string, boolean>>({
});
const repeatableStages = reactive<Record<number, { generations: number, }>>({
});
const activeStage = ref(0);
const answerSet = ref(false);
const loading = ref(true);
const loadError = ref(false);
const totalKilos = ref(0);
const transportKilos = ref(0);
const accommodationKilos = ref(0);
const foodKilos = ref(0);
const questionRefs = new Map<number, any>();
const progress = ref<any>();
const dataLayer = dataLayerComposable();

const currentQuestion = computed(() => formData.value.fields.find((field) => field.stage === activeStage.value && !field.isClone));
const currentCategory = computed(() => String(props.labelsMap[`stage-${activeStage.value}.title`] || ''));
const currentTip = computed(() => String(props.labelsMap[`stage-${activeStage.value}.tip`] || ''));
const activeStageRepeatable = computed(() => String(props.labelsMap[`stage-${activeStage.value}.repeat`] || ''));
const stayDuration = computed(() => Number.parseInt(String(form.howLongStay || 0), 10));

function initialiseFields(data: CarbonFormData) {
    data.fields.forEach((field) => {
        form[field.name] = '';
        if (field.conditional) conditionalFields[field.name] = false;
    });
    data.repeatableStages?.forEach((stage) => { repeatableStages[stage] = {
        generations: 0, 
    }; });
}

async function loadForm() {
    if (!props.labelsMap.formUrl) { loadError.value = true; loading.value = false; return; }
    try {
        const response = await axios.get<CarbonFormData>(props.labelsMap.formUrl);
        formData.value = response.data;
        initialiseFields(response.data);
    } catch {
        loadError.value = true;
    } finally {
        loading.value = false;
    }
}

function questionLabel(field: CarbonField, index: number) {
    const number = field.isClone ? Number(field.originalNumber) + 1 : index + 1;
    const clone = field.isClone ? props.labelsMap[`question-${number}.clone-question`] : '';
    return String(clone || props.labelsMap[`question-${number}.question`] || '');
}

function questionHint(field: CarbonField, index: number) {
    const number = field.isClone ? Number(field.originalNumber) + 1 : index + 1;
    const clone = field.isClone ? props.labelsMap[`question-${number}.clone-hint`] : '';
    return String(clone || props.labelsMap[`question-${number}.hint`] || '');
}

function questionOptions(field: CarbonField, index: number): CarbonOption[] {
    const number = field.isClone ? Number(field.originalNumber) + 1 : index + 1;
    return (field.options || []).map((option, optionIndex) => ({
        ...option,
        text: String(props.labelsMap[`question-${number}.option-${optionIndex + 1}`] || option.text || ''),
    }));
}

function fieldValue(field: CarbonField): number {
    const answer = form[field.name];
    if (answer === '' || answer === undefined) return 0;
    let value = field.element === 'radio'
        ? Number(field.values?.[String(answer)] || 0)
        : Number.parseInt(String(answer), 10);
    if (field.multiplyByNumber) value *= field.multiplyByNumber;
    if (field.multiplyByAnswer) value *= Math.max(Number(form[field.multiplyByAnswer.question] || 0), field.multiplyByAnswer.minimum);
    if (field.multiplyByValue && field.name !== field.multiplyByValue.question) {
        const multiplierField = formData.value.fields.find((item) => item.name === field.multiplyByValue?.question);
        value *= multiplierField ? Math.max(fieldValue(multiplierField), field.multiplyByValue.minimum) : 0;
    }
    return value;
}

function calculateEmissions() {
    transportKilos.value = 0; accommodationKilos.value = 0; foodKilos.value = 0;
    formData.value.fields.forEach((field) => {
        const value = fieldValue(field);
        if (field.stage === 1 || field.stage === 3) transportKilos.value += value;
        if (field.stage === 2) accommodationKilos.value += value;
        if (field.stage === 4) foodKilos.value += value;
    });
    totalKilos.value = transportKilos.value + accommodationKilos.value + foodKilos.value;
}

function checkConditionalFields() {
    formData.value.fields.filter((field) => field.conditional).forEach((field) => {
        conditionalFields[field.name] = Object.entries(field.conditional || {
        }).every(([name, expected]) => (
            Array.isArray(expected) ? expected.includes(String(form[name])) : form[name] === expected
        ));
        if (!conditionalFields[field.name]) form[field.name] = '';
    });
}

function updateFieldData(data: CarbonFieldUpdate) {
    form[data.field] = data.value ?? '';
    checkConditionalFields();
    calculateEmissions();
    checkAnswerSet();
}

function checkAnswerSet() {
    const fields = formData.value.fields.filter((field) => field.stage === activeStage.value && conditionalElementClass(field.name) !== 'd-none');
    fields.filter((field) => field.element === 'number' && !form[field.name]).forEach((field) => { form[field.name] = field.validation?.min || 0; });
    answerSet.value = fields.every((field) => field.element === 'number' || Boolean(form[field.name]));
}

function resetFocus() {
    nextTick(() => {
        questionRefs.get(activeStage.value)?.$el?.focus();
        progress.value?.$el?.scrollIntoView({
            block: 'nearest', 
        });
    });
}

function forwardPage() {
    if (activeStage.value && currentQuestion.value) dataLayer.createDataLayerObject('carbonQuestionEvent', {
        questionNumber: activeStage.value,
        answer: form[currentQuestion.value.name],
    });
    activeStage.value += 1; checkAnswerSet(); resetFocus();
}

function backwardPage() { activeStage.value -= 1; checkAnswerSet(); resetFocus(); }
function isRepeatable(stage: number) { return Boolean(repeatableStages[stage] && repeatableStages[stage].generations < 3); }
function conditionalElementClass(name: string) { return conditionalFields[name] === false ? 'd-none' : ''; }
function setQuestionRef(element: any, stage: number) { if (element && !questionRefs.has(stage)) questionRefs.set(stage, element); }

function duplicateCurrentStage() {
    const repeatable = repeatableStages[activeStage.value];
    if (!repeatable) return;
    const generation = repeatable.generations + 1;
    formData.value.fields.filter((field) => field.stage === activeStage.value && !field.isClone).forEach((field) => {
        const originalNumber = formData.value.fields.indexOf(field);
        const clone = structuredClone(field);
        clone.isClone = true; clone.originalNumber = originalNumber; clone.name = `${field.name}${generation}`;
        form[clone.name] = ''; formData.value.fields.push(clone);
    });
    repeatable.generations = generation;
}

function restart() {
    Object.keys(form).forEach((key) => { form[key] = ''; });
    Object.keys(conditionalFields).forEach((key) => { conditionalFields[key] = false; });
    formData.value.fields = formData.value.fields.filter((field) => !field.isClone);
    Object.values(repeatableStages).forEach((stage) => { stage.generations = 0; });
    initialiseFields(formData.value);
    activeStage.value = 0; answerSet.value = false;
    totalKilos.value = 0; transportKilos.value = 0; accommodationKilos.value = 0; foodKilos.value = 0;
}

onMounted(loadForm);
</script>

<style scoped>
.vs-carbon-calculator :deep(.vs-progress-bar) { margin-bottom: 1.5rem; }
.vs-carbon-calculator__actions { display: flex; justify-content: space-between; gap: 1rem; margin-top: 2rem; }
.vs-carbon-calculator__actions > :only-child { margin-left: auto; }
fieldset { border: 0; padding: 0; margin: 0; min-width: 0; }
</style>
