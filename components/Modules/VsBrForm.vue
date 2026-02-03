<template>
    <VsContainer
        class="mb-400"
    >
        <VsRow>
            <VsCol
                cols="12"
                md="10"
                lg="7"
                class="col-xxl-6"
            >
                <VsForm
                    :is-marketo="module.config.type === 'marketo'"
                    :marketo-instance="module.config.marketoInstance ? module.config.marketoInstance : ''"
                    :munchkin-id="module.config.munchkinId ? module.config.munchkinId : ''"
                    :submit-url="module.config.submitUrl"
                    :data-url="module.config.jsonUrl"
                    :messaging-url="configStore.getLabel('forms', 'form.messaging-url')"
                    :country-list-url="configStore.getLabel('forms', 'form.country-url')"
                    :recaptcha-key="module.config.recaptcha"
                    :language="configStore.locale"
                    :is-prod="module.config.production ? module.config.production : false"
                    :recaptcha-textarea-label="configStore.getLabel('forms', 'form.recaptcha-textarea-label')"
                >
                    <template #no-js>
                        {{ configStore.getLabel('forms', 'form.no-js') }}
                    </template>

                    <template #submit-error>
                        {{ configStore.getLabel('forms', 'form.error') }}
                    </template>

                    <template #submitting>
                        {{ configStore.getLabel('forms', 'form.submitting') }}
                    </template>

                    <template #hidden-fields>
                        <input
                            v-if="module.config.activityCode"
                            type="hidden"
                            name="activity_code"
                            :value="module.config.activityCode"
                        >

                        <input
                            v-if="module.config.activityDescription"
                            type="hidden"
                            name="activity_description"
                            :value="module.config.activityDescription"
                        >

                        <input
                            v-if="module.config.activitySource"
                            type="hidden"
                            name="activity_source"
                            :value="module.config.activitySource"
                        >

                        <input
                            v-if="module.config.consents"
                            type="hidden"
                            name="consents"
                            :value="module.config.consents"
                        >

                        <input
                            v-if="module.config.legalBasis"
                            type="hidden"
                            name="legalBasis"
                            :value="module.config.legalBasis"
                        >
                    </template>
                </VsForm>
            </VsCol>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
import useConfigStore from '~/stores/configStore.ts';

import {
    VsContainer,
    VsRow,
    VsCol,
    VsForm,
} from '@visitscotland/component-library/components';

const configStore = useConfigStore();

const props = defineProps<{ module: Object }>();
const module: any = props.module;

</script>
