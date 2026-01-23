<template>
    <VsBreadcrumb>
        <VsBreadcrumbItem
            key="home"
            :href="`${rootUrl}/`"
            :text="configStore.getLabel('essentials.global', 'home')"
            :active="isHome"
        />

        <VsBreadcrumbItem
            v-for="(item, index) in definedBreadcrumb"
            :key="index"
            :href="getNavLink(item)"
            :text="item.title"
            :active="index === definedBreadcrumb.length - 1"
        />
    </VsBreadcrumb>
</template>

<script lang="ts" setup>
/* eslint no-undef: 0 */
/* eslint vue/html-indent: 0 */
import { toRefs } from 'vue';

import {
    VsBreadcrumb,
    VsBreadcrumbItem,
} from '@visitscotland/component-library/components';

import getNavLink from '~/composables/getNavLink.ts';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{
    breadcrumb: any[],
    isHome: boolean,
}>();

let rootUrl = window ? window.location.origin : '';

if (configStore.langString) {
    rootUrl = `${rootUrl}/${configStore.langString}`;
}

const { breadcrumb, isHome } = toRefs(props);

const definedBreadcrumb = breadcrumb.value
    ? breadcrumb.value
    : [];

let itemList : any[] = [
    {
        '@type': 'ListItem',
        position: 1,
        item: {
            '@id': `${ rootUrl }/`,
            name: configStore.getLabel('essentials.global', 'home'),
        },
    },
];

for (let x = 0; x < definedBreadcrumb.length; x++) {
    itemList = itemList.concat({
        '@type': 'ListItem',
        position: x + 2,
        item: {
            '@id': `${ rootUrl }${ definedBreadcrumb[x].link.href }`,
            name: definedBreadcrumb[x].title,
        },
    });
}

useJsonld({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itemList,
});

</script>
