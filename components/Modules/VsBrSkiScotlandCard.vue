<template>
    <div
        class="card vs-ski-scotland-card"
        data-test="vs-ski-scotland-card"
    >
        <div class="vs-ski-scotland-card__img-container">
            <template v-if="imgSrc">
                <VsImg
                    :src="imgSrc"
                    :alt="imgAlt"
                    class="vs-ski-scotland-card__img"
                    data-test="vs-ski-scotland-card__img"
                />
            </template>
        </div>
        <div class="card-body">
            <VsHeading
                level="3"
                heading-style="heading-m"
            >
                <slot name="centre-name" />
            </VsHeading>
            <div
                class="text-center pb-200 position-relative"
                v-if="jsDisabled || isLoading || displayError"
            >
                <template v-if="!jsDisabled && isLoading">
                    <VsLoadingSpinner class="mb-100 d-block" />
                    <slot name="data-loading" />
                </template>
                <VsWarning
                    size="small"
                    data-test="vs-ski-scotland-card__error"
                    v-if="!jsDisabled && displayError"
                >
                    <slot name="data-unavailable" />
                </VsWarning>
                <template v-if="jsDisabled">
                    <VsWarning
                        size="small"
                        data-test="vs-ski-scotland-card__js-disabled"
                    >
                        <slot name="js-required" />
                    </VsWarning>
                </template>
            </div>
            <VsTable
                :table-caption="runsLiftsStatusLabel"
                v-if="!jsDisabled && !isLoading && !displayError"
            >
                <VsTableHead>
                    <VsTableHeaderCell>
                        <span data-test="vs-ski__status-label">
                            {{ statusLabel }}
                        </span>
                    </VsTableHeaderCell>
                    <VsTableHeaderCell v-if="runs.length">
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
                                class="me-050 fa-fw"
                            />
                            <span data-test="vs-ski__open-label">
                                {{ summaryOpenLabel }}
                            </span>
                        </VsTableDataCell>
                        <VsTableDataCell v-if="runs.length">
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
                                class="me-050 fa-fw"
                            />
                            <span data-test="vs-ski__limited-patrol-label">
                                {{ summaryLimitedPatrolLabel }}
                            </span>
                        </VsTableDataCell>
                        <VsTableDataCell v-if="runs.length">
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
                                class="me-050 fa-fw"
                            />
                            <span data-test="vs-ski__opening-label">
                                {{ summaryOpeningLabel }}
                            </span>
                        </VsTableDataCell>
                        <VsTableDataCell v-if="runs.length">
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
                                class="me-050 fa-fw"
                            />
                            <span data-test="vs-ski__closed-label">
                                {{ summaryClosedLabel }}
                            </span>
                        </VsTableDataCell>
                        <VsTableDataCell v-if="runs.length">
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
                                class="me-050 fa-fw"
                            />
                            <span data-test="vs-ski__on-hold-label">
                                {{ summaryOnHoldLabel }}
                            </span>
                        </VsTableDataCell>
                        <VsTableDataCell v-if="runs.length">
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

            <VsButton
                variant="secondary"
                :href="pisteMapLink"
                class="d-block w-100 mb-050"
                :disabled="!pisteMapLink"
            >
                {{ pisteMapLabel }}
            </VsButton>

            <VsButton
                :href="moreDetailsLink"
                class="d-block w-100"
            >
                {{ moreDetailsLabel }}
            </VsButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import {
    VsImg,
    VsHeading,
    VsIcon,
    VsWarning,
    VsLoadingSpinner,
    VsButton,
    VsTable,
    VsTableHead,
    VsTableHeaderCell,
    VsTableBody,
    VsTableRow,
    VsTableDataCell,
    VsTableFooter,
} from '@visitscotland/component-library/components';

import axios from 'axios';

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
    [key: string]: unknown;
}

const props = withDefaults(defineProps<{
    centreInfoUrl?: string;
    locale?: string;
    timeoutDuration?: number;
    lastUpdatedLabel?: string;
    liftsLabel?: string;
    runsLabel?: string;
    runsLiftsStatusLabel?: string;
    statusLabel?: string;
    summaryClosedLabel?: string;
    summaryOpenLabel?: string;
    summaryOpeningLabel?: string;
    summaryLimitedPatrolLabel?: string;
    summaryOnHoldLabel?: string;
    imgSrc: string;
    imgAlt?: string;
    pisteMapLabel?: string;
    moreDetailsLabel?: string;
    pisteMapLink?: string;
    moreDetailsLink: string;
}>(), {
    centreInfoUrl: '',
    locale: 'en-gb',
    timeoutDuration: 30000,
    lastUpdatedLabel: 'Last Updated',
    liftsLabel: 'Lifts',
    runsLabel: 'Runs',
    runsLiftsStatusLabel: 'Run/Lift Status',
    statusLabel: 'Status',
    summaryClosedLabel: 'Closed',
    summaryOpenLabel: 'Open',
    summaryOpeningLabel: 'Opening',
    summaryLimitedPatrolLabel: 'Limited Patrol',
    summaryOnHoldLabel: 'On Hold',
    imgAlt: '',
    pisteMapLabel: 'View Piste Map',
    moreDetailsLabel: 'More Details',
    pisteMapLink: '',
});

function createEmptyStatus(): StatusCounts {
    return {
        open: 0,
        opening: 0,
        closed: 0,
        onHold: 0,
        limitedPatrol: 0,
    };
}

const statusSummary = ref({
    runs: createEmptyStatus(),
    lifts: createEmptyStatus(),
});

const lifts = ref<SkiItem[]>([]);
const runs = ref<SkiItem[]>([]);
const lastUpdate = ref('');
const jsDisabled = ref(true);
const isLoading = ref(true);
const displayError = ref(false);

onMounted(() => {
    if (props.centreInfoUrl) {
        retrieveCentreInfo();
    }

    jsDisabled.value = false;
});

function retrieveCentreInfo() {
    const errorTimeout = setTimeout(() => {
        displayError.value = true;
    }, props.timeoutDuration);

    axios.get(props.centreInfoUrl)
        .then((response) => {
            const data = cleanData(response.data);
            processLifts(data.lifts || []);
            if (data.runs) {
                processRuns(data.runs);
            }
            processLastUpdate(data.lastUpdate);
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

    return output;
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
    }

    runs.value = runData;
}
</script>

<style lang="scss">
    .vs-ski-scotland-card {
        --vs-elevation-surface-raised: #ffffff;
        --vs-elevation-shadow-raised: 0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
        --vs-radius-tiny: 0.25rem;

        background: var(--vs-elevation-surface-raised);
        box-shadow: var(--vs-elevation-shadow-raised);
        border: none;
        overflow: hidden;
        border-radius: var(--vs-radius-tiny);
        margin-bottom: 3rem;
        height: calc(100% - 3rem);

        .vs-ski-scotland-card__img-container {
            width: 100%;
            max-width: 100%;
            position: relative;
            aspect-ratio: 2/1;

            @supports not (aspect-ratio: 2/1) {
                padding-bottom: 50%;
            }
        }

        .vs-ski-scotland-card__img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            align-self: flex-start;
            flex-shrink: 0;
        }

        .card-body {
            position: relative;
            padding: 1rem 1rem 6rem;

            @media (min-width: 992px) {
                padding-bottom: 4rem;
            }
        }

        .vs-heading {
            margin-top: 0;
        }

        .vs-button {
            display: block;
            width: 100%;
        }
    }
</style>
