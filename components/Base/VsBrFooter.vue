<template>
    <VsFooter :class="{ 'has-edit-button': page.isPreview() }">
        <template #accordion-items>
            <VsCol
                v-for="(menuItem, index) in menuItems"
                :key="index"
                cols="12"
                md="4"
                lg="3"
            >
                <VsFooterAccordionItem
                    :title="menuItem.model.title ? menuItem.model.title : ''"
                    :control-id="`footer_accordion_item${index}`"
                >
                    <template #icon-open>
                        <VsIcon
                            icon="fa-regular fa-chevron-up"
                            variant="inverse"
                            size="xs"
                        />
                    </template>

                    <template #icon-closed>
                        <VsIcon
                            icon="fa-regular fa-chevron-down"
                            variant="inverse"
                            size="xs"
                        />
                    </template>

                    <VsList
                        v-if="menuItem.loadedChildren.length"
                        unstyled
                        role="menu"
                    >
                        <template
                            v-for="(childItem, childIndex) in menuItem.loadedChildren"
                            :key="childIndex"
                        >
                            <VsFooterNavListItem
                                v-if="childItem.model.title"
                                :href="getNavLink(childItem)"
                                :link-text="childItem.model.title"
                                :type="childItem.model.links.site && childItem.model.links.site.type === 'external'
                                    ? childItem.model.links.site.type
                                    : 'default'"
                            />
                        </template>
                    </VsList>
                </VsFooterAccordionItem>
            </VsCol>
        </template>

        <BrManageMenuButton :menu="menuData" />

        <template #social-menu>
            <VsFooterSocialMenu
                v-if="configStore.labels"
            >
                <template #title>
                    Find us on
                </template>

                <VsFooterSocialItem
                    v-for="(link, key, index) in configStore.labels['navigation.social-media']"
                    :key="index"
                    :href="link"
                    :icon="`fab fa-${key === 'twitter' ? 'x-twitter' : key}`"
                />
            </vsfootersocialmenu>
        </template>

        <template
            v-for="(utilityMenu, index) in utilityMenuItems"
            :key="index"
        >
            <VsFooterUtilityList>
                <BrManageMenuButton :menu="utilityData" />
                <VsFooterNavListItem
                    v-for="(utilityItem, childIndex) in utilityMenu.children"
                    :key="childIndex"
                    :href="getNavLink(utilityItem)"
                    :link-text="utilityItem.model.title"
                    :type="utilityItem.model.links.site && utilityItem.model.links.site.type === 'external'
                        ? utilityItem.model.links.site.type
                        : 'default'"
                />
            </VsFooterUtilityList>
        </template>

        <VsFooterCopyright
            href="https://www.scotland.org/"
            :link-alt-text="configStore.getLabel('navigation.static', 'footer.logo-alt-text')"
        >
            <template #copyright>
                VisitScotland. All rights reserved.
            </template>
        </VsFooterCopyright>
    </VsFooter>
</template>

<script lang="ts" setup>
import {
    toRefs, ref, onMounted,
} from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';
import { BrManageMenuButton } from '@bloomreach/vue3-sdk';

import useConfigStore from '~/stores/configStore.ts';

import getNavLink from '~/composables/getNavLink.ts';

import {
    VsFooter,
    VsFooterAccordionItem,
    VsFooterNavListItem,
    VsFooterSocialMenu,
    VsFooterSocialItem,
    VsFooterCopyright,
    VsFooterUtilityList,
    VsList,
    VsIcon,
    VsCol,
} from '@visitscotland/component-library/components';

const props = defineProps<{ component: Component, page: Page }>();

const { component, page } = toRefs(props);

const configStore = useConfigStore();

let menu = {
    $ref: '',
};
let menuData : any = {
};
let menuItems : any[] = [];
let utilityData : any = {
};
let utilityMenuItems : any[] = [];

if (page.value) {
    menu = component.value.getModels().menu;
    if (menu) {
        menuData = page.value.getContent(menu.$ref);
        menuItems = menuData.items;

        for (let x = 0; x < menuItems.length; x++) {
            menuItems[x].loadedChildren = menuItems[x].getChildren();
        }
    }

    let children : any[] = [];

    children = component.value.getChildren();

    for (let x = 0; x < children.length; x++) {
        if (children[x].model.name === 'utility' && children[x].model.models.menu) {
            utilityData = page.value.getContent(children[x].model.models.menu.$ref);
            utilityMenuItems = utilityData.items;
        }
    }
}

const isMounted = ref(false);

onMounted(() => {
    isMounted.value = true;
});

</script>
