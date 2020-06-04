<template>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="cls-1">
        <path
            d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
        />
    </svg>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class HeartDecorator extends Vue {}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"
svg
    display: inline-block
    width: 1.5em
    height: 1.5em

.cls-1
    fill: $dark-gray
</style>