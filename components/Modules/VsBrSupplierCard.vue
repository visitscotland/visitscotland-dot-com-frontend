<template>
    <VsCard
        card-style="elevated"
        class="vs-br-supplier-card p-100"
    >
        <template v-if="supplier.imageUrl" #vs-card-header>
            <VsImg
                :src="supplier.imageUrl"
                :alt="supplier.name"
                class="w-100 aspect-ratio-3-2 rounded-1 object-fit-cover"
            />
        </template>
        <template #vs-card-body>
            <VsHeading
                heading-style="heading-xxs"
                level="3"
                class="mt-0 mb-075"
            >
                {{ supplier.name }}
            </VsHeading>

            <VsBody
                class="mb-125"
            >
                <VsBrRichText :input-content="supplier.description" />
            </VsBody>
        </template>

        <template #vs-card-footer>
            <div v-if="supplier.commission" class="supplier-card__footer-field">
                <VsIcon
                    icon="fa-regular fa-pen-to-square"
                    size="sm"
                    class="supplier-card__footer-icon"
                    aria-hidden="true"
                />
                <span>Commission: {{ supplier.commission }}</span>
                <hr class="vs-divider vs-divider--variant-primary">
            </div>
            
            <div v-if="supplier.contactName" class="supplier-card__footer-field">
                <VsIcon
                    icon="fa-regular fa-user"
                    size="sm"
                    class="supplier-card__footer-icon"
                    aria-hidden="true"
                />
                <span>{{ supplier.contactName }}</span>
                <hr class="vs-divider vs-divider--variant-primary">
            </div>
            
            <div v-if="supplier.phoneNumber" class="supplier-card__footer-field">
                <VsIcon
                    icon="fa-regular fa-phone"
                    size="sm"
                    class="supplier-card__footer-icon"
                    aria-hidden="true"
                />
                <a :href="`tel:${supplier.phoneNumber.replace(/\s+/g, '')}`">
                    {{ supplier.phoneNumber }}
                </a>
                <hr class="vs-divider vs-divider--variant-primary">
            </div>
            
            <div v-if="supplier.emailAddress" class="supplier-card__footer-field">
                <VsIcon
                    icon="fa-regular fa-envelope"
                    size="sm"
                    class="supplier-card__footer-icon"
                    aria-hidden="true"
                />
                <a :href="`mailto:${supplier.emailAddress.trim()}`">
                    {{ supplier.emailAddress }}
                </a>
                <hr class="vs-divider vs-divider--variant-primary">
            </div>
            
            <div v-if="supplier.url" class="supplier-card__footer-field">
                <VsIcon
                    icon="fa-regular fa-globe"
                    size="sm"
                    class="supplier-card__footer-icon"
                    aria-hidden="true"
                />
                <a :href="websiteHref(supplier.url)">
                    {{ supplier.url }}
                </a>
                <hr class="vs-divider vs-divider--variant-primary">
            </div>
            
            <div v-if="supplier.address" class="supplier-card__footer-field">
                <VsIcon
                    icon="fa-regular fa-location-dot"
                    size="sm"
                    class="supplier-card__footer-icon"
                    aria-hidden="true"
                />
                <div>
                    <span
                        v-for="(line, index) in supplier.address.split(',')"
                        :key="index"
                        class="supplier-card__address-line"
                    >
                        {{ line.trim() }}
                    </span>
                </div>
            </div>
            <VsButton
                :href="`/blog/supplier/${supplier.id}`"
                class="mt-150"
            >
                Read More
            </VsButton>
        </template>
    </VsCard>
</template>

<script setup lang="ts">
import type { Supplier } from '~/types/suppliers';

import {
    VsCard,
    VsButton,
    VsHeading,
    VsBody,
    VsIcon,
    VsImg,
} from '@visitscotland/component-library/components';

defineProps<{
    supplier: Supplier,
}>();

function websiteHref(url: string) {
    const value = url.trim();
    return /^https?:\/\//i.test(value) ? value : `http://${value.replace(/^\/\//, '')}`;
}
</script>

<style lang="scss" scoped>
.vs-br-supplier-card,
.vs-br-supplier-card:hover {
    min-width: 0;
    cursor: default;

}

.vs-br-supplier-card :deep(.vs-card__header) {
    margin: -1rem -1rem 1rem;
}
.supplier-card__footer-field {
    display: grid;
    grid-template-columns: 1.25rem minmax(0, 1fr);
    column-gap: 0.75rem;
    align-items: start;
    overflow-wrap: anywhere;
}

.supplier-card__footer-icon {
    justify-self: center;
    margin-top: 0.2rem;
}

.supplier-card__footer-field > hr {
    grid-column: 1 / -1;
    width: 100%;
}
.supplier-card__address-line {
    display: block;
}

</style>
