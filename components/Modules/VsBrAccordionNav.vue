<template>
    <VsAccordion>
        <VsMegaNavAccordionItem
            v-for="(menuItem, index) in links"
            :key="index"
            :title="menuItem.model.title"
            level="1"
            :control-id="index"
            :cta-link="`/${menuItem.getUrl() ? menuItem.getUrl() : menuItem.model.name}`"
            :cta-text="menuItem.model.cta"
            @click="$root.$emit('navAccordionClick', menuItem.model.title)"
        >
            <VsMegaNavAccordionItem
                v-for="(childMenuItem, childIndex) in menuItem.children"
                :key="childIndex"
                :title="childMenuItem.model.title"
                level="1"
                :control-id="index"
                @click="$root.$emit('navAccordionClick', childMenuItem.model.title)"
            >
                <VsMegaNavList>
                    <template #nav-list-items>
                        <VsMegaNavListItem
                            v-for="(gChildMenuItem, gChildIndex) in childMenuItem.children"
                            :key="gChildIndex"
                            :href="`/${gChildMenuItem.getUrl() ? gChildMenuItem.getUrl() : gChildMenuItem.model.name}`"
                        >
                            {{ gChildMenuItem.model.title }}
                        </VsMegaNavListItem>
                    </template>

                    <template
                        #nav-heading-cta-link
                    >
                        <VsMegaNavListItem
                            :href="`/${childMenuItem.getUrl() ? childMenuItem.getUrl() : childMenuItem.model.name}`"
                            subheading-link
                        >
                            {{ childMenuItem.model.cta }}
                        </VsMegaNavListItem>
                    </template>
                </VsMegaNavList>
            </VsMegaNavAccordionItem>

            <template
                v-if="menuItem.model.widget && menuItem.model.widget.type === 'FeaturedItem'"
            >
                <VsBrMegaNavFeaturedItem
                    :link="menuItem.model.widget.links[0]"
                />
            </template>

            <template
                v-if="menuItem.model.widget && menuItem.model.widget.type === 'FeaturedEvent'"
            >
                <VsMegaNavFeaturedEvent
                    :source-url="menuItem.model.widget.apiUrl"
                />
            </template>
        </VsMegaNavAccordionItem>
    </VsAccordion>
</template>

<script lang="ts" setup>

import {
    VsAccordion,
    VsMegaNavAccordionItem,
    VsMegaNavList,
    VsMegaNavListItem,
} from '@visitscotland/component-library/components';

// import VsBrMegaNavFeaturedItem from '~/components/Modules/VsBrMegaNavFeaturedItem.vue';

const props = defineProps<{ links: any[] }>();
const links: any = props.links;

</script>
