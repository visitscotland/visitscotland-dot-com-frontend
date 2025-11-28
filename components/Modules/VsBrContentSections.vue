<template>
    <div class="d-flex flex-column gap-500">
        <VsContainer
            v-for="(stop, index) in stops"
            :key="index">
            <VsCol
                cols="12"
                md="8"
                offset="md-4"
                >
                <VsRow>
                    <div class="d-flex flex-column gap-125">
                        <div class="d-flex flex-column-reverse gap-175">
                            <div class="d-flex flex-column gap-050">
                                <VsHeading
                                           heading-style="heading-s"
                                           level="3"
                                           no-margins>
                                    {{ stop.title }}
                                </VsHeading>
                                <p>{{ stop.subTitle }}</p>
                            </div>
                            <VsImg :src="stop.image.externalImage" />
                        </div>
                        <!-- All VsBody does is add mb I don't want  -->
                        <!-- <VsBody variant="normal"> -->
                        <VsBrRichText :input-content="stop.description.value" />
                        <!-- </VsBody> -->
                    </div>
                </VsRow>
                <!-- TO DO: Link not button -->
                <VsButton class="mt-125" variant="secondary">
                    {{ stop.ctaLink.label }}
                </VsButton>
            </VsCol>
        </VsContainer>
    </div>
</template>

<script setup lang="ts">
import {
    VsImg,
    VsHeading,
    VsButton,
    VsContainer,
    VsCol,
    VsRow,
} from '@visitscotland/component-library/components';

const props = defineProps<{
    stops: any,
}>();
const stops: any = props.stops;
</script>
