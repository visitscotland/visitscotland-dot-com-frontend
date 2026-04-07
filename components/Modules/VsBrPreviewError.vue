<template>
    <VsContainer
        class="py-100"
        v-if="messages && messages.length && page.isPreview()"
    >
        <VsAlert>
            <div>
                <p class="text-danger pb-050">
                    <strong>CMS ERROR!</strong>
                </p>

                <VsList>
                    <li
                        v-for="(error, index) in messages"
                        :key="index"
                    >
                        {{ error }}
                    </li>
                </VsList>
            </div>
        </VsAlert>
    </VsContainer>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsContainer,
    VsAlert,
    VsList,
} from '@visitscotland/component-library/components';

const page: Page | undefined = inject('page');

const props = defineProps<{ messages: string[], }>();

const messages : string[] = props.messages;
</script>
