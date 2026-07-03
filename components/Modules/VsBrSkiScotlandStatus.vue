<template>
    <div
        ref="rootEl"
        class="vs-ski-scotland-status"
        data-test="vs-ski-scotland-status"
    >
        <VsContainer v-if="!jsDisabled && isLoading">
            <VsRow>
                <VsCol class="text-center py-100">
                    <VsLoadingSpinner />
                    <slot name="data-loading" />
                </VsCol>
            </VsRow>
        </VsContainer>
        <VsContainer v-if="!jsDisabled && displayError">
            <VsRow>
                <VsCol class="text-center py-100">
                    <VsWarning>
                        <slot name="data-unavailable" />
                    </VsWarning>
                </VsCol>
            </VsRow>
        </VsContainer>
        <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    md="6"
                    v-if="jsDisabled"
                    data-test="vs-ski__js-disabled"
                >
                    <VsWarning>
                        <slot name="js-required" />
                    </VsWarning>
                </VsCol>
                <VsCol
                    cols="12"
                    md="6"
                    v-if="!jsDisabled && !isLoading && !displayError"
                >
                    <VsHeading
                        level="3"
                        heading-style="heading-xs"
                        data-test="vs-ski__runs-lifts-status-label"
                        class="d-none d-md-block"
                    >
                        {{ runsLiftsStatusLabel }}
                    </VsHeading>

                    <VsTable
                        :table-caption="runsLiftsStatusLabel"
                    >
                        <VsTableHead>
                            <VsTableHeaderCell>
                                <span data-test="vs-ski__status-label">
                                    {{ statusLabel }}
                                </span>
                            </VsTableHeaderCell>
                            <VsTableHeaderCell
                                v-if="runs.length"
                            >
                                <span data-test="vs-ski__runs-label">
                                    {{ runsLabel }}
                                </span>
                            </VsTableHeaderCell>
                            <VsTableHeaderCell>
                                <span data-test="vs-ski__lifts-label">
                                    {{ liftsLabel }}
                                </span>
                            </VsTableHeaderCell>
                        </VsTableHead>
                        <VsTableBody>
                            <VsTableRow>
                                <VsTableDataCell>
                                    <VsIcon
                                        icon="fa-regular fa-check"
                                        size="xs"
                                        class="me-050"
                                    />
                                    <span data-test="vs-ski__open-label">
                                        {{ summaryOpenLabel }}
                                    </span>
                                </VsTableDataCell>
                                <VsTableDataCell
                                    v-if="runs.length"
                                >
                                    {{ statusSummary.runs.open }}/{{ runs.length }}
                                </VsTableDataCell>
                                <VsTableDataCell>
                                    {{ statusSummary.lifts.open }}/{{ lifts.length }}
                                </VsTableDataCell>
                            </VsTableRow>
                            <VsTableRow
                                v-if="statusSummary.runs.limitedPatrol
                                    || statusSummary.lifts.limitedPatrol"
                            >
                                <VsTableDataCell>
                                    <VsIcon
                                        icon="fa-regular fa-ski-boot-ski"
                                        size="xs"
                                        class="me-050"
                                    />
                                    <span data-test="vs-ski__open-label">
                                        {{ summaryLimitedPatrolLabel }}
                                    </span>
                                </VsTableDataCell>
                                <VsTableDataCell
                                    v-if="runs.length"
                                >
                                    {{ statusSummary.runs.limitedPatrol }}/{{ runs.length }}
                                </VsTableDataCell>
                                <VsTableDataCell>
                                    {{ statusSummary.lifts.limitedPatrol }}/{{ lifts.length }}
                                </VsTableDataCell>
                            </VsTableRow>
                            <VsTableRow>
                                <VsTableDataCell>
                                    <VsIcon
                                        icon="fa-regular fa-timer"
                                        size="xs"
                                        class="me-050"
                                    />
                                    <span data-test="vs-ski__opening-label">
                                        {{ summaryOpeningLabel }}
                                    </span>
                                </VsTableDataCell>
                                <VsTableDataCell
                                    v-if="runs.length"
                                >
                                    {{ statusSummary.runs.opening }}/{{ runs.length }}
                                </VsTableDataCell>
                                <VsTableDataCell>
                                    {{ statusSummary.lifts.opening }}/{{ lifts.length }}
                                </VsTableDataCell>
                            </VsTableRow>
                            <VsTableRow>
                                <VsTableDataCell>
                                    <VsIcon
                                        icon="fa-regular fa-ban"
                                        size="xs"
                                        class="me-050"
                                    />
                                    <span data-test="vs-ski__closed-label">
                                        {{ summaryClosedLabel }}
                                    </span>
                                </VsTableDataCell>
                                <VsTableDataCell
                                    v-if="runs.length"
                                >
                                    {{ statusSummary.runs.closed }}/{{ runs.length }}
                                </VsTableDataCell>
                                <VsTableDataCell>
                                    {{ statusSummary.lifts.closed }}/{{ lifts.length }}
                                </VsTableDataCell>
                            </VsTableRow>
                            <VsTableRow
                                v-if="statusSummary.runs.onHold || statusSummary.lifts.onHold"
                            >
                                <VsTableDataCell>
                                    <VsIcon
                                        icon="fa-regular fa-hourglass"
                                        size="xs"
                                        class="me-050"
                                    />
                                    <span data-test="vs-ski__open-label">
                                        {{ summaryOnHoldLabel }}
                                    </span>
                                </VsTableDataCell>
                                <VsTableDataCell
                                    v-if="runs.length"
                                >
                                    {{ statusSummary.runs.onHold }}/{{ runs.length }}
                                </VsTableDataCell>
                                <VsTableDataCell>
                                    {{ statusSummary.lifts.onHold }}/{{ lifts.length }}
                                </VsTableDataCell>
                            </VsTableRow>
                        </VsTableBody>
                        <VsTableFooter>
                            <VsTableRow>
                                <VsTableDataCell
                                    colspan="3"
                                    role="cell"
                                >
                                    <span data-test="vs-ski__last-updated-label">
                                        {{ lastUpdatedLabel }}: {{ lastUpdate }}
                                    </span>
                                </VsTableDataCell>
                            </VsTableRow>
                        </VsTableFooter>
                    </VsTable>
                    <VsLink
                        :href="`#vs-ski-scotland-status__detailed-status-${id}`"
                        type="default"
                        class="vs-ski-scotland-status__detailed-status-link"
                    >
                        {{ detailedStatusLabel }}
                    </VsLink>
                </VsCol>

                <VsCol
                    cols="12"
                    md="5"
                    offset-md="1"
                    class="vs-ski-scotland-status__centre-info"
                >
                    <slot name="centre-information" />
                </VsCol>
            </VsRow>
            <VsRow
                v-if="!jsDisabled && !isLoading && !displayError"
            >
                <VsCol
                    cols="12"
                    md="9"
                    class="vs-ski-scotland-status__full-report"
                >
                    <VsHeading
                        level="3"
                        heading-style="heading-l"
                        data-test="vs-ski__snow-conditions-label"
                    >
                        {{ snowConditionsLabel }}
                    </VsHeading>
                    <div
                        v-html="report"
                    />
                    <VsHeading
                        level="4"
                        heading-style="heading-xs"
                        data-test="vs-ski__current-weather-label"
                        v-if="currentWeather.length"
                    >
                        {{ currentWeatherLabel }}
                    </VsHeading>
                    <div
                        v-if="currentWeather.length"
                        v-html="currentWeather"
                    />
                    <VsHeading
                        level="4"
                        heading-style="heading-xs"
                        data-test="vs-ski__weather-forecast-label"
                        v-if="weatherForecast.length"
                    >
                        {{ weatherForecastLabel }}
                    </VsHeading>
                    <div
                        v-if="weatherForecast.length"
                        v-html="weatherForecast"
                    />
                    <VsHeading
                        level="4"
                        heading-style="heading-xs"
                        data-test="vs-ski__roads-label"
                        v-if="roadStatus.length"
                    >
                        {{ roadsLabel }}
                    </VsHeading>
                    <div
                        v-if="roadStatus.length"
                        v-html="roadStatus"
                    />
                    <VsHeading
                        level="4"
                        heading-style="heading-xs"
                        data-test="vs-ski__news-label"
                        v-if="news.length"
                    >
                        {{ newsLabel }}
                    </VsHeading>
                    <div
                        v-if="news.length"
                        v-html="news"
                    />
                </VsCol>
            </VsRow>
            <VsRow
                v-if="!jsDisabled && !isLoading && !displayError"
            >
                <VsCol
                    cols="12"
                    md="9"
                >
                    <VsHeading
                        level="3"
                        heading-style="heading-l"
                        data-test="vs-ski__lift-status-label"
                        :id="`vs-ski-scotland-status__detailed-status-${id}`"
                    >
                        {{ liftStatusLabel }}
                    </VsHeading>

                    <VsTable
                        :table-caption="liftStatusLabel"
                        class="vs-ski-scotland-status__run-status-table"
                    >
                        <VsTableHead>
                            <VsTableHeaderCell>{{ statusLabel }}</VsTableHeaderCell>
                            <VsTableHeaderCell>{{ liftLabel }}</VsTableHeaderCell>
                        </VsTableHead>
                        <VsTableBody>
                            <VsTableRow
                                v-for="lift in lifts"
                                :key="lift.name"
                            >
                                <VsTableDataCell v-if="lift.status === '0' || lift.status === 0">
                                    <VsIcon
                                        icon="fa-regular fa-ban"
                                        size="xs"
                                        class="me-050"
                                    /> {{ statusClosedLabel }}
                                </VsTableDataCell>
                                <VsTableDataCell v-if="lift.status === '1' || lift.status === 1">
                                    <VsIcon
                                        icon="fa-regular fa-check"
                                        size="xs"
                                        class="me-050"
                                    /> {{ statusOpenLabel }}
                                </VsTableDataCell>
                                <VsTableDataCell v-if="lift.status === '2' || lift.status === 2">
                                    <VsIcon
                                        icon="fa-regular fa-timer"
                                        size="xs"
                                        class="me-050"
                                    /> {{ statusOpeningLabel }}
                                </VsTableDataCell>
                                <VsTableDataCell v-if="lift.status === '3' || lift.status === 3">
                                    <VsIcon
                                        icon="fa-regular fa-ski-boot-ski"
                                        size="xs"
                                        class="me-050"
                                    /> {{ statusLimitedPatrolLabel }}
                                </VsTableDataCell>
                                <VsTableDataCell v-if="lift.status === '4' || lift.status === 4">
                                    <VsIcon
                                        icon="fa-regular fa-hourglass"
                                        size="xs"
                                        class="me-050"
                                    /> {{ statusOnHoldLabel }}
                                </VsTableDataCell>
                                <VsTableDataCell>{{ lift.name }}</VsTableDataCell>
                            </VsTableRow>
                        </VsTableBody>
                        <VsTableFooter>
                            <VsTableRow>
                                <VsTableDataCell
                                    colspan="2"
                                    role="cell"
                                >
                                    <p>{{ lastUpdatedLabel }}: {{ lastUpdate }}</p>
                                </VsTableDataCell>
                            </VsTableRow>
                        </VsTableFooter>
                    </VsTable>
                </VsCol>
            </VsRow>
            <VsRow
                v-if="!jsDisabled && !isLoading && !displayError && runs.length"
            >
                <VsCol
                    cols="12"
                    md="9"
                >
                    <VsHeading
                        level="3"
                        heading-style="heading-l"
                        data-test="vs-ski__run-status-label"
                    >
                        {{ runStatusLabel }}
                    </VsHeading>
                    <div
                        v-for="level in filteredRunLevels"
                        :key="level.name"
                    >
                        <VsAccordion>
                            <VsAccordionItem
                                variant="subtle"
                                :control-id="`accordion_item_${level.name}`"
                                :colour-badge="level.colourToken"
                            >
                                <template #title>
                                    <div
                                        :data-test="`vs-ski__${level.name}-label`"
                                        class="d-inline-block"
                                    >
                                        <span class="visually-hidden">
                                            {{ getColourLabel(level.colour) }}
                                        </span>
                                        {{ level.name }}
                                    </div>
                                </template>
                                <VsTable
                                    :table-caption="`${level.colour} - ${level.name}`"
                                    class="vs-ski-scotland-status__run-status-table"
                                >
                                    <VsTableHead>
                                        <VsTableHeaderCell>{{ statusLabel }}</VsTableHeaderCell>
                                        <VsTableHeaderCell>{{ runLabel }}</VsTableHeaderCell>
                                    </VsTableHead>
                                    <VsTableBody>
                                        <VsTableRow
                                            v-for="run in level.runs"
                                            :key="run.name"
                                            :data-test="`vs-ski__${level.name}-row`"
                                        >
                                            <VsTableDataCell
                                                v-if="run.status === '0' || run.status === 0"
                                            >
                                                <VsIcon
                                                    icon="fa-regular fa-ban"
                                                    size="xs"
                                                    class="me-050"
                                                /> {{ statusClosedLabel }}
                                            </VsTableDataCell>
                                            <VsTableDataCell
                                                v-if="run.status === '1' || run.status === 1"
                                            >
                                                <VsIcon
                                                    icon="fa-regular fa-check"
                                                    size="xs"
                                                    class="me-050"
                                                /> {{ statusOpenLabel }}
                                            </VsTableDataCell>
                                            <VsTableDataCell
                                                v-if="run.status === '2' || run.status === 2"
                                            >
                                                <VsIcon
                                                    icon="fa-regular fa-timer"
                                                    size="xs"
                                                    class="me-050"
                                                /> {{ statusOpeningLabel }}
                                            </VsTableDataCell>
                                            <VsTableDataCell
                                                v-if="run.status === '3' || run.status === 3"
                                            >
                                                <VsIcon
                                                    icon="fa-regular fa-ski-boot-ski"
                                                    size="xs"
                                                    class="me-050"
                                                /> {{ statusLimitedPatrolLabel }}
                                            </VsTableDataCell>
                                            <VsTableDataCell
                                                v-if="run.status === '4' || run.status === 4"
                                            >
                                                <VsIcon
                                                    icon="fa-regular fa-hourglass"
                                                    size="xs"
                                                    class="me-050"
                                                /> {{ statusOnHoldLabel }}
                                            </VsTableDataCell>
                                            <VsTableDataCell>{{ run.name }}</VsTableDataCell>
                                        </VsTableRow>
                                    </VsTableBody>
                                    <VsTableFooter>
                                        <VsTableRow>
                                            <VsTableDataCell
                                                colspan="2"
                                                role="cell"
                                            >
                                                <p>{{ lastUpdatedLabel }}: {{ lastUpdate }}</p>
                                            </VsTableDataCell>
                                        </VsTableRow>
                                    </VsTableFooter>
                                </VsTable>
                            </VsAccordionItem>
                        </VsAccordion>
                    </div>
                </VsCol>
            </VsRow>
        </VsContainer>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    computed,
    onMounted,
} from 'vue';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsLoadingSpinner,
    VsWarning,
    VsHeading,
    VsTable,
    VsTableHead,
    VsTableHeaderCell,
    VsTableBody,
    VsTableRow,
    VsTableDataCell,
    VsTableFooter,
    VsIcon,
    VsLink,
    VsAccordion,
    VsAccordionItem,
} from '@visitscotland/component-library/components';

import axios from 'axios';

const rootEl = ref<HTMLElement | null>(null);

interface StatusCounts {
    open: number;
    opening: number;
    closed: number;
    onHold: number;
    limitedPatrol: number;
}

interface SkiItem {
    name: string;
    status: string | number;
    difficulty?: string | null;
    [key: string]: unknown;
}

interface RunLevel {
    colour: string;
    colourToken: string;
    id: string;
    name: string;
    runs: SkiItem[];
}

const props = withDefaults(defineProps<{
    skiStatusUrl?: string;
    locale?: string;
    timeoutDuration?: number;
    currentWeatherLabel?: string;
    detailedStatusLabel?: string;
    difficultLabel?: string;
    easyLabel?: string;
    intermediateLabel?: string;
    itinerariesLabel?: string;
    lastUpdatedLabel?: string;
    liftLabel?: string;
    liftsLabel?: string;
    liftStatusLabel?: string;
    newsLabel?: string;
    otherLabel?: string;
    roadsLabel?: string;
    runLabel?: string;
    runsLabel?: string;
    runsLiftsStatusLabel?: string;
    runStatusLabel?: string;
    snowConditionsLabel?: string;
    statusLabel?: string;
    summaryClosedLabel?: string;
    summaryOpenLabel?: string;
    summaryOpeningLabel?: string;
    summaryLimitedPatrolLabel?: string;
    summaryOnHoldLabel?: string;
    statusClosedLabel?: string;
    statusOpenLabel?: string;
    statusOpeningLabel?: string;
    statusLimitedPatrolLabel?: string;
    statusOnHoldLabel?: string;
    veryDifficultLabel?: string;
    weatherForecastLabel?: string;
    greenLabel?: string;
    blueLabel?: string;
    redLabel?: string;
    blackLabel?: string;
    orangeLabel?: string;
    greyLabel?: string;
}>(), {
    skiStatusUrl: '',
    locale: 'en-gb',
    timeoutDuration: 30000,
    currentWeatherLabel: 'Current Weather',
    detailedStatusLabel: 'Detailed Status',
    difficultLabel: 'Difficult',
    easyLabel: 'Easy',
    intermediateLabel: 'Intermediate',
    itinerariesLabel: 'Itineraries',
    lastUpdatedLabel: 'Last Updated',
    liftLabel: 'Lift',
    liftsLabel: 'Lifts',
    liftStatusLabel: 'Lift Status',
    newsLabel: 'News From The Slopes',
    otherLabel: 'Other',
    roadsLabel: 'Road Status',
    runLabel: 'Run',
    runsLabel: 'Runs',
    runsLiftsStatusLabel: 'Run/Lift Status',
    runStatusLabel: 'Run Status',
    snowConditionsLabel: 'Snow Conditions Full Report',
    statusLabel: 'Status',
    summaryClosedLabel: 'Closed',
    summaryOpenLabel: 'Open',
    summaryOpeningLabel: 'Opening',
    summaryLimitedPatrolLabel: 'Limited Patrol',
    summaryOnHoldLabel: 'On Hold',
    statusClosedLabel: 'Closed',
    statusOpenLabel: 'Open',
    statusOpeningLabel: 'Opening',
    statusLimitedPatrolLabel: 'Limited Patrol',
    statusOnHoldLabel: 'On Hold',
    veryDifficultLabel: 'Very Difficult',
    weatherForecastLabel: 'Weather Forecast',
    greenLabel: 'Green',
    blueLabel: 'Blue',
    redLabel: 'Red',
    blackLabel: 'Black',
    orangeLabel: 'Orange',
    greyLabel: 'Grey',
});

const colourTokenFallback: Record<string, string> = {
    easy: 'rgb(3, 135, 55)',
    intermediate: 'rgb(23, 53, 156)',
    difficult: 'rgb(194, 20, 58)',
    'very-difficult': 'rgb(51, 51, 51)',
    itineraries: 'rgb(255, 173, 102)',
    other: 'rgb(163, 163, 204)',
};

function getColourTokenValue(id: string): string {
    if (rootEl.value) {
        const value = getComputedStyle(rootEl.value)
            .getPropertyValue(`--vs-color-icon-ski-${id}`).trim();
        if (value) return value;
    }
    return colourTokenFallback[id] || '';
}

const colourLabelMap: Record<string, string> = {
    green: props.greenLabel,
    blue: props.blueLabel,
    red: props.redLabel,
    black: props.blackLabel,
    orange: props.orangeLabel,
    grey: props.greyLabel,
};

function createEmptyStatus(): StatusCounts {
    return {
        open: 0,
        opening: 0,
        closed: 0,
        onHold: 0,
        limitedPatrol: 0,
    };
}

let uidCounter = 0;
uidCounter += 1;
const id = ref(uidCounter);

const statusSummary = ref({
    runs: createEmptyStatus(),
    lifts: createEmptyStatus(),
});

const lifts = ref<SkiItem[]>([]);
const runs = ref<SkiItem[]>([]);
const lastUpdate = ref('');
const report = ref('');
const currentWeather = ref('');
const weatherForecast = ref('');
const roadStatus = ref('');
const news = ref('');

const runLevels = ref<RunLevel[]>([
    {
        colour: 'green',
        colourToken: '',
        id: 'easy',
        name: props.easyLabel,
        runs: [],
    },
    {
        colour: 'blue',
        colourToken: '',
        id: 'intermediate',
        name: props.intermediateLabel,
        runs: [],
    },
    {
        colour: 'red',
        colourToken: '',
        id: 'difficult',
        name: props.difficultLabel,
        runs: [],
    },
    {
        colour: 'black',
        colourToken: '',
        id: 'very-difficult',
        name: props.veryDifficultLabel,
        runs: [],
    },
    {
        colour: 'orange',
        colourToken: '',
        id: 'itineraries',
        name: props.itinerariesLabel,
        runs: [],
    },
    {
        colour: 'grey',
        colourToken: '',
        id: 'other',
        name: props.otherLabel,
        runs: [],
    },
]);

const jsDisabled = ref(true);
const isLoading = ref(true);
const displayError = ref(false);

const filteredRunLevels = computed(() => {
    const runLevelsArr = setColourToken();
    return runLevelsArr.filter((level) => level.runs.length > 0);
});

onMounted(() => {
    if (props.skiStatusUrl) {
        retrieveSkiStatus();
    }
    jsDisabled.value = false;
});

function retrieveSkiStatus() {
    const errorTimeout = setTimeout(() => {
        displayError.value = true;
    }, props.timeoutDuration);

    axios.get(props.skiStatusUrl)
        .then((response) => {
            const data = cleanData(response.data);
            processLifts(data.lifts);
            if (data.runs) {
                processRuns(data.runs);
            }
            processLastUpdate(data.lastUpdate);
            processFullReport(data.report);
            isLoading.value = false;
            clearTimeout(errorTimeout);
        })
        .catch(() => {
            displayError.value = true;
            isLoading.value = false;
            clearTimeout(errorTimeout);
        });
}

function cleanData(data: any) {
    const output: any = {
        contact: data.contact,
        report: data.report,
    };

    if (data.snowReport) {
        output.lastUpdate = data.snowReport.lastupdate;
        output.lifts = data.lifts.sector.items;
        output.runs = data.runs.items;
    } else {
        output.lastUpdate = data.lastupdate;
        [output.lifts] = data.lift.sectors;
        output.lifts = output.lifts.lifts;

        if (data.run.areas) {
            const allRuns = data.run.areas
                .map((area: any) => area.runs)
                .reduce((pre: any[], cur: any[]) => pre.concat(cur), [])
                .filter((value: any, index: number, self: any[]) => (
                    index === self.findIndex((t: any) => t.name === value.name)
                ));

            output.runs = allRuns;
        }
    }

    if (output.runs) {
        for (let x = 0; x < output.runs.length; x++) {
            if (output.runs[x].difficulty === null) {
                output.runs[x].difficulty = 'orange';
            }
        }
    }

    return output;
}

function processFullReport(data: any) {
    report.value = data.runs;
    currentWeather.value = data.current_weather_conditions;
    weatherForecast.value = data.weather_forecast;
    roadStatus.value = data.access_roads;
    news.value = data.news_from_the_slopes;
}

function processLastUpdate(lastUpdateData: any) {
    const event = new Date(
        lastUpdateData.year,
        Number.parseInt(lastUpdateData.month, 10) - 1,
        lastUpdateData.day,
    );
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const formattedDate = event.toLocaleDateString(props.locale, options);
    lastUpdate.value = `${lastUpdateData.hour24}:${lastUpdateData.minute} - ${formattedDate}`;
}

function processLifts(liftData: SkiItem[]) {
    const summary = statusSummary.value;

    for (let x = 0; x < liftData.length; x++) {
        switch (liftData[x].status) {
        case '4':
        case 4:
            summary.lifts.onHold += 1;
            break;
        case '3':
        case 3:
            summary.lifts.limitedPatrol += 1;
            break;
        case '2':
        case 2:
            summary.lifts.opening += 1;
            break;
        case '1':
        case 1:
            summary.lifts.open += 1;
            break;
        default:
            summary.lifts.closed += 1;
            break;
        }
    }

    lifts.value = liftData;
}

function processRuns(runData: SkiItem[]) {
    const summary = statusSummary.value;

    for (let x = 0; x < runData.length; x++) {
        switch (runData[x].status) {
        case '4':
        case 4:
            summary.runs.onHold += 1;
            break;
        case '3':
        case 3:
            summary.runs.limitedPatrol += 1;
            break;
        case '2':
        case 2:
            summary.runs.opening += 1;
            break;
        case '1':
        case 1:
            summary.runs.open += 1;
            break;
        default:
            summary.runs.closed += 1;
            break;
        }

        for (let y = 0; y < runLevels.value.length; y++) {
            if (runLevels.value[y].colour === runData[x].difficulty) {
                runLevels.value[y].runs.push(runData[x]);
            }
        }
    }

    runs.value = runData;
}

function getColourLabel(colour: string): string {
    return colourLabelMap[colour] || colour;
}

function setColourToken(): RunLevel[] {
    return runLevels.value.map((level) => ({
        ...level,
        colourToken: getColourTokenValue(level.id),
    }));
}
</script>

<style lang="scss">
    .vs-ski-scotland-status {
        --vs-color-icon-ski-easy: rgb(3, 135, 55);
        --vs-color-icon-ski-intermediate: rgb(23, 53, 156);
        --vs-color-icon-ski-difficult: rgb(194, 20, 58);
        --vs-color-icon-ski-very-difficult: rgb(51, 51, 51);
        --vs-color-icon-ski-itineraries: rgb(255, 173, 102);
        --vs-color-icon-ski-other: rgb(163, 163, 204);

        text-align: left;

        &__full-report {
            .vs-heading {
                margin-top: 1.5rem;
            }
        }

        &__centre-info {
            font-size: 0.875rem;
            margin-top: 2rem;

            @media (min-width: 768px) {
                margin-bottom: 1.75rem;
                margin-top: 0;
            }

            li {
                > .vs-icon {
                    display: inline-block;
                    width: 1.25rem;
                }

                > a {
                    display: inline-block;
                    width: calc(100% - 1.75rem);
                    vertical-align: top;
                    word-break: break-word;
                }

                > span {
                    display: inline-block;
                    width: calc(100% - 2rem);
                    vertical-align: top;
                }
            }
        }

        .row {
            &:not(:first-child) {
                margin-top: 2rem;
            }
        }

        .vs-icon {
            text-align: center;
        }

        .vs-table .vs-icon {
            width: 1.25rem;
        }

        &__run-status-table {
            margin-bottom: 0;

            p {
                margin-bottom: 0;
            }

            thead th {
                width: 50%;
            }
        }
    }
</style>
