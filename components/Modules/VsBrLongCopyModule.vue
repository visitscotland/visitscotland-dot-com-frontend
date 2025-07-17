<template>
    <VsContainer
        class="mb-400"
    >
        <VsRow>
            <VsCol
                cols="12"
                md="12"
                lg="7"
                xl="7"
                class="col-xxl-6"
            >
                <VsBody>
                    <VsBrRichText :input-content="module.copy.value" />
                </VsBody>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>

import {
    VsContainer,
    VsRow,
    VsCol,
    VsBody,
} from '@visitscotland/component-library/components';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

const props = defineProps<{ module: Object }>();
const module: any = props.module;

</script>
