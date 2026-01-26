<template>
    <VsBrPageIntro
        :content="documentData"
        :light-background="true"
    />
</template>

<script lang="ts" setup>
import useConfigStore from '~/stores/configStore.ts';

import VsBrPageIntro from '~/components/Modules/VsBrPageIntro.vue';

const configStore = useConfigStore();

let documentData : any = {
};

if (configStore.pageDocument) {
    documentData = configStore.pageDocument.getData();
}

</script>
