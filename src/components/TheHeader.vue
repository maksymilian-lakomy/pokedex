<template>
    <header class="header">
        <h1>Pokedex</h1>
        <nav class="header__nav">
            <v-navigation-search :search="search" />
            <v-navigation-filters @click="setActiveFilterKey($event)" />
        </nav>
        <transition name="filter-options">
            <v-navigation-filter-options
                v-show="filterKey !== null"
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
    @Prop(String)
    readonly search!: string;

    @Prop(Object)
    readonly activeFilters!: Record<string, Array<string>>;

    filtersList: Record<string, Array<string>> = {};
    filterKey: string | null = null;

    setActiveFilterKey(filterKey: string) {
        this.filterKey = filterKey === this.filterKey ? null : filterKey;
    }

    get activeOptionsCheck(): boolean {
        for (const options in this.activeFilters)
            if (this.activeFilters[options].length > 0) return true;
        return false;
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
    max-height: 5em
    padding-top: 1em

.filter-options-enter, .filter-options-leave-to
    opacity: 0
    max-height: 0em
    padding-top: 0em
</style>