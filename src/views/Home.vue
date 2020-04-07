<template>
    <div>
        <!-- <div>
            <button v-for="page in pagesCount" :key="page">{{page}}</button>
        </div>-->
        <!-- <input type="text" v-model="search" /> -->
        <div class="grid">
            <v-observer @intersection="loadPreviousPokemons" style="top: 0" />
            <v-pokemon-card
                v-for="pokemon in pokemons"
                :key="pokemon.id"
                :pokemonData="pokemon.varieties[0].pokemonFull"
            />
            <!-- <div v-show="load">Wczytywanie</div> -->
            <v-observer @intersection="loadNextPokemons" style="bottom: 0" />
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

@Component({
    beforeRouteEnter(to: Route, from: Route, next: Function) {
        if (!to.query.page) next({ path: `${to.fullPath}?page=1` });
        else next();
    },
    components: {
        "v-pokemon-card": PokemonCard,
        "v-observer": Observer
    },
    computed: {
        pokemons() {
            const pokemonSpecies = this.$data.pokemonSpecies as Array<
                PokemonSpeciesData
            >;
            return pokemonSpecies.sort((a, b) => a.id - b.id);
        }
    }
})
export default class Home extends Vue {
    page = {
        limit: 20,
        offset: 0,
        loading: false
    };

    filters = new Array<{
        filter: Filter;
        options: Array<string>;
    }>();

    pokemonSpeciesList = new Array<string>();
    pokemonSpecies = new Array<PokemonSpeciesData>();

    async created() {
        this.page.offset = (+this.$route.query.page - 1) * this.page.limit;
        const activeFilters = this.getActiveFilters();
        activeFilters.length > 0
            ? await this.loadFilteredPokemonSpeciesList(activeFilters)
            : await this.loadPokemonSpeciesList();
        this.loadNextPokemons();
    }

    async loadNextPokemons() {
        if (this.page.loading) return;
        const startPosition = this.page.offset + this.pokemonSpecies.length;
        this.loadPage(startPosition, this.page.limit);
    }

    async loadPreviousPokemons() {
        if (this.page.loading) return;
        this.page.offset -= this.page.limit;
        let limit = this.page.limit;
        if (this.page.offset < 0) {
            limit += this.page.offset;
            this.page.offset = 0;
        }
        this.loadPage(this.page.offset, limit);
    }

    async loadPage(startPosition: number, limit: number) {
        const newPokemons = new Array<PokemonSpeciesData>();
        const condition = (i: number) =>
            i < startPosition + limit && i < this.pokemonSpeciesList.length;
        for (let i = startPosition; condition(i); i++)
            newPokemons.push(
                await pokemonSpeciesService.getByUrl(this.pokemonSpeciesList[i])
            );
        this.pokemonSpecies.push(...newPokemons);
    }

    getActiveFilters() {
        const query = this.$route.query as Record<string, Array<string>>;
        const activeFilters = new Array<{
            filter: Filter;
            options: Array<string>;
        }>();
        filters.forEach(filter => {
            if (!query[filter.api]) return;
            let options = query[filter.api];
            if (typeof options === "string")
                options = new Array<string>(options);
            activeFilters.push({ filter, options });
        });
        return activeFilters;
    }

    async loadFilteredPokemonSpeciesList(
        filters: { filter: Filter; options: Array<string> }[]
    ) {
        this.pokemonSpeciesList = [
            ...(
                await pokemonFilterService.getFiltersIntersection({ filters })
            ).values()
        ];
    }

    async loadPokemonSpeciesList() {
        this.pokemonSpeciesList = [
            ...(await pokemonSpeciesService.getMap()).values()
        ];
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