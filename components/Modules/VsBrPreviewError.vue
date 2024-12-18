<template>
    <VsContainer
        class="py-100"
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
import {
    VsContainer,
    VsAlert,
    VsList,
} from '@visitscotland/component-library/components';

const props = defineProps<{ messages: string[], }>();

const messages : string[] = props.messages;
</script>
