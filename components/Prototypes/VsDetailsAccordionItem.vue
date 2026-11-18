<template>
    <details>
        <summary>
            <slot name="title" />
        </summary>
        <slot name="content"/>
    </details>
</template>

<style scoped>
    summary::marker {
        content: "";
    }
</style>

<!-- # Notes -->
 <!-- - We can use the same #title slot name -->
  <!-- - control-id is perhaps not needed? investigate -->
   <!-- - Leave heading-level out at the heading can be slotted -->
    <!-- - variant is perhaps not needed - hardcoded in COM anyway -->
     <!-- - feeding the accordion specific open and closed icons seems weirdly granular - why do we do that? -->
      <!-- - and why do we permit internal layout (padding utilities)? shouldn't that be controlled from above? -->
       <!-- - VsAccordion itself takes no props - what's it actually doing? -->
