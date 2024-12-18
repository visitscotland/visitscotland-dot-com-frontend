<template>
    <div class="skeleton-site">
        <div class="fake-global-menu">
            <div class="fake-container">
                <div class="global-link" />
            </div>
        </div>
        <div class="fake-header">
            <div class="fake-container">
                <div class="fake-link" />
                <div class="fake-link" />
                <div class="fake-link" />
                <div class="fake-search" />
            </div>
        </div>
        <div class="fake-main" />
        <div class="fake-container fake-footer">
            <div class="fake-link" />
        </div>
    </div>
</template>

<style>
    .skeleton-site {
        opacity: 0.4;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
    }

    .fake-container {
        position: absolute;
        width: 90%;
        max-width: 1340px;
        left: 50%;
        transform: translateX(-50%);
    }

    .fake-link {
        height: 1.5em;
        width: 7em;
        border-radius: 0.25em;
        background-color: #C3BFD6;
        display: inline-block;
        margin: 0.5em 1.5em 0.5em 0;
    }

    .fake-global-menu {
        height: 32px;
        background-color: #5B2487;
    }

    .global-link {
        height: 32px;
        width: 6em;
        background-color: #ffffff;
    }

    .fake-header {
        height: 45px;
        background-color: #ffffff;
    }

    .fake-main {
        height: 100vh;
        background-color: #C3BFD6;
        position: relative;
    }

    .fake-search {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 7em;
        background-color: #1F49D6;
    }

    .fake-footer {
        bottom: 0;
        height: 120px;
        background-color: #ffffff;
        z-index: 2;
        padding: 1em 4em;
    }
</style>
