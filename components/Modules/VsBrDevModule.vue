<template>
    <VsBrCarbonCalculator
        v-if="moduleData.bespoken === 'carbon-calculator'"
    />

    <VsBrSupplierDetails
        v-else-if="module.id === 'supplier-listing'"
    />
    <VsBrSupplierListingModule
        v-else-if="module.id === 'supplier-search'"
    />

    <div
        v-else
        v-html="moduleData.html"
    />
</template>

<script lang="ts" setup>
 
/* eslint no-undef: 0 */

const props = defineProps<{ module: any, content: object, }>();
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
