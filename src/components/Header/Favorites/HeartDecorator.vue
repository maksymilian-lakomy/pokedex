<template>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="cls-1" :class="{'cls-1--fill': isActive}">
        <path
            d="M15.2,5c-1.2,0-2.4,0.6-3.1,1.6C11.2,5.6,10.1,5,8.9,5
	C6.7,5,5,6.8,5,9.2c0,2.9,2.4,5.2,6,8.8l1,1l1-1c3.6-3.6,6-5.9,6-8.8C19,6.8,17.3,5,15.2,5z"
        />/>
    </svg>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class HeartDecorator extends Vue {
    @Prop({required: true, type: Boolean})
    readonly isActive!: boolean;
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"
svg
    display: inline-block
    width: 1.5em
    height: 1.5em

.cls-1
    fill: none
    stroke: $dark-gray
    stroke-width: 2px

.cls-1--fill
    fill: $dark-gray
</style>