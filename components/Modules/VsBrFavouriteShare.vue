<template>
    <VsButton
        :disabled="shareState === 'empty'"
        :variant="linkCopied ? 'primary' : 'secondary'"
        icon="fa-link fa-regular"
        @click="handleClick"
    >
        {{ linkCopied ? 'Link copied' : 'Copy share link' }}
    </VsButton>

    <p>share id: {{ favourites.shareId }}</p>
    <p>share state: {{ shareState }}</p>
    <p>revision {{  favourites.revision }}</p>
    <p>last shared revision: {{  favourites.lastSharedRevision }}</p>
    <p>needsUpdate: {{ needsUpdate }}</p>
    <p>sharedFavouritesUrl {{ sharedFavouritesUrl }}</p>
</template>

<script setup lang="ts">
import { VsButton } from '@visitscotland/component-library/components';
import { useFavourites } from '~/stores/favouritesStore.ts';
const favourites = useFavourites();

const shareState = computed(() => {
    if (favourites.pages.length === 0) {
        return 'empty';
    }
    if (!favourites.shareId) {
        return 'no share id';
    }
    return 'ready';
});

const needsUpdate = computed(() => {
    return Boolean(
        favourites.shareId && favourites.revision > favourites.lastSharedRevision,
    );
});

const sharedListAddress = 'http://localhost:8080/shared-content/';
const createListEndpoint = 'http://localhost:8080/favourites/create-list';
const updateListEndpoint = 'http://localhost:8080/favourites/update-list';

const sharedFavouritesUrl = ref(`${sharedListAddress}?share=${favourites.shareId}`);

// These will come from labels when they're available

const linkCopied = ref(false);

const copyUrl = () => {
    navigator.clipboard.writeText(sharedFavouritesUrl.value);
    linkCopied.value = true;
    setTimeout(() => {
        linkCopied.value = false;
    }, 5000);
};

async function handleClick() {
    if (shareState.value === 'no share id') {
        const { favId: newId } = await createList();
        favourites.shareId = newId;
        favourites.lastSharedRevision = favourites.revision;
    };
    if (shareState.value === 'ready' && needsUpdate.value) {
        updateList();
        favourites.lastSharedRevision = favourites.revision;
    };
    copyUrl();
};

async function createList() {
    try {
        const res = await $fetch(
            createListEndpoint,
            {
                method: 'POST',
                body: {
                    uuids: favourites.pages,
                },
            },
        );
        return(res);
    } catch (err) {
        console.error('Failed to create share id:', err);
    }
};

async function updateList() {
    try {
        await $fetch(
            updateListEndpoint,
            {
                method: 'POST',
                body: {
                    favId: favourites.shareId,
                    uuids: favourites.pages,
                },
            },
        );
    } catch (err) {
        console.error('Failed to update list:', err);
    }
};

</script>
