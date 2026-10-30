<template>
    <VsContainer class="vs-br-supplier-details">
        <p v-if="pending" role="status">
            Loading supplier…
        </p>
        <div v-else-if="error" role="alert">
            <p v-if="error.statusCode === 404">
                Supplier not found.
            </p>
            <template v-else>
                <p>Supplier details could not be loaded.</p>
                <VsButton @click="refresh()">
                    Try again
                </VsButton>
            </template>
        </div>
        <div v-else-if="supplier">
            <VsImg
                v-if="supplier.imageUrl"
                :src="supplier.imageUrl"
                :alt="supplier.name"
                class="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover mb-150"
            />
            <VsHeading
                heading-style="heading-m"
                level="2"
                class="mt-0 mb-075"
            >
                {{ supplier.name }}
            </VsHeading>

            <VsBody
                class="mb-125"
            >
                <VsBrRichText :input-content="supplier.description" />
            </VsBody>
        
            <div v-if="supplier.commission" class="supplier-details__footer-field">
                <VsIcon
                    icon="fa-regular fa-pen-to-square"
                    size="sm"
                    class="supplier-details__footer-icon"
                    aria-hidden="true"
                />
                <span>Commission: {{ supplier.commission }}</span>
                <hr class="vs-divider vs-divider--variant-primary">
            </div>
            
            <div v-if="supplier.contactName" class="supplier-details__footer-field">
                <VsIcon
                    icon="fa-regular fa-user"
                    size="sm"
                    class="supplier-details__footer-icon"
                    aria-hidden="true"
                />
                <span>{{ supplier.contactName }}</span>
                <hr class="vs-divider vs-divider--variant-primary">
            </div>
            
            <div v-if="supplier.phoneNumber" class="supplier-details__footer-field">
                <VsIcon
                    icon="fa-regular fa-phone"
                    size="sm"
                    class="supplier-details__footer-icon"
                    aria-hidden="true"
                />
                <a :href="`tel:${supplier.phoneNumber.replace(/\s+/g, '')}`">
                    {{ supplier.phoneNumber }}
                </a>
                <hr class="vs-divider vs-divider--variant-primary">
            </div>
            
            <div v-if="supplier.emailAddress" class="supplier-details__footer-field">
                <VsIcon
                    icon="fa-regular fa-envelope"
                    size="sm"
                    class="supplier-details__footer-icon"
                    aria-hidden="true"
                />
                <a :href="`mailto:${supplier.emailAddress.trim()}`">
                    {{ supplier.emailAddress }}
                </a>
                <hr class="vs-divider vs-divider--variant-primary">
            </div>
            
            <div v-if="supplier.url" class="supplier-details__footer-field">
                <VsIcon
                    icon="fa-regular fa-globe"
                    size="sm"
                    class="supplier-details__footer-icon"
                    aria-hidden="true"
                />
                <a :href="websiteHref(supplier.url)">
                    {{ supplier.url }}
                </a>
                <hr class="vs-divider vs-divider--variant-primary">
            </div>
            
            <div v-if="supplier.address" class="supplier-details__footer-field">
                <VsIcon
                    icon="fa-regular fa-location-dot"
                    size="sm"
                    class="supplier-details__footer-icon"
                    aria-hidden="true"
                />
                <div>
                    <span
                        v-for="(line, index) in supplier.address.split(',')"
                        :key="index"
                        class="supplier-details__address-line"
                    >
                        {{ line.trim() }}
                    </span>
                </div>
            </div>
        </div>
    </VsContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFetch, useRoute } from '#imports';
import {
    VsContainer, VsHeading, VsBody, VsIcon, VsImg, VsButton,
} from '@visitscotland/component-library/components';
import type { Supplier } from '~/types/suppliers';
import VsBrRichText from './VsBrRichText.vue';

const route = useRoute();
const supplierId = computed(() => route.path.split('/').filter(Boolean).at(-1) || 'missing');
const { data: supplier, pending, error, refresh } = useFetch<Supplier>(
    () => `/api/frontend/suppliers/${encodeURIComponent(supplierId.value)}`,
);

function websiteHref(url: string) {
    const value = url.trim();
    return /^https?:\/\//i.test(value) ? value : `http://${value.replace(/^\/\//, '')}`;
}
</script>
<style scoped>
.supplier-details__footer-field {
    display: grid;
    grid-template-columns: 1.25rem minmax(0, 1fr);
    column-gap: 0.75rem;
    align-items: start;
    overflow-wrap: anywhere;
}

.supplier-details__footer-icon {
    justify-self: center;
    margin-top: 0.2rem;
}

.supplier-details__footer-field > hr {
    grid-column: 1 / -1;
    width: 100%;
}
.supplier-details__address-line {
    display: block;
}

</style>
