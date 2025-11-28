
    <VsContainer>
        <VsRow class="mt-500">
            <!-- First col: Section heading - Itinerary day -->
            <VsCol
                cols="12"
                lg="4"
            >
                <VsHeading
                    level="2"
                    heading-style="heading-l"
                    no-margins
                    class="mb-175 mb-lg-0"
                >
                    {{ itinerary.day[0].title }}
                </VsHeading>
            </VsCol>

            <!-- Second col: Section content -->
            <VsCol
                cols="12"
                lg="8"
            >
                <!------- Itinerary day intro ------->
                <VsBody class="mb-400">
                    {{ itinerary.days[0].introduction.value }}
                </VsBody>
            </VsCol>
        </VsRow>
    </VsContainer>
