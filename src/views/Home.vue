<template>
    <div>
        <v-pokemon-list v-if="pokemonSpeciesList.length > 0" :pokemonSpeciesList="pokemonSpeciesList" :limit="page.limit" :offset.sync="page.offset" />
    </div>
    <!-- <div>
            <button v-for="page in pagesCount" :key="page">{{page}}</button>
    </div>-->
    <!-- <input type="text" v-model="search" /> -->
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Route, Next } from "vue-router";

import PokemonList from "@/components/PokemonList.vue";

import { Filter } from "@/enums/Filters";
import pokemonFilterService from "@/services/pokemonFilterService";
import pokemonSpeciesService from "@/services/pokemonSpeciesService";
import PokemonSpeciesData from "../classes/PokemonSpeciesData";

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate"]);

@Component({
    components: {
        "v-pokemon-list": PokemonList
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
    filters = new Array<{
        filter: Filter;
        options: Array<string>;
    }>();

    pokemonSpeciesList = new Array<string>();
    page = {
        limit: 20,
        offset: 0
    }

    async loadPokemonSpeciesList(): Promise<Array<string>> {
        const filters = pokemonFilterService.getActiveFilters(this.$route);
        let pokemonSpeciesMap = new Map<string, string>();
        pokemonSpeciesMap = filters.length > 0 ? await pokemonFilterService.getFiltersIntersection({filters}) : await pokemonSpeciesService.getMap();
        const search = this.$route.query.search as string;
        if (search)
            pokemonSpeciesMap.forEach((value, key) => {
                if (!key.includes(search)) pokemonSpeciesMap.delete(key);
            });
        return [...pokemonSpeciesMap.values()];
    }
 
    async created() {
        this.page.offset = (+this.$route.query.page - 1) * this.page.limit;
        this.pokemonSpeciesList = await this.loadPokemonSpeciesList();
    }
}
</script>y
