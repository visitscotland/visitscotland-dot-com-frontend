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

    <template v-if="checkFlags('use-navbar')">
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

        <!-- Navbar To Do - Switch to feature flag -->
        <div
            class="vs-sticky-nav--no-global"
            :class="{ 'transparent-nav-bar': shouldShowTransparent }"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
            @focusin="isFocused = true"
            @focusout="isFocused = false"
        >
            <!-- Navbar To Do - Get real labels -->
            <VsNavigationBar
                :sidebar-close-label="configStore.getLabel('navigation.static', 'meganav.sidebar-close-label')"
                :sidebar-open-label="configStore.getLabel('navigation.static', 'meganav.sidebar-open-label')"
                :sidebar-title="configStore.getLabel('navigation.static', 'meganav.sidebar-title')"
                sidebar-breakpoint="xl"
            >
                <template #logo-link>
                    <VsSvgLink
                        :link-alt-text="configStore.getLabel('navigation.static', 'meganav.logo-alt-text')"
                        :href="`/${configStore.langString}`"
                        svg-fill="#5B2487"
                        svg-path="visitscotland-logo"
                        svg-width="167px"
                        svg-height="28px"
                    />
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
                                        :key="dropdownIndex"
                                        :href="getNavLink(dropdownItem)"
                                    >
                                        {{ dropdownItem.model.title }}
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
                                class="d-none d-md-block me-075"
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
    <template v-else>
        <div
            class="vs-sticky-nav vs-sticky-nav--has-content"
            :class="{ 'has-edit-button': page.isPreview() }"
        >
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
                    :href="`/${configStore.langString}`"
                    :menu-toggle-alt-text="configStore.getLabel('navigation.static', 'meganav-toggle-btn-alt-text')"
                    :search-button-text="configStore.getLabel('search', 'search')"
                    :search-label-text="configStore.getLabel('search', 'search-label')"
                    :search-clear-button-text="configStore.getLabel('search', 'clear-form')"
                    :search-close-button-text="configStore.getLabel('search', 'close-form')"
                    :logo-alt-text="configStore.getLabel('navigation.static', 'meganav.logo-alt-text')"
                    :is-static="true"
                    :search-link="configStore.searchDmsBased ? '' : configStore.globalSearchPath"
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
</template>

<script lang="ts" setup>
import {
    toRefs, provide, ref, computed, onMounted, onUnmounted,
} from 'vue';
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
    VsNavigationBar,
    VsSvgLink,
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

const isHovered = ref(false);
const isFocused = ref(false);
const scrollY = ref(1);

const shouldShowTransparent = computed(() => configStore.isLocalVideoheader
    && checkFlags('use-navbar')
    && scrollY.value === 0
    && !isHovered.value
    && !isFocused.value);

function handleScroll() {
    scrollY.value = window.scrollY;
}

onMounted(() => {
    scrollY.value = window.scrollY;
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

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

<style lang="scss">
    .vs-navigation-bar {
        transition: background-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
    }

    .transparent-nav-bar .vs-navigation-bar {
        background-color: rgba(0,0,0,0);
        box-shadow: none;

        .vs-svg-link > svg {
            fill: white !important;
        }

        .vs-navigation-bar-menu-dropdown > .btn {
            color: white;

            &:after {
                color: white;
            }
        }

        .vs-navigation-bar-menu-item > a {
            color: white;
        }

        .dropdown-menu > .vs-navigation-bar-menu-item > a {
            color: #200f2e;
        }

        .vs-button--icon-only.btn-subtle i {
            color: white !important;
        }

        .vs-navigation-bar__search-link {
            background-color: rgba(0,0,0,0);
            color: white;
            border-color: white;

            i {
                color: white !important;
            }
        }
    }
</style>
