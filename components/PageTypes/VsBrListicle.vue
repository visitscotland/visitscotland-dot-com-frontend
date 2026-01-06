<template>
    <VsBrPageIntro
        :content="documentData"
        :light-background="true"
        :is-listicle="true"
    />

    <!-- TODO Author -->

    <VsContainer
        class="mt-150"
    >
        <VsRow>
            <VsCol
                cols="12"
            >
                <ol
                    style="list-style:none; margin:0; padding:0;"
                    v-if="listicleItems.length"
                >
                    <VsListicleItem
                        v-for="(item, index) in listicleItems"
                        :key="index"
                        :index="`${item.index}`"
                        :title="item.title"
                        :sub-title="item.subtitle"
                    >
                        <template
                            #image-slot
                            v-if="item.image"
                        >
                            <div>
                                <VsBrImageWithCaption
                                    :image="item.image.cmsImage ? item.image.cmsImage : null"
                                    variant="fullwidth"
                                    :no-alt-text="true"
                                    :use-lazy-loading="index !== 0"
                                />
                            </div>
                        </template>

                        <template #description-slot>
                            <div>
                                <div
                                    v-html="item.description.value"
                                />

                                <div
                                    class="mb-050"
                                    v-for="(cta, linkIndex) in item.links"
                                    :key="linkIndex"
                                >
                                    <VsLink
                                        :href="formatLink(cta.link)"
                                        :type="cta.type.toLowerCase()"
                                    >
                                        {{ cta.label }}<span class="visually-hidden">: {{ item.title }}</span>
                                    </VsLink>
                                </div>
                            </div>
                        </template>

                        <template
                            #facilities-slot
                            v-if="item.facilities && item.facilities.length"
                        >
                            <div>
                                <VsIconList
                                    :title="configStore.getLabel('listicle', 'keyfacilities.title')"
                                >
                                    <VsIconListItem
                                        v-for="(facility, facilityIndex) in item.facilities"
                                        :key="facilityIndex"
                                        :icon="getDMSIconName(facility.id)"
                                        :label="facility.name"
                                    />
                                </VsIconList>
                            </div>
                        </template>
                    </VsListicleItem>
                </ol>
            </VsCol>
        </VsRow>
    </VsContainer>

    <VsContainer v-if="listicleClosing">
        <VsRow class="mb-150">
            <VsCol cols="12">
                <VsPanel>
                    <template #vs-panel-title v-if="listicleClosing.title">
                        <VsHeading
                            level="4"
                            heading-style="heading-m"
                        >
                            {{ listicleClosing.title }}
                        </VsHeading>
                    </template>

                    <VsBody variant="lead">
                        <div
                            v-html="listicleClosing.copy.value"
                        />
                    </VsBody>
                </VsPanel>
            </VsCol>
        </VsRow>
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
import { toRefs } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';

import useConfigStore from '~/stores/configStore.ts';

import formatLink from '~/composables/formatLink.ts';

import VsBrPageIntro from '~/components/Modules/VsBrPageIntro.vue';
import VsBrProductSearch from '~/components/Modules/VsBrProductSearch.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';
import VsBrImageWithCaption from '~/components/Modules/VsBrImageWithCaption.vue';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsListicleItem,
    VsLink,
    VsIconList,
    VsIconListItem,
    VsPanel,
    VsBody,
    VsHeading,
} from '@visitscotland/component-library/components';

const props = defineProps<{ component: Component, page: Page }>();

const { page, component } = toRefs(props);

let document : any = {
};
let documentData : any = {
};
let productSearch : any = {
};
let otyml : any = null;

const configStore = useConfigStore();

let listicleItems = [];
let listicleClosing = null;

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    productSearch = configStore.productSearch;
    if (configStore.otyml) {
        otyml = configStore.otyml;
    }

    if (component.value) {
        listicleItems = component.value.model.models.items;
    }

    listicleClosing = documentData.listicleClosing;
}

</script>
