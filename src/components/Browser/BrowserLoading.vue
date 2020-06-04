<template>
    <div class="loading">
        <v-loading-circle class="loading__circle"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import LoadingCircle from '@/components/LoadingCircle.vue';

@Component({
    components: {
        'v-loading-circle': LoadingCircle
    }
})
export default class BrowserLoading extends Vue {}
</script>

<style lang="sass">
    .loading
        position: absolute
        background-color: #FFFFFF99
        width: 100%
        height: 100%
        z-index: 1000

        &__circle
            position: fixed
            left: calc(50% - 2em)
            top: 50%
            width: 4em
            height: 4em
            animation-name: rotation
            animation-duration: 1.25s 
            animation-iteration-count: infinite
            animation-timing-function: cubic-bezier(0.26, 0.7, 0.84, 0.42)

@keyframes rotation
    0%
        transform: rotate(0deg)
    100%
        transform: rotate(360deg)
</style>