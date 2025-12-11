<template>
    <div id="cludo-search-results" class="cludo-search-results">
        <div class="cludo-search-results__layout mb-300 mb-md-500">
            <VsEmbedWrapper
                no-cookies-required
                no-cookie-text="You need cookies enabled to view this content"
                :error-text="configStore.getLabel('essentials.global', 'third-party-error')"
                :no-js-text="configStore.getLabel('search', 'no-js')"
            >
                <template #embed-widget>
                    <div class="row">
                        <div class="col-12 col-lg-10 offset-lg-1 mb-100 mb-lg-200">
                            <div class="cludo-search-results__search-result-count search-result-count" role="status" />
                            <div class="cludo-search-results__did-you-mean search-did-you-mean" role="Complementary" />
                            <div class="cludo-search-results__facets search-filters" aria-controls="search-results" />
                        </div>

                        <div class="col-12 col-lg-10 offset-lg-1" role="main">
                            <div class="cludo-search-results__results-wrapper">
                                <div class="cludo-search-results__results search-results" role="region" id="search-results" aria-live="polite" />
                            </div>
                        </div>
                    </div>
                </template>
            </VsEmbedWrapper>
        </div>
    </div>
</template>

<script setup>
// eslint-disable-next-line import/no-unresolved
import { VsEmbedWrapper } from '@visitscotland/component-library/components';

import useConfigStore from '~/stores/configStore.ts';

const configStore = useConfigStore();

</script>
