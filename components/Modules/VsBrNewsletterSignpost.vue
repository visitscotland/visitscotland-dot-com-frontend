<template>
    <VsModuleWrapper theme="neutral">
        <template #vs-module-wrapper-heading>
            {{ data.title }}
        </template>

        <VsContainer>
            <VsRow>
                <VsCol
                    cols="12"
                    sm="7"
                    md="6"
                    lg="5"
                    offset-lg="1"
                    class="text-center text-sm-start col-xxl-4"
                >
                    <VsBody
                        variant="lead"
                        class="mb-300 mb-lg-400"
                    >
                        <VsBrRichText :input-content="data.copy.value" />
                    </VsBody>

                    <VsButton
                        :href="data.cta.link"
                    >
                        {{ data.cta.label }}
                    </VsButton>
                </VsCol>
                <VsCol
                    cols="10"
                    offset="1"
                    sm="5"
                    offset-sm="0"
                    md="6"
                    lg="5"
                    xl="5"
                    class="text-center text-lg-start col-xxl-5 offset-xxl-1"
                >
                    <VsImg
                        src="/illustrations/newsletter.svg"
                        class="mt-400 mt-sm-050 w-100 h-auto"
                        style="aspect-ratio:267/206"
                    />
                </VsCol>
            </VsRow>
        </VsContainer>
    </VsModuleWrapper>
</template>

<script lang="ts" setup>
import {
    VsModuleWrapper,
    VsContainer,
    VsRow,
    VsCol,
    VsBody,
    VsButton,
    VsImg,
} from '@visitscotland/component-library/components';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

const props = defineProps<{ data: any, }>();

const data : any = props.data;
</script>
