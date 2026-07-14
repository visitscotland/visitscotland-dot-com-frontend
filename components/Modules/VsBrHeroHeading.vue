<template>
    <VsCol
        cols="12"
        sm="8"
        md="9"
        lg="7"
    >
        <VsHeading
            level="1"
            heading-style="display-s"
            id="main-heading"
            no-margins
            class="text-brand"
        >
            {{ content.title }}
        </VsHeading>
    </VsCol>
    <VsCol
        cols="12"
        sm="9"
        lg="4"
        class="mt-100 mt-lg-0 offset-lg-1"
    >
        <VsBody
            v-if="content.teaser"
            variant="lead"
        >
            <p class="mb-0">
                {{ content.teaser }}
            </p>
        </VsBody>
    </VsCol>
    <VsCol
        v-if="$slots.button"
        cols="12"
        class="mt-200 d-flex flex-column flex-sm-row"
    >
        <slot name="button"/>
    </VsCol>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';

import {
    VsCol,
    VsHeading,
    VsBody,
} from '@visitscotland/component-library/components';

const props = defineProps<{
    content: any,
}>();

const { content } = toRefs(props);
</script>
