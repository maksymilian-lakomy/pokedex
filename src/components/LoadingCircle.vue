<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path
            class="cls-1"
            d="M32,4a27.81,27.81,0,0,1,19.8,8.2l2.83-2.83A31.9,31.9,0,0,0,32,0h0A31.9,31.9,0,0,0,9.37,9.37L12.2,12.2A27.81,27.81,0,0,1,32,4"
        />
    </svg>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class LoadingCircle extends Vue {
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"

svg
    width: 4em
    height: 4em

.cls-1
    fill: $dark-gray
</style>