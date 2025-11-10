<template>
    <div v-if="moduleData.bespoken === 'carbon-calculator'">
        <VsBrCarbonCalculator />
    </div>
    <div
        v-else
        v-html="moduleData.html"
    />
</template>

<script lang="ts" setup>
/* eslint-disable import/no-import-module-exports */
/* eslint no-undef: 0 */

import VsBrCarbonCalculator from './VsBrCarbonCalculator.vue';

const props = defineProps<{ module: Object, content: Object, }>();
const content: any = props.content;
const moduleData = content?.model?.data || {
};

const scripts = [];
const styles = [];

for (let x = 0; x < moduleData.headContributions?.length; x++) {
    const contribution = moduleData.headContributions[x];

    scripts.push({
        src: contribution,
    });
}

for (let x = 0; x < moduleData.footerContributsions?.length; x++) {
    const contribution = moduleData.footerContributsions[x];

    styles.push(
        {
            rel: 'stylesheet',
            href: contribution,
        },
    );
}

useHead({
    script: scripts,
    link: styles,
});

</script>
