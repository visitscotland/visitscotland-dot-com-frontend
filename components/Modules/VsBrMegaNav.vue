<template>
    <template
        v-for="(menuItem, index) in links"
        :key="index"
    >
        <VsMegaNavDropdownContainer
            :href="`/${menuItem.getUrl() ? menuItem.getUrl() : menuItem.model.name}`"
            :cta-text="menuItem.model.cta ? menuItem.model.cta : ''"
        >
            <template #button-content>
                {{ menuItem.model.title }}
            </template>

            <template #dropdown-content>
                <VsMegaNavList
                    v-for="(childItem, childIndex) in menuItem.children"
                    :key="childIndex"
                    v-show="childItem.model.title"
                >
                    <template #nav-list-items>
                        <VsMegaNavListItem
                            v-for="(gChildItem, gChildIndex) in childItem.children"
                            :key="gChildIndex"
                            v-show="gChildItem.title"
                            :href="`/${gChildItem.getUrl() ? gChildItem.getUrl() : gChildItem.model.name}`"
                        >
                            {{ gChildItem.model.title }}
                        </VsMegaNavListItem>
                    </template>

                    <template
                        #nav-heading-cta-link
                        v-if="childItem.model.cta"
                    >
                        <VsMegaNavListItem
                            :href="`/${childItem.getUrl() ? childItem.getUrl() : childItem.model.name}`"
                            subheading-link
                        >
                            {{ childItem.model.cta }}
                        </VsMegaNavListItem>
                    </template>
                </VsMegaNavList>
            </template>

            <template
                v-if="menuItem.model.widget && menuItem.model.widget.type === 'FeaturedItem'"
                #nav-featured-item
            >
                <VsBrMegaNavFeaturedItem
                    :link="menuItem.model.widget.links[0]"
                />
            </template>

            <template
                v-if="menuItem.model.widget && menuItem.model.widget.type === 'FeaturedItem'"
                #nav-featured-item-left
            >
                <VsBrMegaNavFeaturedItem
                    v-if="menuItem.model.widget.links.length > 1"
                    :link="menuItem.model.widget.links[1]"
                />
            </template>

            <template
                #nav-featured-event
                v-if="menuItem.model.widget && menuItem.model.widget.type === 'FeaturedEvent'"
            >
                <VsMegaNavFeaturedEvent
                    :source-url="menuItem.model.widget.apiUrl"
                />
            </template>
        </VsMegaNavDropdownContainer>
    </template>
</template>

<script lang="ts" setup>

import {
    VsMegaNavDropdownContainer,
    VsMegaNavList,
    VsMegaNavListItem,
    VsMegaNavFeaturedEvent,
} from '@visitscotland/component-library/components';

import VsBrMegaNavFeaturedItem from '~/components/Modules/VsBrMegaNavFeaturedItem.vue';

const props = defineProps<{ links: any[] }>();
const links: any = props.links;

</script>
