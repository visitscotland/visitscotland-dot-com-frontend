<template>
    <VsBrSectionHeader
        :heading="module.title"
    />

    <VsContainer>
            <VsTourismInfo>
                <template #tourism-info-image-with-caption>
                    <VsBrMedia
                        :image="module.image.cmsImage
                            ? module.image.cmsImage
                            : module.image.externalImage"
                        :no-alt-text="true"
                        class="text-start"
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
</template>

<script lang="ts" setup>

import VsBrSectionHeader from './VsBrSectionHeader.vue';

// import useConfigStore from '~/stores/configStore.ts';

import {
    VsContainer,
    VsTourismInfo,
} from '@visitscotland/component-library/components';

import VsBrMedia from './VsBrMedia.vue';
import VsBrQuote from './VsBrQuote.vue';

// const configStore = useConfigStore();

const props = defineProps<{ module: object }>();
const module: any = props.module;

</script>
