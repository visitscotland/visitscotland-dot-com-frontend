<template>
    <button
        :disabled="shareState !== 'ready' || !sharedFavouritesLink"
        :variant="linkCopied ? 'primary' : 'secondary'"
        icon="fa-link fa-regular"
        @click="copyUrl"
        :aria-label="shareMessage"
    >
        {{ shareMessage }}
</button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { VsButton } from '@visitscotland/component-library/components';
import { useFavourites } from '~/stores/favouritesStore.ts';
import useConfigStore from '~/stores/configStore.ts';

const favourites = useFavourites();
const configStore = useConfigStore();

const createListEndpoint = `${favourites.serviceUrl}/create-list`;
const updateListEndpoint = `${favourites.serviceUrl}/update-list`;

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

const sharedFavouritesLink = computed(() => {
    if (!favourites.displaySharedUrl || !favourites.shareId) {
        return null;
    }

    return `${favourites.displaySharedUrl}?share-id=${favourites.shareId}`;
});

const linkCopied = ref(false);
const shareMessage = computed(() => {
    return linkCopied.value ? configStore.getLabel('favourites','favourites.share-button.link-copied-message') : configStore.getLabel('favourites','favourites.share-button.text');
});

const copyUrl = () => {
    const text = sharedFavouritesLink.value;

    if (!text) {
        return;
    }
    // This is fallback behviour for ios and safari
    try {
        // call directly, no chaining
        navigator.clipboard.writeText(text);
    } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    if (shareState.value === 'ready' && needsUpdate.value) {
        updateCollection();
    }

    linkCopied.value = true;

    setTimeout(() => {
        linkCopied.value = false;
    }, 5000);
};

async function ensureCollectionExists() {
    if (shareState.value === 'no share id' && shareState.value !== 'empty' ) {
        const newDbCollection = await createList();
        if (!newDbCollection?.favId) {
            return;
        }
        favourites.shareId = newDbCollection.favId;
        favourites.lastSharedRevision = favourites.revision;
    }
    return;
};

async function updateCollection() {
    const updated = await updateList();
    if (!updated) {
        return;
    }
    favourites.lastSharedRevision = favourites.revision;
};

onMounted(() => ensureCollectionExists());

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
        return res;
    } catch (err) {
        console.warn('Failed to create share id:', err);
        return null;
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
        return true;
    } catch (err) {
        console.warn('Failed to update list:', err);
        return false;
    }
};

</script>
