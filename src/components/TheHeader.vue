<template>
    <header class="header">
        <router-link to="/"><h1>Pokedex</h1></router-link>
        <nav class="header__nav">
            <v-navigation-search @search="setSearch($event)" :search="search"/>
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
import { Prop, Watch } from "vue-property-decorator";

import { filters } from "@/enums/Filters";
import pokemonFilterService from "../services/pokemonFilterService";

import { AsyncFlags } from "@/mixins/AsyncFlags";
import { Filters } from "@/mixins/Filters";
import { Search } from "@/mixins/Search";
import NavigationSearch from "@/components/Navigation/NavigationSearch.vue";
import NavigationFilters from "@/components/Navigation/NavigationFilters.vue";
import NavigationFilterOptions from "@/components/Navigation/NavigationFilterOptions.vue";

import { parseQuery } from "@/mixins/parseQuery";
import { Next, Route } from 'vue-router';

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
export default class TheHeader extends mixins(AsyncFlags, Filters, Search) {
    filtersList: Record<string, Array<string>> = {};
    filterKey: string | null = null;

    @Watch("$route.path")
    onPathChange(value: string) {
        if (value !== '/')
            this.filterKey = null;
    }

    setActiveFilterKey(filterKey: string) {
        this.filterKey = filterKey === this.filterKey ? null : filterKey;
    }

    activeOptionsCheck(): Set<string> {
        const activeFilters = new Set<string>();
        for (const filterKey in this.activeFilters)
            if (this.activeFilters[filterKey].length > 0)
                activeFilters.add(filterKey);
        return activeFilters;
    }

    async setSearch(search: string) {
        if (!this.canPerformAsyncOperation()) return;
        const query = parseQuery(this.$route.query);
        if (!query.search && search.length === 0) return;
        else if (query.search && query.search.includes(search)) return;
        else if (search.length === 0) delete query.search;
        else query.search = [search];
        this.$router.push({
            path: "/",
            params: this.$route.params,
            query
        });
    }

    setActiveOption({ filterKey, option }: OptionChangeEvent) {
        if (!this.canPerformAsyncOperation()) return;
        const query = parseQuery(this.$route.query);
        if (!query[filterKey]) query[filterKey] = [option];
        else if (query[filterKey] && !query[filterKey].includes(option))
            query[filterKey].push(option);
        else query[filterKey].splice(query[filterKey].indexOf(option), 1);
        this.$router.push({
            path: "/",
            params: this.$route.params,
            query
        });
    }

    resetFilters() {
        if (!this.canPerformAsyncOperation()) return;
        const query = parseQuery(this.$route.query);
        for (const filterKey of filters) {
            if (query[filterKey]) delete query[filterKey];
        }
        this.$router.push({
            path: "/",
            params: this.$route.params,
            query
        });
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
    border-bottom: 1px solid #E9E9E9
    a
        color: inherit
        text-decoration: unset

.filter-options-enter-active, .filter-options-leave-active 
    transition-duration: .5s
    max-height: 4em
    opacity: 1

.filter-options-enter, .filter-options-leave-to
    max-height: 0em
</style>