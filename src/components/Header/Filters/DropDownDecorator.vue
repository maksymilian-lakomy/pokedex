<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19">
        <polyline class="cls-1" points="4.2,7.2 9.5,11.8 14.8,7.3 ">
            <animate ref="open" begin="indefinite" fill="freeze" attributeName="points" dur=".25s" to="4.2,11.8 9.5,7.2 14.8,11.7 " />
            <animate ref="close" begin="indefinite" fill="freeze" attributeName="points" dur=".25s" to="4.2,7.2 9.5,11.8 14.8,7.3 " />
        </polyline>
    </svg>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop, Watch} from "vue-property-decorator";

interface FixedSVGAnimationElement extends SVGAnimationElement {
    beginElement: Function;
}

@Component
export default class DropDownDecorator extends Vue {
    @Prop(Boolean)
    readonly active!: boolean;

    @Watch("active")
    onActiveChange(value: boolean) {
        if (value)
            (this.$refs.open as FixedSVGAnimationElement).beginElement();
        else if (!value)
            (this.$refs.close as FixedSVGAnimationElement).beginElement();

    }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"

svg
    width: 19px
    height: 19px

.cls-1
    fill: #fff
    stroke: $dark-gray
    stroke-miterlimit: 10
</style>