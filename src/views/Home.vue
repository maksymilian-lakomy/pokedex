<template>
    <div class="home">
        <v-header class="home__header" :search.sync="search" />
        <v-pokemon-list
            class="home__listing"
            v-if="pokemonSpeciesList.length > 0"
            :pokemonSpeciesList="pokemonSpeciesList"
            :limit="page.limit"
            :offset.sync="page.offset"
        />
    </div>
    <!-- <div>
            <button v-for="page in pagesCount" :key="page">{{page}}</button>
    </div>-->
    <!-- <input type="text" v-model="search" /> -->
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { Route, Next } from "vue-router";

import TheHeader from "@/components/TheHeader.vue";

import PokemonList from "@/components/PokemonList.vue";

import { Filter } from "@/enums/Filters";
import pokemonFilterService from "@/services/pokemonFilterService";
import pokemonSpeciesService from "@/services/pokemonSpeciesService";
import PokemonSpeciesData from "../classes/PokemonSpeciesData";

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate"]);

@Component({
    components: {
        "v-pokemon-list": PokemonList,
        "v-header": TheHeader
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
    };

    search = "";

    async beforeRouteUpdate(to: Route, from: Route, next: Next<Home>) {
        console.log(this.$route);
        next();
    }

    async loadPokemonSpeciesList(search?: string): Promise<Array<string>> {
        const filters = pokemonFilterService.getActiveFilters(this.$route);
        let pokemonSpeciesMap = new Map<string, string>();
        pokemonSpeciesMap =
            filters.length > 0
                ? await pokemonFilterService.getFiltersIntersection({ filters })
                : await pokemonSpeciesService.getMap();
        if (search)
            pokemonSpeciesMap.forEach((value, key) => {
                if (!key.includes(search)) pokemonSpeciesMap.delete(key);
            });
        return [...pokemonSpeciesMap.values()];
    }

    async calculateOffset() {
        this.page.offset = (+this.$route.query.page - 1) * this.page.limit;
        if (this.page.offset > this.pokemonSpeciesList.length)
            this.page.offset = this.pokemonSpeciesList.length - this.page.limit;
        if (this.page.offset < 0) this.page.offset = 0;
    }

    async reload(search?: string) {
        this.pokemonSpeciesList = await this.loadPokemonSpeciesList(search);
        this.calculateOffset();
    }

    async created() {
        this.reload();
    }

    @Watch("search")
    async onPropertyChange(value: string) {
        this.reload(value);
    }
}
</script>

<style lang="sass" scoped>
.home
    display: grid
    grid-template-columns: 1fr 2em max-content 1fr
    grid-template-areas: ". header header ." ". pagination listing ."

    &__header
        grid-area: header

    &__listing
        grid-area: listing
</style>