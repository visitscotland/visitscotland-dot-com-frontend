<template>
    <VsSocialShare
        :id="noJs ? 'nojs' : 'default'"
        :no-js="noJs"
        page-url="<@hst.link hippobean=document canonical=true fullyQualified=true/>"
        page-title="${document.title}"
        :share-btn-text="configStore.getLabel('social.share', 'share.button.text')"
        :close-alt-text="configStore.getLabel('social.share', 'close.share')"
        :share-popover-title="configStore.getLabel('social.share', 'share.on')"
    >
        <VsSocialShareItem
            name="facebook"
            :link-text="configStore.getLabel('social.share', 'facebook.link.text')"
        />
        <VsSocialShareItem
            name="pinterest"
            :link-text="configStore.getLabel('social.share', 'pinterest.link.text')"
        />
        <VsSocialShareItem
            name="whatsapp"
            :link-text="configStore.getLabel('social.share', 'whatsapp.link.text')"
        />
        <VsSocialShareItem
            name="x-twitter"
            :link-text="configStore.getLabel('social.share', 'twitter.link.text')"
        />
        <VsSocialShareItem
            name="email"
            :link-text="configStore.getLabel('social.share', 'email.link.text')"
        />
        <VsSocialShareItem
            v-if="!noJs"
            name="link"
            :link-text="configStore.getLabel('social.share', 'copy.link.text')"
            :link-copied-text="configStore.getLabel('social.share', 'link.copied.text')"
        />
    </VsSocialShare>
</template>

<script lang="ts" setup>

import useConfigStore from '~/stores/configStore.ts';

import {
    VsSocialShare,
    VsSocialShareItem,
} from '@visitscotland/component-library/components';

interface IProps {
    noJs: boolean,
};

const props = withDefaults(defineProps<IProps>(), {
    noJs: false,
});

const noJs: boolean = props.noJs;

const configStore = useConfigStore();

</script>
