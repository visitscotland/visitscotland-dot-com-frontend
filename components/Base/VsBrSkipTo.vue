<template>
    <VsSkipTo
        :skip-to-text="configStore.getLabel('skip-to', 'skip-to.label')"
        :has-search-link="false"
    >
        <template #main-menu-text>
            {{ configStore.getLabel('skip-to', 'skip-to.main-menu') }}
        </template>
        <template #main-content-text>
            {{ configStore.getLabel('skip-to', 'skip-to.main-content') }}
        </template>
        <template #footer-text>
            {{ configStore.getLabel('skip-to', 'skip-to.footer') }}
        </template>
    </VsSkipTo>
</template>

<script lang="ts" setup>
import { VsSkipTo } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();
</script>
