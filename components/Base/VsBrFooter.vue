<template>
    <div class="vs-sticky-nav" :class="{ 'has-edit-button': page.isPreview() }">
        <header>
            <h1>Footer component</h1>
        </header>

        <!-- <BrManageMenuButton :menu="menuData" /> -->

        <!-- <ul>
            <li
                v-for="(menuItem, index) in menuItems"
                :key="index"
            >
                <a
                    :href="menuItem.getUrl()"
                >
                    {{ menuItem.model.title }}
                </a>
            </li>
        </ul> -->
    </div>

    <Suspense
        v-if="isMounted"
    >
        <component
            :is="VsBrIconFonts"
        />
    </Suspense>
</template>

<script lang="ts" setup>
import {
    toRefs, ref, defineAsyncComponent, onMounted,
} from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';
import { BrManageMenuButton } from '@bloomreach/vue3-sdk';

const props = defineProps<{ component: Component, page: Page }>();

const { component, page } = toRefs(props);

// let menu = {
//     $ref: '',
// };
// let menuData : any = {
// };
// let menuItems : any[] = [];

if (page.value) {
    // Menu content can be retrieved from the models on the sdk core Menu component
    // like so
    // Multiple menus may exist depending on the site

    // menu = component.value.getModels().menu;
    // menuData = page.value.getContent(menu.$ref);
    // menuItems = menuData.items;
}

const isMounted = ref(false);

const VsBrIconFonts = defineAsyncComponent(() => import('../Utils/VsBrIconFonts.vue'));

onMounted(() => {
    isMounted.value = true;
});

</script>
