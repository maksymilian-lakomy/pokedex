<template>
    <header class="header">
        <router-link to="/">
            <h1>Pokedex</h1>
        </router-link>
        <nav class="header__nav">
            <v-navigation-search @search="setSearch($event)" :search="search" />
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
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { filters } from '@/enums/Filters';
import pokemonFilterService from '../services/pokemonFilterService';

import { AsyncFlags } from '@/mixins/AsyncFlags';
import { Filters } from '@/mixins/Filters';
import { Search } from '@/mixins/Search';
import NavigationSearch from '@/components/Navigation/NavigationSearch.vue';
import NavigationFilters from '@/components/Navigation/NavigationFilters.vue';
import NavigationFilterOptions from '@/components/Navigation/NavigationFilterOptions.vue';

import { parseQuery } from '@/mixins/parseQuery';
import { Next, Route } from 'vue-router';

interface OptionChangeEvent {
    filterKey: string;
    option: string;
}

@Component({
    components: {
        'v-navigation-search': NavigationSearch,
        'v-navigation-filter-options': NavigationFilterOptions,
        'v-navigation-filters': NavigationFilters
    }
})
export default class TheHeader extends mixins(AsyncFlags, Filters, Search) {
    filtersList: Record<string, Array<string>> = {};
    filterKey: string | null = null;

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
        try {
            const queries = parseQuery(this.$route.query);
            search !== ''
                ? (queries['search'] = [search])
                : delete queries['search'];
            queries['p'] = ['1'];
            await this.$router.push({
                path: '/',
                params: this.$route.params,
                query: queries
            });
        } catch (e) {
            return;
        }
    }

    async setActiveOption({ filterKey, option }: OptionChangeEvent) {
        try {
            const queries = parseQuery(this.$route.query);

            if (!queries[filterKey]) queries[filterKey] = [option];
            else if (queries[filterKey] && !queries[filterKey].includes(option))
                queries[filterKey].push(option);
            else
                queries[filterKey].splice(
                    queries[filterKey].indexOf(option),
                    1
                );
                
            queries['p'] = ['1'];
            await this.$router.push({
                path: '/',
                params: this.$route.params,
                query: queries
            });
        } catch (e) {
            return;
        }
    }

    async resetFilters() {
        try {
            const queries = parseQuery(this.$route.query);
            filters.forEach(key => {
                delete queries[key];
            });
            queries['p'] = ['1'];
            this.$router.push({
                path: '/',
                params: this.$route.params,
                query: queries
            });
        } catch (e) {
            return;
        }
    }

    async loadOptions() {
        const availableFilters = await Promise.all(
            filters.map(filter => pokemonFilterService.getOptions({ filter }))
        );
        filters.forEach((filter, i) =>
            Vue.set(this.filtersList, filter, availableFilters[i])
        );
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