<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div
        v-if="configStore.pageMetaData
            && (configStore.pageMetaData.branch || configStore.pageMetaData.pr)"
        style="background-color: #200F2E;"
    >
        <div class="d-flex flex-column flex-lg-row justify-content-lg-between container-lg py-050">
            <span class="text-warning"><strong>Branch:</strong> {{ configStore.pageMetaData.branch }}</span>
            <span class="text-warning"><strong>Author:</strong> {{ configStore.pageMetaData.lastCommitAuthor }}</span>
            <span
                v-if="configStore.pageMetaData.pr"
                class="text-warning"
            >
                <strong>PR:</strong> {{ configStore.pageMetaData.pr }}
            </span>
        </div>
    </div>

    <div class="vs-sticky-nav vs-sticky-nav--has-content" :class="{ 'has-edit-button': page.isPreview() }">
        <VsBrSkipTo />
        <header>
            <VsGlobalMenu
                :active-site="configStore.activeSite === 'be'
                    ? 'https://businessevents.visitscotland.com/'
                    : 'https://www.visitscotland.com/'"
            >
                <template #third-menu-item>
                    <VsGlobalMenuLanguage
                        :language="configStore.locale"
                        :language-label="configStore.getLabel('navigation.static', 'universal.language')"
                    >
                        <VsGlobalMenuLanguageItem
                            v-for="(language, index) in localisedUrls"
                            :key="index"
                            :language-link="formatLink(language.url)"
                            :language-name="language.displayName"
                            :language="language.locale.language"
                        />
                    </VsGlobalMenuLanguage>
                </template>
            </VsGlobalMenu>

            <div style="display: none;" aria-hidden="true">
                Navigation generated at {{ cacheBustDate }}
            </div>

            <BrManageMenuButton :menu="menuData" />

            <VsMeganav
                href="/"
                :menu-toggle-alt-text="configStore.getLabel('navigation.static', 'meganav-toggle-btn-alt-text')"
                :search-button-text="configStore.getLabel('search', 'search')"
                :search-label-text="configStore.getLabel('search', 'search-label')"
                :search-clear-button-text="configStore.getLabel('search', 'clear-form')"
                :search-close-button-text="configStore.getLabel('search', 'close-form')"
                :logo-alt-text="configStore.getLabel('navigation.static', 'meganav.logo-alt-text')"
                :is-static="true"
            >
                <template #mega-nav-top-menu-items>
                    <VsBrMegaNav
                        :links="menuItems"
                    />
                </template>

                <template #mega-nav-accordion-items>
                    <VsBrAccordionNav
                        :links="menuItems"
                    />
                </template>
            </VsMeganav>
        </header>
    </div>

    <VsBanner
        v-if="banner"
        :close-btn-text="configStore.getLabel('essentials.global', 'close')"
    >
        <template #banner-text>
            <div v-html="banner.copy.value" />
        </template>

        <template #banner-cta>
            <VsLink
                :href="banner.ctaLink.link"
                :type="banner.ctaLink.type"
            >
                {{ banner.ctaLink.label }}
            </VsLink>
        </template>
    </VsBanner>
</template>

<script lang="ts" setup>
import { toRefs, provide } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';
import { BrManageMenuButton } from '@bloomreach/vue3-sdk';

import formatLink from '~/composables/formatLink.ts';

import useConfigStore from '~/stores/configStore.ts';

import {
    VsGlobalMenu,
    VsGlobalMenuLanguage,
    VsGlobalMenuLanguageItem,
    VsMeganav,
    VsBanner,
    VsLink,
} from '@visitscotland/component-library/components';

import VsBrSkipTo from '~/components/Base/VsBrSkipTo.vue';

import VsBrMegaNav from '~/components/Modules/VsBrMegaNav.vue';
import VsBrAccordionNav from '~/components/Modules/VsBrAccordionNav.vue';

const props = defineProps<{ component: Component, page: Page }>();

const { component, page } = toRefs(props);

let menu = {
    $ref: '',
};
let menuData : any = {
};
let menuItems : any[] = [];
let localisedUrls : any[] = [];
let banner : any = null;

let cacheBustDate : string = '';

const configStore = useConfigStore();

if (page.value) {
    menu = component.value.getModels().menu;
    menuData = page.value.getContent(menu.$ref);
    menuItems = menuData.items;
    localisedUrls = component.value.getModels().localizedURLs;

    banner = component.value.getModels().banner;
    if (banner && banner.ctaLink) {
        banner.ctaLink.link = banner.ctaLink.link.replace('/site/resourceapi', '');
    }

    const timestamp = menuData.model.data.timeStamp;
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    const hours = String(date.getHours());
    const minutes = String(date.getMinutes());
    const seconds = String(date.getSeconds());

    cacheBustDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

provide('page', page.value);
</script>
