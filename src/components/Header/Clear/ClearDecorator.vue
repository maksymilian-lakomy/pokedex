<template>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="cls-1">
        <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        />
    </svg>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class ClearDecorator extends Vue {}
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