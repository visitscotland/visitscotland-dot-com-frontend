<template>
    <VsContainer class="mt-n100 mb-300">
        <VsRow>
            <VsCol
                cols="12"
                lg="8"
                offset-lg="2"
            >
                <VsBrImageWithCaption
                    :is-video="false"
                    variant="fullwidth"
                    :image="image"
                    :image-description="configStore.heroImage?.description"
                />
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';

import {
    VsContainer, VsRow, VsCol,
} from '@visitscotland/component-library/components';

import VsBrImageWithCaption from '~/components/Modules/VsBrImageWithCaption.vue';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

const props = defineProps<{
    image?: any,
}>();

const { image } = toRefs(props);
</script>
