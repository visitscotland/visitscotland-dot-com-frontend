<template>
    <div
        class="vs-module-wrapper__outer"
        v-for="(item, index) in modules"
        :key="index"
        :id="`section-${index}`"
        :class="{ 'has-edit-button': page.isPreview() }"
    >
        <BrManageContentButton
            v-if="item.hippoBean && page"
            :content="hippoContent[index]"
        />

        <template
            v-if="item.type === 'ListLinksModule'"
        >
            <NuxtLazyHydrate
                :when-visible="{ rootMargin: '50px' }"
            >
                <VsBrListLinksModule
                    v-if="hippoContent[index].model.data.layout === 'List' || hippoContent[index].model.data.layout === 'Default'"
                    :module="item"
                    :theme="item.themeValue"
                />
            </NuxtLazyHydrate>

            <NuxtLazyHydrate
                :when-visible="{ rootMargin: '50px' }"
            >
                <VsBrHorizontalLinksModule
                    v-if="hippoContent[index].model.data.layout === 'Horizontal Links'"
                    :module="item"
                    :theme="item.themeValue"
                />
            </NuxtLazyHydrate>
        </template>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'MultiImageLinksModule'"
        >
            <VsBrMultiImageLinksModule
                :module="item"
                :theme="item.themeValue"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'SingleImageLinksModule'"
        >
            <VsBrSingleImageLinksModule
                :module="item"
                :theme="item.themeValue"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'ArticleModule'"
        >
            <VsBrArticleModule
                :module="item"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'LongCopyModule'"
        >
            <VsBrLongCopyModule
                :module="item"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'FormModule'"
        >
            <VsBrForm
                :module="item"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'TravelInformationModule'"
        >
            <VsBrTravelInformationModule
                :module="item"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'ICentreModule'"
        >
            <VsBrTourismInformationModule
                :module="item"
                theme="grey"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'MapsModule'"
        >
            <Suspense>
                <component
                    :is="VsBrMapWithSidebar"
                    :module="item"
                />
            </Suspense>
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'SkiListModule'"
        >
            <VsBrSkiListModule
                :module="item"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'SkiModule'"
        >
            <VsBrSkiModule
                :module="item"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'CannedSearchModule'"
        >
            <VsBrCannedSearchModule
                :module="item"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate
            :when-visible="{ rootMargin: '50px' }"
            v-else-if="item.type === 'UserGeneratedContentModule'"
        >
            <VsBrUGCModule
                :module="item"
            />
        </NuxtLazyHydrate>

        <div
            v-else-if="item.type === 'ErrorModule'"
        >
            <NuxtLazyHydrate
                :when-visible="{ rootMargin: '50px' }"
            >
                <VsBrPreviewError
                    v-if="page.isPreview()"
                    :messages="item.errorMessages"
                />
            </NuxtLazyHydrate>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { inject, defineAsyncComponent } from 'vue';

import type { Page } from '@bloomreach/spa-sdk';
import { BrManageContentButton } from '@bloomreach/vue3-sdk';

import VsBrListLinksModule from '~/components/Modules/VsBrListLinksModule.vue';
import VsBrHorizontalLinksModule from '~/components/Modules/VsBrHorizontalLinksModule.vue';
import VsBrMultiImageLinksModule from '~/components/Modules/VsBrMultiImageLinksModule.vue';
import VsBrSingleImageLinksModule from '~/components/Modules/VsBrSingleImageLinksModule.vue';
import VsBrTravelInformationModule from '~/components/Modules/VsBrTravelInformationModule.vue';
import VsBrTourismInformationModule from '~/components/Modules/VsBrTourismInformationModule.vue';
import VsBrArticleModule from '~/components/Modules/VsBrArticleModule.vue';
import VsBrLongCopyModule from '~/components/Modules/VsBrLongCopyModule.vue';
import VsBrSkiListModule from '~/components/Modules/VsBrSkiListModule.vue';
import VsBrSkiModule from '~/components/Modules/VsBrSkiModule.vue';
import VsBrForm from '~/components/Modules/VsBrForm.vue';
import VsBrCannedSearchModule from '~/components/Modules/VsBrCannedSearchModule.vue';
import VsBrUGCModule from '~/components/Modules/VsBrUGCModule.vue';
import VsBrPreviewError from '~/components/Modules/VsBrPreviewError.vue';

import themeCalculator from '~/composables/themeCalculator.ts';

const VsBrMapWithSidebar = defineAsyncComponent(() => import('~/components/Modules/VsBrMapWithSidebar.vue'));

const props = defineProps<{
    modules: any[],
}>();

const { modules } = props;

const page: Page | undefined = inject('page');

const themeCount = 3;
let currentMegaLinkSection = -1;
const hippoContent : any = {
};

if (modules) {
    for (let x = 0; x < modules.length; x++) {
        let newThemeIndex = 1;

        if (
            modules[x].type === 'ListLinksModule'
            || modules[x].type === 'MultiImageLinksModule'
            || modules[x].type === 'SingleImageLinksModule'
        ) {
            if (modules[x].title || currentMegaLinkSection === -1) {
                currentMegaLinkSection += 1;
            }

            newThemeIndex = currentMegaLinkSection % themeCount;
        }

        modules[x].themeIndex = newThemeIndex;
        modules[x].themeValue = themeCalculator(newThemeIndex);

        if (modules[x].hippoBean) {
            hippoContent[x] = page.getContent(modules[x].hippoBean);
        }
    }
}
</script>
