<template>
    <ul class="nav__filter-options-list">
        <li class="nav__filter-options-list__element" v-for="(option, i) in options" :key="i">
            <button
                class="nav__filter-options-list__element__button"
                :class="{'nav__filter-options-list__element__button--active': isActiveOption(option)}"
                @click="$emit('click', {filterKey, option})"
            >{{option | upperCase}}</button>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
    filters: {
        upperCase(value: string) {
            if (typeof value !== "string") return;
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
})
export default class NavigationFilterOptions extends Vue {
    @Prop(Array)
    readonly options!: Array<string>;

    @Prop(Array)
    readonly activeOptions!: Array<string>;

    @Prop(String)
    readonly filterKey!: string;

    isActiveOption(option: string): boolean {
        if (this.activeOptions && this.activeOptions.includes(option))
            return true;
        return false;
    }
}
</script>

<style lang="sass" scoped>
.nav__filter-options-list
    padding: 0
    margin: 0
    width: 100%
    display: flex
    overflow-x: auto
    overflow-y: hidden
    font-size: .8em
    &__element
        padding: 1em 0
        display: inline-block
        list-style: none
        margin-right: .5em
        &__button
            font-size: inherit
            outline: none
            cursor: pointer
            border: unset
            background-color: unset
            font-family: inherit
            color: #707070
        &__button--active
            border-radius: .25em
            color: white
            background-color: #707070
    &__element:nth-last-child(1)
        margin-right: unset
</style>