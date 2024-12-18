<template>
    <VsQuote :variant="variant">
        <template
            #quote-image
            v-if="quote.image"
        >
            <!-- TODO - move all srcset logic into comp library -->
            <VsImg
                alt=""
                :src="imageValue.getOriginal().getUrl()"
            />
        </template>

        <template #quote-content>
            <VsBrRichText :input-content="quoteContent.value" />
        </template>

        <template
            #quote-author-name
            v-if="quote.authorName"
        >
            {{ quote.authorName }}
        </template>

        <template
            #quote-author-title
            v-if="quote.authorTitle"
        >
            {{ quote.authorTitle }}
        </template>

        <template
            #quote-link
            v-if="quote.link"
        >
            <VsButton :href="quote.link.link">
                {{ quote.link.label }}
            </VsButton>
        </template>
    </VsQuote>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';

import {
    VsQuote,
    VsButton,
    VsImg,
} from '@visitscotland/component-library/components';

import VsBrRichText from '~/components/Modules/VsBrRichText.vue';

interface IProps {
    quote: any,
    variant?: string,
};

const props = withDefaults(defineProps<IProps>(), {
    variant: 'narrow',
});

const quote: any = props.quote;
const variant: string = props.variant;

const quoteContent = quote.quote;

const page: Page | undefined = inject('page');
let imageValue: any;

if (page && quote.image) {
    imageValue = page.getContent(quote.image.cmsImage.$ref);
}

</script>
