<template>
    <header>
        <nav>
            <input name="search" @keyup="onEnter($event, $event.target.value)" :value="search" />
            <button @click="displayFilter('color')">Colors</button>
            <button @click="displayFilter('habitat')">Habitats</button>
            <button @click="displayFilter('shape')">Shapes</button>
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
                            :class="{'filter-panel__list__element__button--active': isFilterOptionActive(filter, option)}"
                            @click="setFilter(filter, option)"
                        >{{option}}</button>
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

@Component
export default class TheHeader extends Vue {
    filters: Record<string, Array<string>> = {};
    filter: string | null = null;

    @Prop(String)
    readonly search!: string;

    @Prop(Object)
    readonly activeFilters!: Record<string, Array<string>>;

    isFilterOptionActive(filter: string, option: string) {
        return this.activeFilters[filter] && this.activeFilters[filter].findIndex(_option => _option === option) !== -1;
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
.filter-panel
    padding: 1em 0
    &__list
        margin: 0
        padding: 0
        &__element
            display: inline-block
            list-style: none
            &__button--active
                background-color: red

.filters-enter-active, .filters-leave-active 
    transition-duration: .25s
    opacity: 1
    padding: 1em 0

.filters-enter, .filters-leave-to
    opacity: 0
    padding: 0 0
</style>