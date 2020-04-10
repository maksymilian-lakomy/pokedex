<template>
    <header class="header">
        <nav class="header__nav">
            <input
                class="header__nav__search"
                placeholder="Search"
                @keyup="onSearchEnter($event, $event.target.value)"
                :value="search"
            />
            <div class="header__nav__buttons">
                <button class="header__nav__buttons__button" @click="displayFilter('color')">Colors</button>
                <button
                    class="header__nav__buttons__button"
                    @click="displayFilter('habitat')"
                >Habitats</button>
                <button class="header__nav__buttons__button" @click="displayFilter('shape')">Shapes</button>
                <button v-show="activeOptionsCheck" class="header__nav__buttons__button header__nav__buttons__button--right" @click="resetFilters()">Clear</button>
            </div>
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

import { EventBus } from "@/events/EventBus";

@Component({
    filters: {
        upperCase(value: string) {
            if (typeof value !== "string") return;
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
})
export default class TheHeader extends Vue {
    filters: Record<string, Array<string>> = {};
    filter: string | null = null;

    flags = {
        loadingSpeciesList: false,
        loadingSpecies: false
    };

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

    get activeOptionsCheck(): boolean {
        for (const options in this.activeFilters)
            if (this.activeFilters[options].length > 0) return true;
        return false;
    }

    setFilter(filter: string, option: string) {
        if (this.flags.loadingSpeciesList || this.flags.loadingSpecies) return;
        this.$emit("optionChange", { filter, option });
    }

    resetFilters() {
        if (
            this.flags.loadingSpeciesList ||
            this.flags.loadingSpeciesList ||
            !this.activeOptionsCheck
        )
            return;
        this.$emit("reset-filters");
    }

    async loadOptions() {
        for await (const filter of filters)
            this.filters[filter] = await pokemonFilterService.getOptions({
                filter
            });
    }

    async created() {
        EventBus.$on(
            "loading-species-list",
            (event: boolean) => (this.flags.loadingSpeciesList = event)
        );
        EventBus.$on(
            "loading-species",
            (event: boolean) => (this.flags.loadingSpecies = event)
        );
        this.loadOptions();
    }

    onSearchEnter(event: KeyboardEvent, search: string) {
        if (event.keyCode !== 13) return;
        if (this.flags.loadingSpeciesList || this.flags.loadingSpecies) return;
        this.$emit("update:search", search);
        this.$emit("reload");
    }
}
</script>

<style lang="sass" scoped>
.header
    max-width: 100%
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
        &__buttons
            display: inline-block
            @media (max-width: 768px)
                display: block
            &__button
                font-size: inherit
                cursor: pointer
                outline: none
                padding: .625em
                border: unset
                background-color: unset
                font-family: inherit
                color: #707070
            &__button:nth-child(n)
                margin-right: 1em
                @media (max-width: 768px)
                    margin-right: .25em
                @media (max-width: 350px)
                    padding: .625em .25em
            &__button:nth-last-child(1)
                margin-right: unset
            &__button--right
                float: right

.filter-panel
    padding: 1em 0
    &__list
        margin: 0
        padding: 0
        width: 100%
        display: flex
        overflow-x: auto
        font-size: .8em
        &__element
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


.filters-enter-active, .filters-leave-active 
    transition-duration: .25s
    max-height: 5em
    padding: 1em 0

.filters-enter, .filters-leave-to
    opacity: 0
    max-height: 0em
    padding: 0em 0
</style>