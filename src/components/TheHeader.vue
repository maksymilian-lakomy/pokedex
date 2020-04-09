<template>
    <header>
        <nav class="header__nav">
            <input
                class="header__nav__search"
                placeholder="Search"
                @keyup="onEnter($event, $event.target.value)"
                :value="search"
            />
            <button class="header__nav__button" @click="displayFilter('color')">Colors</button>
            <button class="header__nav__button" @click="displayFilter('habitat')">Habitats</button>
            <button class="header__nav__button" @click="displayFilter('shape')">Shapes</button>
        </nav>
        <transition name="filters">
            <div v-if="filter !== null" class="filter-panel">
                <ul class="filter-panel__list">
                    <li
                        class="filter-panel__list__element"
                        v-for="(option, i) in filters[filter]"
                        :key="i"
                    >
                        <button
                            class="filter-panel__list__element__button"
                            :class="{'filter-panel__list__element__button--active': isFilterOptionActive(filter, option)}"
                            @click="setFilter(filter, option)"
                        >{{option | upperCase}}</button>
                    </li>
                </ul>
            </div>
        </transition>
    </header>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { filters } from "@/enums/Filters";
import pokemonFilterService from "../services/pokemonFilterService";

@Component({
    filters: {
        upperCase(value: string) {
            if (typeof value !== 'string')
                return;
            return value.charAt(0).toUpperCase()+value.slice(1);
        }
    }
})
export default class TheHeader extends Vue {
    filters: Record<string, Array<string>> = {};
    filter: string | null = null;

    @Prop(String)
    readonly search!: string;

    @Prop(Object)
    readonly activeFilters!: Record<string, Array<string>>;

    isFilterOptionActive(filter: string, option: string) {
        return (
            this.activeFilters[filter] &&
            this.activeFilters[filter].findIndex(
                _option => _option === option
            ) !== -1
        );
    }

    displayFilter(filterIndex: string) {
        filterIndex === this.filter
            ? (this.filter = null)
            : (this.filter = filterIndex);
    }

    setFilter(filter: string, option: string) {
        this.$emit("optionChange", { filter, option });
    }

    async created() {
        for (const filter of filters) {
            this.filters[filter] = await pokemonFilterService.getOptions({
                filter
            });
        }
    }

    onEnter(event: KeyboardEvent, search: string) {
        if (event.keyCode !== 13) return;
        this.$emit("update:search", search);
        this.$emit("reload");
    }
}
</script>

<style lang="sass" scoped>
.header
    &__nav
        &__search
            outline: none
            font-size: 1em
            padding: .625em 1em
            border: unset
            border-radius: 1em
            background-color: #E9E9E9
            color: #707070
            font-family: inherit
            margin-right: 1em
        &__button
            cursor: pointer
            outline: none
            padding: .625em
            border: unset
            background-color: unset
            font-family: inherit
            color: #707070
        &__button:nth-child(n)
            margin-right: 1em
        &__button:nth-last-child(1)
            margin-right: unset

.filter-panel
    padding: 1em 0
    &__list
        margin: 0
        padding: 0
        &__element
            display: inline-block
            list-style: none
            margin-right: .5em
            &__button
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


.filters-enter-active, .filters-leave-active 
    transition-duration: .25s
    opacity: 1
    padding: 1em 0

.filters-enter, .filters-leave-to
    opacity: 0
    padding: 0 0
</style>