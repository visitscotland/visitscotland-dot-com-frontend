<template>
    <VsModuleWrapper
        v-if="module.storystreamId"
    >
        <template #vs-module-wrapper-heading>
            {{ module.title }}
        </template>
        <VsEmbedWrapper
            :no-cookie-text="configStore.getLabel('ugc', 'ugc.no-cookies-message')"
            :error-text="configStore.getLabel('essentials.global', 'third-party-error')"
            :no-js-text="configStore.getLabel('ugc', 'ugc.no-js-message')"
            :extra-content="configStore.getLabel('ugc', 'ugc.extra-warning-content')"
            :embedded-script="`https://apps.storystream.ai/app/js/${module.storystreamId}.js`"
        >
            <template
                #embed-intro-copy
                v-if="module.copy"
            >
                <VsBrRichText :input-content="module.copy.value" />
            </template>

            <template #embed-widget>
                <div id="stry-wrapper" />
            </template>

            <template #embed-button-text>
                {{ configStore.getLabel('essentials.global', 'cookie.link-message') }}
            </template>
        </VsEmbedWrapper>
    </VsModuleWrapper>
</template>

<script lang="ts" setup>
import { VsModuleWrapper, VsEmbedWrapper } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

import VsBrRichText from './VsBrRichText.vue';

const configStore = useConfigStore();

const props = defineProps<{ module: Object }>();
const module: any = props.module;

</script>
