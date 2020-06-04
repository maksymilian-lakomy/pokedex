<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M6,9l6,6l6-6 " class="cls-1">
            <animate
                ref="open"
                begin="indefinite"
                fill="freeze"
                attributeName="d"
                dur=".25s"
                to="M6,15l6-6l6,6 "
            />
            <animate
                ref="close"
                begin="indefinite"
                fill="freeze"
                attributeName="d"
                dur=".25s"
                to="M6,9l6,6l6-6 "
            />
        </path>
    </svg>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

interface FixedSVGAnimationElement extends SVGAnimationElement {
    beginElement: Function;
}

@Component
export default class DropDownDecorator extends Vue {
    @Prop(Boolean)
    readonly active!: boolean;

    @Watch('active')
    onActiveChange(value: boolean) {
        if (value) (this.$refs.open as FixedSVGAnimationElement).beginElement();
        else if (!value)
            (this.$refs.close as FixedSVGAnimationElement).beginElement();
    }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"

svg
    width: 1.5em
    height: 1.5em

.cls-1
    fill: none
    stroke: $dark-gray
    stroke-miterlimit: 10
    stroke-width: 2
</style>