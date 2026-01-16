<template>
    <VsBrHeroSection
        :content="documentData"
        :image="heroImage"
        inset
    />
    <VsContainer>
        <div class="row gap-175 gap-lg-0">
            <VsRow>
                <VsCol>
                    <span class="vs-section-header__divider" />
                </VsCol>
            </VsRow>
            <VsCol
                cols="12"
                lg="4"
            >
                <VsHeading
                    level="2"
                    heading-style="heading-l"
                    no-margins
                >
                    {{ documentData.subheading }}
                </VsHeading>
            </VsCol>
            <VsCol
                cols="12"
                lg="8"
            >
                <VsBody>
                    <VsBrRichText
                        :input-content="documentData.introduction.value"
                    />
                </VsBody>
                <VsPanel>
                    <VsContainer>
                        <VsRow class="align-items-center">
                            <VsCol cols="12" md="9" class="mb-175 mb-md-0">
                                <VsHeading
                                    heading-style="heading-xs"
                                    level="3"
                                    no-margins
                                    class="mb-125 field-needed"
                                >
                                    Placeholder - label needed
                                </VsHeading>
                                <div class="d-flex flex-wrap column-gap-300 row-gap-150 align-items-end">
                                    <VsDetail
                                        no-margins
                                        color="tertiary"
                                        icon="fa-regular fa-binoculars"
                                        icon-variant="tertiary"
                                        class="field-needed"
                                    >
                                        Sightseeing
                                    </VsDetail>

                                    <VsDetail
                                        no-margins
                                        color="tertiary"
                                        icon="fa-regular fa-route"
                                        icon-variant="tertiary"
                                        class="field-needed"
                                    >
                                        295 miles (472km)
                                    </VsDetail>

                                    <VsDetail
                                        no-margins
                                        color="tertiary"
                                        icon="fa-regular fa-calendar-range"
                                        icon-variant="tertiary"

                                        class="field-needed"
                                    >
                                        {{ pageIntro.days.length }}
                                    </VsDetail>

                                    <VsDetail
                                        no-margins
                                        color="tertiary"
                                        icon="fa-regular fa-taxi"
                                        icon-variant="tertiary"
                                        class="field-needed"
                                    >
                                        {{ pageIntro.transports[0].displayName }}
                                    </VsDetail>

                                    <VsDetail
                                        no-margins
                                        color="tertiary"
                                        icon="fa-regular fa-location-dot"
                                        icon-variant="tertiary"
                                        class="field-needed"
                                    >
                                        {{ pageIntro.areas[0].displayName }}
                                    </VsDetail>
                                </div>
                            </VsCol>
                            <VsCol cols="12" md="3">
                                <VsIllustratedMap
                                    width="145px"
                                    class="d-block mx-auto"
                                    :highlighted-regions="mapAreas"
                                />
                            </VsCol>
                        </VsRow>
                    </VsContainer>
                </VsPanel>
            </VsCol>
        </div>
    </VsContainer>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrSocialShare
            :no-js="true"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrProductSearch
            v-if="productSearch"
            class="mt-300 mt-lg-600"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrHorizontalLinksModule
            v-if="otyml"
            :module="otyml"
            theme="light"
        />
    </NuxtLazyHydrate>

    <NuxtLazyHydrate
        :when-visible="{ rootMargin: '50px' }"
    >
        <VsBrNewsletterSignpost
            v-if="!documentData.hideNewsletter && configStore.newsletterSignpost"
            :data="configStore.newsletterSignpost"
        />
    </NuxtLazyHydrate>
</template>

<script lang="ts" setup>
import { toRefs, defineAsyncComponent } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore.ts';

import VsBrProductSearch from '~/components/Modules/VsBrProductSearch.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

import {
    VsBody,
    VsHeading,
    VsContainer,
    VsRow,
    VsCol,
    VsPanel,
    VsIllustratedMap,
    VsDetail,
} from '@visitscotland/component-library/components';

const props = defineProps<{ component: Component, page: Page }>();

const { page, component } = toRefs(props);

let document : any = {
};
let documentData : any = {
};
let productSearch : any = {
};
let heroImage = {
};
let otyml : any = null;
let pageIntro = {
};
let introSection = {
};
let mapAreas = null;

const configStore = useConfigStore();

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    productSearch = configStore.productSearch;
    heroImage = documentData.heroImage;

    if (configStore.otyml) {
        otyml = configStore.otyml;
    }

    if (component.value) {
        pageIntro = component.value.model.models.pageIntro;
        introSection = page.value.getDocument(pageIntro.$ref);
        mapAreas = pageIntro.areas.map((region) => region.key);
    }
}

</script>
