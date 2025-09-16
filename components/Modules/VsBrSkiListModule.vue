<template>
    <VsModuleWrapper theme="light">
        <template #vs-module-wrapper-heading>
            {{ module.title }}
        </template>

        <template #vs-module-wrapper-intro>
            <VsBrRichText :input-content="module.introduction.value" />
        </template>

        <VsContainer>
            <VsRow
                class="mx-n100 mx-lg-n200"
            >
                <VsCol
                    cols="12"
                    sm="6"
                    lg="4"
                    class="px-100 px-lg-200 text-start"
                    v-for="(centre, index) in module.skiCentres"
                    :key="index"
                >
                    <VsSkiScotlandCard
                        :centre-info-url="centre.feedURL"
                        :img-src="centreImages[index].url"
                        :img-alt="centreImages[index].alt"
                        :locale="configStore.locale"
                        :more-details-link="centre.cmsPage.link"
                        :piste-map-link="centre.pisteMap"
                        :last-updated-label="configStore.getLabel('ski', 'ski-centre.last-updated')"
                        :lifts-label="configStore.getLabel('ski', 'ski-centre.lifts')"
                        :runs-label="configStore.getLabel('ski', 'ski-centre.runs')"
                        :runs-lifts-status-label="configStore.getLabel('ski', 'ski-centre.run-lift-status')"
                        :status-label="configStore.getLabel('ski', 'ski-centre.status')"
                        :summary-closed-label="configStore.getLabel('ski', 'ski-centre.summary.closed')"
                        :summary-open-label="configStore.getLabel('ski', 'ski-centre.summary.open')"
                        :summary-opening-label="configStore.getLabel('ski', 'ski-centre.summary.expected-to-open')"
                        :summary-limited-patrol-label="configStore.getLabel('ski', 'ski-centre.summary.limited-patrol')"
                        :summary-on-hold-label="configStore.getLabel('ski', 'ski-centre.summary.on-hold')"
                        :piste-map-label="configStore.getLabel('ski', 'ski-centre.view-piste-map')"
                        :more-details-label="configStore.getLabel('ski', 'ski-centre.more-details')"
                        :timeout-duration="centre.timeout"
                    >
                        <template #centre-name>
                            {{ centre.title }}
                        </template>
                        <template #data-loading>
                            <div>
                                {{ configStore.getLabel("ski", "ski-data.loading") }}
                            </div>
                        </template>
                        <template #data-unavailable>
                            <div>
                                {{ configStore.getLabel("ski", "ski-data.unavailable") }}
                            </div>
                        </template>
                        <template #js-required>
                            <div>
                                {{ configStore.getLabel("ski", "ski-data.no-js") }}
                            </div>
                        </template>
                    </VsSkiScotlandCard>
                </VsCol>
            </VsRow>
        </VsContainer>
    </VsModuleWrapper>
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */

import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsModuleWrapper,
    VsContainer,
    VsRow,
    VsCol,
    VsSkiScotlandCard,
} from '@visitscotland/component-library/components';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{ module: Object }>();
const module: any = props.module;

const page: Page | undefined = inject('page');

const centreImages: any[] = [];

for (let x = 0; x < module.skiCentres.length; x++) {
    const centre = module.skiCentres[x];
    if (centre.cmsPage && centre.cmsPage.image) {
        const imageValue = page.getContent(centre.cmsPage.image.cmsImage.$ref);
        const imageUrl = imageValue.getOriginal().getUrl();

        centreImages.push({
            url: imageUrl,
            alt: imageValue.model.data.altText,
        });
    }
}

</script>
