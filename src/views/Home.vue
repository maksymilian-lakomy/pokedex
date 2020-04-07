<template>
    <div>
        <!-- <div>
            <button v-for="page in pagesCount" :key="page">{{page}}</button>
        </div>
        <input type="text" v-model="search" />
        <div class="grid">
            <v-observer style="top: 0" />
            <v-pokemon-card
                v-for="pokemon in pokemonsFiltered"
                :key="pokemon.id"
                :pokemonData="pokemon.varieties[0].pokemonFull"
            />
            <div v-show="load">Wczytywanie</div>
            <v-observer style="bottom: 0" /> 
        </div>-->
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Route } from "vue-router";

import { filters, Filter } from "@/enums/Filters";
import pokemonFilterService from "@/services/pokemonFilterService";
import pokemonSpeciesService from "@/services/pokemonSpeciesService";
import { AxiosResponse } from "axios";

interface FilterKeyValuePair {
    filter: Filter;
    options: string[];
}

@Component({
    beforeRouteEnter(to: Route, from: Route, next: Function) {
        if (!to.query.page) next({ path: `${to.path}?page=1` });
        else next();
    }
    // components: {
    //     "v-pokemon-card": PokemonCard,
    //     "v-observer": Observer
    // },
})
export default class Home extends Vue {
    api = {
        limit: 1000,
        offset: 0
    };
    page = {
        limit: 20,
        offset: 0
    };

    activeFilters = new Array<FilterKeyValuePair>();
    pokemonSpeciesList = new Map<string, string>();

    async created() {
        this.page.offset = (+this.$route.query.page - 1) * this.page.limit;
        await this.loadPokemonList();
        await this.loadAllFiltersOptions();
        const filters = this.parseQuery();
        this.loadFilteredPokemons(filters);
    }

    async loadAllFiltersOptions() {
        await Promise.all(
            filters.map(async filter => {
                await this.loadFilterOptions(filter);
            })
        );
    }

    parseQuery() {
        const query = this.$route.query as Record<string, Array<string>>;
        const workingFilters = new Array<FilterKeyValuePair>();
        filters.forEach(filter => {
            if (!query[filter.api]) return;
            let options = query[filter.api];
            if (typeof options === "string")
                options = new Array<string>(options);
            workingFilters.push({ filter, options });
        });
        return workingFilters;
    }

    async loadFilteredPokemons(filters: Array<FilterKeyValuePair>) {
        let filteredResults = new Map<string, string>();
        filters.map(async filter => {
            let sumSameFilter = new Map<string, string>();
            await Promise.all(
                filter.options.map(async option => {
                    await pokemonFilterService.getAll(
                        { filter: filter.filter.api, name: option },
                        (pokemons: Map<string, string>) => {
                            sumSameFilter = new Map([
                                ...sumSameFilter,
                                ...pokemons
                            ]);
                        },
                        (error: AxiosResponse) => {
                            console.error(error);
                        }
                    );
                })
            );
            if (filteredResults.size === 0)
                filteredResults = sumSameFilter;
            else
                filteredResults = new Map([...filteredResults].filter(pokemon => sumSameFilter.has(pokemon[0])));
            console.log(filteredResults);
        });
    }

    async loadFilterOptions(filter: Filter) {
        await pokemonFilterService.getFiltersOptions(
            { filter: filter.api },
            (options: string[]) => {
                this.activeFilters.push({ filter, options });
            },
            (error: AxiosResponse) => {
                console.error(error);
            }
        );
    }

    async loadPokemonList() {
        await pokemonSpeciesService.getAll(
            (pokemons: Map<string, string>) => {
                this.pokemonSpeciesList = pokemons;
            },
            (error: AxiosResponse) => {
                console.error(error);
            }
        );
    }
}
</script>

<style lang="sass" scoped>
.grid
    position: relative
    margin: auto
    display: grid
    grid-template-columns: repeat(5, 198px)
    column-gap: 2em
    row-gap: 1.25em
</style>