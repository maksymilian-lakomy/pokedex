<template>
    <header>
        <nav>
            <input name="search" @keyup="onEnter($event, $event.target.value)" :value="search" />
            <button @click="displayFilter(0)">Colors</button>
            <button @click="displayFilter(1)">Habitats</button>
            <button @click="displayFilter(2)">Shapes</button>
        </nav>
        <transition name="filters">
            <div v-if="filter !== null" class="filter-panel">
                <ul class="filter-panel__list">
                    <li
                        class="filter-panel__list__element"
                        v-for="(option, i) in filters[filter].options"
                        :key="i"
                    >
                        <button
                            :class="{'filter-panel__list__element__button--active': (activeFilters.has(filters[filter].filter.api) && activeFilters.get(filters[filter].filter.api).has(option))}"
                            @click="setFilter(filters[filter].filter, option)"
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

import { filters, Filter } from "@/enums/Filters";
import pokemonFilterService from "../services/pokemonFilterService";

@Component({
    props: {
        search: {
            type: String,
            required: true
        },
        activeFilters: {
            type: Map,
            required: true
        }
    }
})
export default class TheHeader extends Vue {
    filters = new Array<{
        filter: Filter;
        options: Array<string>;
    }>();

    filter: number | null = null;

    displayFilter(filterIndex: number) {
        filterIndex === this.filter
            ? (this.filter = null)
            : (this.filter = filterIndex);
    }

    setFilter(filter: Filter, option: string) {
        const activeFilters = this.$props.activeFilters as Map<
            string,
            Set<string>
        >;
        if (!activeFilters.has(filter.api))
            activeFilters.set(filter.api, new Set<string>());
        activeFilters.get(filter.api)?.has(option)
            ? activeFilters.get(filter.api)?.delete(option)
            : activeFilters.get(filter.api)?.add(option);
        this.$emit("update:activeFilters", activeFilters);
        this.$emit("reload");
    }

    async created() {
        for (const filter of filters) {
            this.filters.push({
                filter,
                options: await pokemonFilterService.getOptions({ filter })
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