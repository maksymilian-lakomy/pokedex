<template>
    <header class="header">
        <h1>Pokedex</h1>
        <nav class="header__nav">
            <v-navigation-search @search="$emit('search', $event)" />
            <v-navigation-filters
                @display-filter="setActiveFilterKey($event)"
                @reset-filters="resetFilters()"
                :activeOptions="activeOptionsCheck()"
            />
        </nav>
        <transition name="filter-options">
            <v-navigation-filter-options
                v-if="filterKey !== null"
                :options="filtersList[filterKey]"
                :activeOptions="activeFilters[filterKey]"
                :filterKey="filterKey"
                @click="setActiveOption($event)"
            />
        </transition>
    </header>
</template>

<script lang="ts">
import Vue from "vue";
import Component, { mixins } from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { filters } from "@/enums/Filters";
import pokemonFilterService from "../services/pokemonFilterService";

import { AsyncFlags } from "@/mixins/AsyncFlags";
import NavigationSearch from "@/components/Navigation/NavigationSearch.vue";
import NavigationFilters from "@/components/Navigation/NavigationFilters.vue";
import NavigationFilterOptions from "@/components/Navigation/NavigationFilterOptions.vue";

interface OptionChangeEvent {
    filterKey: string;
    option: string;
}

@Component({
    components: {
        "v-navigation-search": NavigationSearch,
        "v-navigation-filter-options": NavigationFilterOptions,
        "v-navigation-filters": NavigationFilters
    }
})
export default class TheHeader extends mixins(AsyncFlags) {
    @Prop(Object)
    readonly activeFilters!: Record<string, Array<string>>;

    filtersList: Record<string, Array<string>> = {};
    filterKey: string | null = null;

    setActiveFilterKey(filterKey: string) {
        this.filterKey = filterKey === this.filterKey ? null : filterKey;
    }

    activeOptionsCheck(): Set<string> {
        const activeFilters = new Set<string>();
        for (const filterKey in this.activeFilters)
            if (this.activeFilters[filterKey].length > 0) activeFilters.add(filterKey);
        return activeFilters;
    }

    setActiveOption(event: OptionChangeEvent) {
        if (!this.canPerformAsyncOperation()) return;
        this.$emit("option-change", event);
    }

    resetFilters() {
        if (!this.canPerformAsyncOperation()) return;
        this.$emit("reset-filters");
    }

    async loadOptions() {
        for await (const filter of filters)
            this.filtersList[filter] = await pokemonFilterService.getOptions({
                filter
            });
    }

    async created() {
        this.loadOptions();
    }
}
</script>

<style lang="sass" scoped>
.header
    max-width: 100%

.filter-options-enter-active, .filter-options-leave-active 
    transition-duration: .25s
    max-height: 3em
    opacity: 1

.filter-options-enter, .filter-options-leave-to
    opacity: 0
    max-height: 0em
</style>