<template>
    <div />
    <!-- <VsMap /> -->
</template>

<script lang="ts" setup>
/**
 * This component is unused in business events but stands as an example of
 * how to integrate components like this that we only sometimes want. In the
 * consuming component it should be imported like so:
 *
 * const VsBrMap = defineAsyncComponent(() => import('../Modules/VsBrMap.vue'));
 *
 * and then used like so:
 *
 * <Suspense
 *      v-if="xxxx"
 *  >
 *      <component
 *          :is="VsBrMap"
 *      />
 *  </Suspense>
 *
 * This prevents the component from being bundled into entry.js, so it loads
 * asynchronously as a separate js chunk which then contains all of the code
 * for Maps on specifically the page it is used.
 *
 * We don't use this approach for our more heavily used components like
 * megalinks as they contain a very low weight of JS and it makes sense to export
 * them as part of the main entrypoint. This allows them to be bundled and for
 * their dependent components to be de-duped.
 */

// import { VsMap } from '@visitscotland/component-library/maps';
</script>
