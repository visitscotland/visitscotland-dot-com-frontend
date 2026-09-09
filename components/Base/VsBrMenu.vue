<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div
        v-if="configStore.pageMetaData
            && (configStore.pageMetaData.branch || configStore.pageMetaData.pr)"
        style="background-color: #200F2E; position: relative; z-index: 10000;"
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

    <VsBrSkipTo />
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

    <div class="vs-sticky-nav--no-global">
        <!-- Navbar To Do - Get real labels -->
        <VsNavigationBar
            :sidebar-close-label="configStore.getLabel('navigation.static', 'meganav.sidebar-close-label')"
            :sidebar-open-label="configStore.getLabel('navigation.static', 'meganav.sidebar-open-label')"
            :sidebar-title="configStore.getLabel('navigation.static', 'meganav.sidebar-title')"
            sidebar-breakpoint="xl"
        >
            <template #logo-link>
                <VsLink
                    :href="`/${configStore.langString}`"
                    no-visited-styles
                >
                    <VsImg
                        src="/visitscotland-logo.svg"
                        :alt="configStore.getLabel('navigation.static', 'meganav.logo-alt-text')"
                        :style="{ width: '167px', height: '28px' }"
                    />
                </VsLink>
            </template>

            <template #navigation-bar-menu>
                <VsNavigationBarMenu
                    :menu-aria-label="configStore.getLabel('navigation.static', 'meganav.menu-aria-label')"
                >
                    <template
                        v-for="(menuItem, index) in menuItems"
                        :key="index"
                    >
                        <li v-if="menuItem.children && menuItem.children.length">
                            <VsNavigationBarMenuDropdown>
                                <template #button-content>
                                    {{ menuItem.model.title }}
                                </template>

                                <VsNavigationBarMenuItem
                                    v-for="(dropdownItem, dropdownIndex) in menuItem.children"
                                    v-show="getNavLink(dropdownItem)"
                                    :key="dropdownIndex"
                                    :href="getNavLink(dropdownItem)"
                                >
                                    {{ dropdownItem.model.title }}
                                </VsNavigationBarMenuItem>

                                <li
                                    v-if="menuItem.model.cta"
                                    class="my-075 mx-100"
                                >
                                    <VsLink
                                        :href="getNavLink(menuItem)"
                                        type="internal"
                                        no-visited-styles
                                    >
                                        {{ menuItem.model.cta }}
                                    </VsLink>
                                </li>
                            </VsNavigationBarMenuDropdown>
                        </li>

                        <VsNavigationBarMenuItem
                            v-else
                            variant="primary-menu-item"
                            :href="getNavLink(menuItem)"
                        >
                            {{ menuItem.model.title }}
                        </VsNavigationBarMenuItem>
                    </template>
                </VsNavigationBarMenu>
            </template>

            <template #navigation-bar-utilities>
                <nav
                    :aria-label="configStore.getLabel('navigation.static', 'meganav.utility-aria-label')"
                >
                    <ul class="d-flex">
                        <li class="me-075">
                            <VsButton
                                size="sm"
                                variant="secondary"
                                :href="configStore.globalSearchPath"
                                icon="vs-icon-control-search"
                                class="vs-navigation-bar__search-link"
                                show-label-breakpoint="md"
                            >
                                {{ configStore.getLabel('search', 'search') }}
                            </VsButton>
                        </li>

                        <li
                            class="d-none d-md-block me-025"
                            v-if="favourites.featureEnabled"
                        >
                            <VsTooltip
                                :title="configStore.getLabel('favourites', 'favourites.navigation.link.text')"
                                subtle
                                variant="subtle"
                                size="sm"
                                icon="fa-regular fa-heart"
                                icon-only
                                :href="favourites.displaySavedUrl"
                                class="d-block"
                            >
                                {{ configStore.getLabel('favourites', 'favourites.navigation.link.text') }}
                            </VsTooltip>
                        </li>

                        <li
                            class="d-none d-md-block me-025"
                        >
                            <VsTooltip
                                :title="configStore.getLabel('navigation.static', 'meganav.map-link-tooltip')"
                                subtle
                                variant="subtle"
                                size="sm"
                                icon="fa-regular fa-map"
                                icon-only
                                :href="configStore.mainMapPath"
                                class="d-block"
                            >
                                {{ configStore.getLabel('navigation.static', 'meganav.map-link-tooltip') }}
                            </VsTooltip>
                        </li>
                        <li
                            class="d-none d-md-block me-0 me-md-075 me-lg-0"
                        >
                            <VsNavigationBarMenuDropdown subtle>
                                <template #button-content>
                                    {{ configStore.locale.toUpperCase() }}
                                </template>

                                <VsNavigationBarMenuItem
                                    v-for="(language, index) in localisedUrls"
                                    :key="index"
                                    :href="formatLink(language.url)"
                                >
                                    {{ language.displayName }}
                                </VsNavigationBarMenuItem>
                            </VsNavigationBarMenuDropdown>
                        </li>
                    </ul>
                </nav>
            </template>

            <template #sidebar-body>
                <VsAccordion>
                    <nav
                        :aria-label="configStore.getLabel('navigation.static', 'meganav.menu-aria-label')"
                    >
                        <ul>
                            <template
                                v-for="(menuItem, index) in menuItems"
                                :key="index"
                            >
                                <li v-if="menuItem.children && menuItem.children.length">
                                    <VsAccordionItem
                                        :control-id="index.toString()"
                                    >
                                        <template #title>
                                            {{ menuItem.model.title }}
                                        </template>

                                        <ul>
                                            <VsNavigationBarMenuItem
                                                v-for="(mobileDropdownItem, mobileDropdownIndex)
                                                    in menuItem.children"
                                                :key="mobileDropdownIndex"
                                                :href="getNavLink(mobileDropdownItem)"
                                            >
                                                {{ mobileDropdownItem.model.title }}
                                            </VsNavigationBarMenuItem>

                                            <li class="my-075 mx-100">
                                                <VsLink
                                                    v-if="menuItem.model.cta"
                                                    :href="getNavLink(menuItem)"
                                                    type="internal"
                                                    no-visited-styles
                                                >
                                                    {{ menuItem.model.cta }}
                                                </VsLink>
                                            </li>
                                        </ul>
                                    </VsAccordionItem>
                                </li>

                                <template v-else>
                                    <VsNavigationBarMenuItem
                                        variant="primary-sidebar-item"
                                        :href="getNavLink(menuItem)"
                                    >
                                        {{ menuItem.model.title }}
                                    </VsNavigationBarMenuItem>

                                    <VsBrDivider class="my-025" />
                                </template>
                            </template>
                        </ul>
                    </nav>
                </VsAccordion>
            </template>

            <template
                #sidebar-footer
            >
                <div class="p-100 pb-300">
                    <nav :aria-label="configStore.getLabel('navigation.static', 'meganav.sidebar-utility-aria-label')">
                        <ul class="d-flex justify-content-end">
                            <li
                                class="d-block d-md-none me-075"
                                v-if="favourites.featureEnabled"
                            >
                                <VsTooltip
                                    :title="configStore.getLabel('favourites', 'favourites.navigation.link.text')"
                                    subtle
                                    variant="subtle"
                                    size="sm"
                                    icon="fa-regular fa-heart"
                                    icon-only
                                    :href="favourites.displaySavedUrl"
                                    class="d-block"
                                >
                                    {{ configStore.getLabel('favourites', 'favourites.navigation.link.text') }}
                                </VsTooltip>
                            </li>

                            <li class="d-block d-md-none me-075">
                                <VsTooltip
                                    :title="configStore.getLabel('navigation.static', 'meganav.map-link-tooltip')"
                                    subtle
                                    variant="subtle"
                                    size="sm"
                                    icon="fa-regular fa-map"
                                    icon-only
                                    :href="configStore.mainMapPath"
                                    class="d-block"
                                >
                                    {{ configStore.getLabel('navigation.static', 'meganav.map-link-tooltip') }}
                                </VsTooltip>
                            </li>
                            <li class="d-block d-md-none">
                                <VsNavigationBarMenuDropdown subtle>
                                    <template #button-content>
                                        {{ configStore.locale.toUpperCase() }}
                                    </template>

                                    <VsNavigationBarMenuItem
                                        v-for="(language, index) in localisedUrls"
                                        :key="index"
                                        :href="formatLink(language.url)"
                                    >
                                        {{ language.displayName }}
                                    </VsNavigationBarMenuItem>
                                </VsNavigationBarMenuDropdown>
                            </li>
                        </ul>
                    </nav>
                </div>
            </template>
        </VsNavigationBar>
    </div>
</template>

<script lang="ts" setup>
import { toRefs, provide } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';
import formatLink from '~/composables/formatLink.ts';
import { useFavourites } from '~/stores/favouritesStore.ts';
import useConfigStore from '~/stores/configStore.ts';

import {
    VsBanner,
    VsLink,
    VsNavigationBar,
    VsImg,
    VsNavigationBarMenu,
    VsNavigationBarMenuDropdown,
    VsNavigationBarMenuItem,
    VsTooltip,
    VsAccordion,
    VsAccordionItem,
    VsButton,
} from '@visitscotland/component-library/components';

import VsBrSkipTo from '~/components/Base/VsBrSkipTo.vue';

import VsBrDivider from '~/components/Modules/VsBrDivider.vue';

const favourites = useFavourites();
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

const configStore = useConfigStore();

if (page.value) {
    menu = component.value.getModels().menu;
    menuData = page.value.getContent(menu.$ref);
    menuItems = menuData.items;
    localisedUrls = component.value.getModels().localizedURLs;

    if (configStore.pathIfError) {
        for (let x = 0; x < localisedUrls.length; x++) {
            localisedUrls[x].url = localisedUrls[x].url.replace('/servererror', configStore.pathIfError);
        }
    }

    banner = component.value.getModels().banner;
    if (banner && banner.ctaLink) {
        banner.ctaLink.link = banner.ctaLink.link.replace('/site/resourceapi', '');
    }

}

provide('page', page.value);
</script>

<style lang="scss">
    .vs-favourites-link {
        font-size: .75rem;
        gap: 0.25rem;
        display: flex;
        align-items: center;
        color: white;
        text-decoration: none;
        height: 100%;
        padding: 0 1.5rem;
        transition: all .2s ease-in-out;
    }

    .vs-favourites-link:hover {
        background: #33225d;
        transition: all .2s ease-in-out;
    }

    .vs-favourites-link:focus {
        box-shadow: 0 0 0 2px #fffa99 inset;
        outline: none;
    }
</style>
