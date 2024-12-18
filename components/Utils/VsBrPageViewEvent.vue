<template>
    <VsTagManagerWrapper
        :payload="eventPayload"
    />
</template>

<script lang="ts" setup>
import { VsTagManagerWrapper } from '@visitscotland/component-library/components';

const props = defineProps<{
    data: any,
    pageType: string,
}>();

const { data, pageType } = props;

// TODO - Location - content_region, content_city

let category : string = 'homepage';
let pathParts : string[] = [];

const eventPayload = {
    site_language: data.localeString,
    content_language: data.localeString,
    content_page_type: pageType === 'general-page'
        ? data.theme
        : pageType,
};

if (window && window.location.pathname) {
    pathParts = window.location.pathname.split('/');
    pathParts = pathParts.filter((next) => next.length);
}

for (let x = 0; x < pathParts.length; x++) {
    if (x === 0) {
        category = pathParts[x];
    }

    eventPayload[`page_category_${x}`] = pathParts[x];
}

eventPayload.content_category = category;

</script>
