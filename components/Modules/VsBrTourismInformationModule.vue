<template>
    <VsModuleWrapper :theme="theme">
        <template #vs-module-wrapper-heading>
            {{ module.title }}
        </template>
        <VsContainer>
            <VsTourismInfo>
                <template #tourism-info-image-with-caption>
                    <VsBrImageWithCaption
                        :image="module.image.cmsImage
                            ? module.image.cmsImage
                            : module.image.externalImage"
                        :no-alt-text="true"
                    />
                </template>
                <template
                    #tourism-info-quote
                    v-if="module.quote"
                >
                    <VsBrQuote
                        :quote="module.quote"
                        variant="wide"
                    />
                </template>
            </VsTourismInfo>
        </VsContainer>
    </VsModuleWrapper>
</template>

<script lang="ts" setup>

// import useConfigStore from '~/stores/configStore.ts';

import {
    VsModuleWrapper,
    VsContainer,
    VsTourismInfo,
} from '@visitscotland/component-library/components';

import VsBrImageWithCaption from './VsBrImageWithCaption.vue';
import VsBrQuote from './VsBrQuote.vue';

// const configStore = useConfigStore();

const props = defineProps<{ module: Object, theme: string }>();
const module: any = props.module;
const theme: string = props.theme;

const decoder = document.createElement('textarea');
decoder.innerHTML = 'broken content';

</script>
