<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19">
        <line class="cls-1" x1="4.2" y1="4.1" x2="14.8" y2="14.9" />
        <line class="cls-1" x1="14.8" y1="4.1" x2="4.2" y2="14.9" />
    </svg>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class ClearDecorator extends Vue {}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"
svg
    display: inline-block
    width: 19px
    height: 19px

.cls-1
    fill: #fff
    stroke: $dark-gray
    stroke-miterlimit: 10
</style>