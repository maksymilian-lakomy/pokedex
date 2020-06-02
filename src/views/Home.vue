<template>
    <div class="home">
        <v-pagination
            :currentPage="currentPage"
            @change-page="setPage($event)"
            :pageAmount="pageAmount"
        />
        <v-pokemon-list
            @click-card="cardClicked($event)"
            :pokemonSpeciesList="pokemonSpeciesList"
            :limit="page.limit"
            :offset.sync="page.offset"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { parseQuery } from '@/mixins/parseQuery';

import ThePagination from '@/components/ThePagination.vue';

import PokemonList from '@/components/PokemonList.vue';

import pokemonFilterService from '@/services/pokemonFilterService';
import pokemonSpeciesService from '@/services/pokemonSpeciesService';
import PokemonSpeciesData from '../classes/PokemonSpeciesData';

import { EventBus } from '@/events/EventBus';
import { Watch, Mixins } from 'vue-property-decorator';

import { Route, Next } from 'vue-router';

import { Filters } from '@/mixins/Filters.ts';
import { Search } from '@/mixins/Search.ts';

import { MetaInfo } from 'vue-meta';

interface OptionChangeEvent {
    filterKey: string;
    option: string;
}
Component.registerHooks(['beforeRouteEnter']);

@Component({
    components: {
        'v-pokemon-list': PokemonList,
        'v-pagination': ThePagination
    },
    metaInfo(): MetaInfo {
        return {
            title: 'Pokedex',
            titleTemplate: undefined
        };
    }
})
export default class Home extends Mixins(Filters, Search) {
    pokemonSpeciesList = new Array<string>();
    @Watch('pokemonSpeciesList')
    onPokemonSpeciesListChange() {
        const availablePage = this.checkPageBoundary(this.currentPage);
        if (availablePage !== this.currentPage) this.setPage(availablePage);
    }

    page = {
        limit: 50,
        offset: 0
    };

    beforeRouteEnter(to: Route, from: Route, next: Next<Home>) {
        next(async vm => {
            await vm.calculateOffset();
            await vm.reload();
        });
    }

    // --------------------------
    // Query Page
    // --------------------------
    get currentPage(): number {
        const query = parseQuery(this.$route.query);
        if (!query.p) return 1;
        return +query.p;
    }

    @Watch('currentPage')
    onCurrentPageChange() {
        this.calculateOffset();
    }

    setPage(page: number) {
        const query = parseQuery(this.$route.query);
        query.p = [page.toString()];
        this.$router.push({
            path: this.$route.path,
            params: this.$route.params,
            query
        });
    }

    get pageAmount(): number {
        if (this.pokemonSpeciesList.length === 0) return 0;
        return (
            Math.floor(this.pokemonSpeciesList.length / this.page.limit) +
            (this.pokemonSpeciesList.length % this.page.limit !== 0 ? 1 : 0)
        );
    }

    calculateOffset() {
        this.page.offset = (this.currentPage - 1) * this.page.limit;
    }

    checkPageBoundary(page: number) {
        if (this.pokemonSpeciesList.length === 0) return 1;
        else if (page > this.pageAmount) return this.pageAmount;
        else return page;
    }

    @Watch('search')
    onSearchChange() {
        this.reload();
    }

    @Watch('activeFilters')
    onActiveFiltersChange() {
        this.reload();
    }

    // --------------------------
    // View logic
    // --------------------------
    async reload() {
        window.scrollTo(0, 0);
        EventBus.$emit('loading-species-list', true);
        this.pokemonSpeciesList = await this.loadPokemonSpeciesList();
        EventBus.$emit('loading-species-list', false);
    }

    async loadPokemonSpeciesList(): Promise<Array<string>> {
        const pokemonSpeciesMap = this.hasActiveFilters
            ? await this.pokemonsByFilterIntersection()
            : await pokemonSpeciesService.getMap();
        this.searchFilter(pokemonSpeciesMap);
        return Object.values(pokemonSpeciesMap);
    }

    searchFilter(map: Record<string, string>): void {
        if (!this.search) return;
        for (const name in map) {
            if (!name.startsWith(this.search.toLowerCase().split(' ').join('-'))) delete map[name];
        }
    }

    async pokemonsByFilterIntersection(): Promise<Record<string, string>> {
        // Still kinda messy
        const filterKeys = Object.keys(this.activeFilters);
        const results = await Promise.all(
            filterKeys.map(filter =>
                pokemonFilterService.getAllFilteredPokemonSpecies({
                    filter,
                    options: this.activeFilters[filter]
                })
            )
        );
        for (let i = 1; i < results.length; i++) 
            this.intersection(results[0], results[i]);
        return {...results[0]};
    }

    intersection(obj1: Record<string, string>, obj2: Record<string, string>): void {
        for (const name in obj1)
            if (obj2[name] === undefined)
                delete obj1[name];
    }

    get hasActiveFilters() {
        for (const options in this.activeFilters)
            if (this.activeFilters[options].length !== 0) return true;
        return false;
    }

    // --------------------------
    // Miscellaneous
    // --------------------------
    cardClicked(event: PokemonSpeciesData) {
        this.$router.push({
            name: 'Pokemon',
            params: {
                speciesId: event.id.toString(),
                evolution: event.evolutionChain.toString()
            }
        });
    }
}
</script>

<style lang="sass" scoped>
</style>