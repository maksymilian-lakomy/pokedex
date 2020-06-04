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
    display: block
    position: absolute
    width: 100%
    height: 100%
    background-position: center
    background-size: cover
    image-rendering: pixelated

    &__message-wrapper
        position: absolute
        width: 50%
        left: calc(50% - 50% / 2)
        bottom: 1em
        color: white
        margin: auto
        text-align: center

        &__content
            font-size: 4em
</style>