<template>
    <div class="not-found" :style="{'background-image': `url(${image})`}">
        <div class="not-found__message-wrapper">
            <div class="not-found__message-wrapper__content">
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class NotFound extends Vue {
    readonly image = require('@/assets/not-found.gif');
}
</script>
<style lang="sass">
.not-found
    overflow: hidden
    display: block
    position: absolute
    margin: 1em 0
    width: 100%
    height: calc(100% - 2 * 1em)
    background-position: center
    background-size: cover
    image-rendering: pixelated

    &__message-wrapper
        position: absolute
        top: 50%
        transform: translateY(-50%)
        width: 100%
        color: white
        margin: auto
        text-align: center

        &__content
            text-shadow: 0 8px 10px black
            margin: 0 2em
            font-size: 1.25em
            width: calc(100% - 2 * 2em)
</style>