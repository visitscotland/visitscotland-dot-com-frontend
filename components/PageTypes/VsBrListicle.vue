<template>
    <VsContainer class="mt-075 mt-lg-200">
        <VsRow>
            <VsCol
                cols="10"
                lg="8"
            >
                <VsBrBreadcrumb />
            </VsCol>
        </VsRow>
    </VsContainer>

    <VsBrHeroSection
        :content="documentData"
        :inset="true"
        class="mb-400"
        :favourites-button="true"
    />

    <VsContainer>
        <VsRow>
            <VsCol
                cols="12"
            >
                <p
                    class="mt-200"
                >
                    {{ configStore.getLabel("listicle", "listicle.disclaimer") }}
                </p>
            </VsCol>
        </VsRow>
    </VsContainer>

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
                    <template
                        v-for="(item, index) in listicleItems"
                        :key="index"
                    >
                        <VsBrPreviewError
                            v-if="item.errorMessages && item.errorMessages.length"
                            :messages="item.errorMessages"
                        />

                        <VsListicleItem
                            :index="`${item.index}`"
                            :title="item.title"
                            :sub-title="item.subtitle"
                        >
                            <template
                                #image-slot
                                v-if="item.image"
                            >
                                <div>
                                    <VsBrMedia
                                        :image="item.image.cmsImage ? item.image.cmsImage : null"
                                        :image-string="!item.image.cmsImage ? item.image.externalImage : ''"
                                        :image-data-set="!item.image.cmsImage ? item.image : null"
                                        :image-description="item.image.description"
                                        variant="fullwidth"
                                        :no-alt-text="true"
                                        :use-lazy-loading="index !== 0"
                                    />
                                </div>
                            </template>

                            <template #description-slot>
                                <div>
                                    <VsBody>
                                        <VsBrRichText :input-content="item.description.value" />
                                    </VsBody>

                                    <div
                                        class="mb-050"
                                        v-for="(cta, linkIndex) in item.links"
                                        :key="linkIndex"
                                    >
                                        <VsLink
                                            :href="formatLink(cta.link)"
                                            :type="cta.type.toLowerCase() === 'internal' ? null : cta.type.toLowerCase()"
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
                                <div class="vs-icon-list" data-test="vs-icon-list">
                                    <div
                                        v-if="configStore.getLabel('listicle', 'keyfacilities.title')"
                                        class="vs-icon-list__title"
                                    >
                                        {{ configStore.getLabel('listicle', 'keyfacilities.title') }}
                                    </div>

                                    <ul class="vs-icon-list__list mb-0">
                                        <li
                                            v-for="facility in item.facilities"
                                            :key="facility.id"
                                            class="vs-icon-list__item"
                                            data-test="vs-icon-list__item"
                                        >
                                            <VsIcon
                                                :icon="getDMSIconName(facility.id)"
                                                size="md"
                                                class="d-block mx-auto"
                                            />
                                            {{ facility.name }}
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </VsListicleItem>
                    </template>
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
                        <VsBody>
                            <VsBrRichText :input-content="listicleClosing.copy.value" />
                        </VsBody>
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
        <section
            class="mt-500"
            v-if="otyml"
        >
            <VsBrHorizontalLinksModule
                :module="otyml"
                theme="light"
            />
        </section>
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

import VsBrHeroSection from '~/components/Modules/VsBrHeroSection.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrNewsletterSignpost from '~/components/Modules/VsBrNewsletterSignpost.vue';
import VsBrMedia from '~/components/Modules/VsBrMedia.vue';
import VsBrRichText from '~/components/Modules/VsBrRichText.vue';
import VsBrPreviewError from '~/components/Modules/VsBrPreviewError.vue';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsListicleItem,
    VsLink,
    VsIcon,
    VsPanel,
    VsHeading,
    VsBody,
} from '@visitscotland/component-library/components';

const props = defineProps<{ component: Component, page: Page }>();

const { page, component } = toRefs(props);

let documentData : any = {
};
let otyml : any = null;

const configStore = useConfigStore();

let listicleItems = [];
let listicleClosing = null;

if (page.value) {
    const pageDocument = page.value.getContent(configStore.pageDocument);

    documentData = pageDocument.getData();
    if (configStore.otyml) {
        otyml = configStore.otyml;
    }

    if (component.value) {
        listicleItems = component.value.model.models.items;
    }

    listicleClosing = documentData.listicleClosing;
}

</script>

<style scoped>
.vs-icon-list {
    text-align: center;
}

.vs-icon-list .vs-icon-list__title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
}

.vs-icon-list .vs-icon-list__list {
    display: inline-block;
    margin: 0 auto;
    padding: 0;
    text-align: left;
}

.vs-icon-list__item {
    display: inline-table;
    text-align: center;
    width: 90px;
    margin-bottom: 1rem;
    padding: 0 0.25rem;
    font-size: 0.875rem;
}

.vs-icon-list__item :deep(.vs-icon) {
    margin-bottom: 0.75rem;
}
</style>
