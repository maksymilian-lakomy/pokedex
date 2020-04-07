<template>
    <div>
        <!-- <div>
            <button v-for="page in pagesCount" :key="page">{{page}}</button>
        </div>-->
        <!-- <input type="text" v-model="search" /> -->
        <div class="grid">
            <v-observer style="top: 0" />
            <v-pokemon-card
                v-for="pokemon in pokemonSpecies"
                :key="pokemon.id"
                :pokemonData="pokemon.varieties[0].pokemonFull"
            />
            <!-- <div v-show="load">Wczytywanie</div> -->
            <v-observer style="bottom: 0" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Route } from "vue-router";

import PokemonCard from "@/components/PokemonCard.vue";
import Observer from "@/components/Observer.vue";

import { filters, Filter } from "@/enums/Filters";
import pokemonFilterService from "@/services/pokemonFilterService";
import pokemonSpeciesService from "@/services/pokemonSpeciesService";
import { AxiosResponse } from "axios";
import PokemonSpeciesData from "../classes/PokemonSpeciesData";

interface FilterKeyValuePair {
    filter: Filter;
    options: string[];
}

@Component({
    beforeRouteEnter(to: Route, from: Route, next: Function) {
        if (!to.query.page) next({ path: `${to.path}?page=1` });
        else next();
    },
    components: {
        "v-pokemon-card": PokemonCard,
        "v-observer": Observer
    }
})
export default class Home extends Vue {
    page = {
        limit: 20,
        offset: 0
    };

    filters = new Array<FilterKeyValuePair>();
    pokemonSpeciesList = new Array<string>();
    pokemonSpecies: Array<PokemonSpeciesData> = [];

    async created() {
        this.page.offset = (+this.$route.query.page - 1) * this.page.limit;
        const filters = this.parseQuery();
        if (filters.length > 0) await this.loadFilteredPokemons(filters);
        else await this.loadPokemonList();
        console.log(this.pokemonSpeciesList.length);
        this.loadPokemons();
    }

    async loadPokemons(direction = 1) {
        for (
            let i = this.page.offset;
            i < this.page.offset + this.page.limit * direction &&
            i < this.pokemonSpeciesList.length &&
            i >= 0;
            i++
        ) {
            pokemonSpeciesService.getByUrl(
                this.pokemonSpeciesList[i],
                (pokemon: PokemonSpeciesData) => {
                    this.pokemonSpecies.push(pokemon);
                },
                (error: AxiosResponse) => {
                    console.error(error);
                }
            );
        }
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
        await Promise.all(
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
                if (filteredResults.size === 0) filteredResults = sumSameFilter;
                else
                    filteredResults = new Map(
                        [...filteredResults].filter(pokemon =>
                            sumSameFilter.has(pokemon[0])
                        )
                    );
            })
        );
        this.pokemonSpeciesList = [...filteredResults.values()];
    }

    async loadFilterOptions(filter: Filter) {
        await pokemonFilterService.getFiltersOptions(
            { filter: filter.api },
            (options: string[]) => {
                this.filters.push({ filter, options });
            },
            (error: AxiosResponse) => {
                console.error(error);
            }
        );
    }

    async loadPokemonList() {
        await pokemonSpeciesService.getAll(
            (pokemons: Map<string, string>) => {
                this.pokemonSpeciesList = [...pokemons.values()];
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