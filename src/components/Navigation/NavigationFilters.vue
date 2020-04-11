<template>
    <div class="nav__filters">
        <ul class="nav__filters__list">
            <li
                class="nav__filters__list__element"
                :class="{'nav__filters__list__element--active': activeOptions.has(filterKey)}"
                v-for="(filter, filterKey) in filtersDictionary"
                :key="filterKey"
            >
                <button
                    class="nav__filters__list__element__button"
                    @click="setActiveFilterKey(filterKey)"
                >
                    <span>{{filter}}</span>
                    <v-drop-down-decorator :active="activeFilterKey === filterKey" />
                </button>
            </li>
            <li
                class="nav__filters__list__element nav__filters__list__element--clear"
                v-show="activeOptions.size > 0"
            >
                <button class="nav__filters__list__element__button" @click="resetFilters()">
                    <v-clear-decorator />
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DropDownDecorator from "./Decorators/DropDownDecorator.vue";
import ClearDecorator from "./Decorators/ClearDecorator.vue";

import { filtersDictionary } from "@/enums/Filters";
import { Prop } from "vue-property-decorator";

@Component({
    components: {
        "v-drop-down-decorator": DropDownDecorator,
        "v-clear-decorator": ClearDecorator
    }
})
export default class NavigationFilters extends Vue {
    @Prop(Set)
    readonly activeOptions!: Set<string>;

    filtersDictionary = filtersDictionary;
    activeFilterKey: string | null = null;
    setActiveFilterKey(filterKey: string) {
        this.activeFilterKey =
            this.activeFilterKey === filterKey ? null : filterKey;
        this.$emit("display-filter", filterKey);
    }
    resetFilters() {
        this.$emit("reset-filters");
    }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"
.nav__filters
    display: flex
    align-items: center
    padding: 1em 0
    color: $dark-gray
    &__list
        display: flex
        width: 100%
        padding: 0
        margin: 0
        margin-left: .5em
        &__element
            list-style: none
            margin-right: .5em
            position: relative
            &::after
                position: absolute
                content: ""
                transition-duration: .2s
                width: 0%
                height: 1px
                background-color: $light-gray
                left: 0
                bottom: -.25em
            &__button
                cursor: pointer
                outline: none
                font-size: inherit
                font-family: inherit
                font-weight: inherit
                border: unset
                padding: unset
                color: inherit
                background-color: unset
                transition-duration: .2s
                span
                    vertical-align: middle
                svg
                    margin-left: .1em
                    vertical-align: middle
            &__button--active
                opacity: 1
            &__button--right
                float: right
            &__button:nth-last-child(1)
                margin-right: unset
        &__element--clear 
            margin-left: auto
        &__element--active
            &::after
                width: 100%

                
</style>