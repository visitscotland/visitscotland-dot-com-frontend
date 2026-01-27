<template>
    <div class="mt-175 mt-md-500 mb-175 mb-md-500">
        <VsBrSpotlightSection
            :module="moduleData"
        />
    </div>
</template>

<script lang="ts" setup>
import VsBrSpotlightSection from '~/components/Modules/VsBrSpotlightSection.vue';

const props = defineProps<{ data: any, }>();

const data : any = props.data;

const moduleData = {
    ...data,
    layout: 'compact',
};
</script>
