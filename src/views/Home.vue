<template>
    <div class="home">
        <v-header
            class="home__header"
            :search.sync="search"
            :activeFilters.sync="activeFilters"
            @optionChange="setFilter($event)"
            @reload="reload()"
        />
        <v-pagination
            v-if="pokemonSpeciesList.length > 0"
            :pokemonSpeciesList="pokemonSpeciesList"
            class="home__pagination"
            :limit="page.limit"
            :offset="page.offset"
        />
        <v-pokemon-list
            class="home__listing"
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
import ThePagination from "@/components/ThePagination.vue";

import PokemonList from "@/components/PokemonList.vue";

import pokemonFilterService from "@/services/pokemonFilterService";
import pokemonSpeciesService from "@/services/pokemonSpeciesService";
import PokemonSpeciesData from "../classes/PokemonSpeciesData";

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate"]);

interface FilterEvent {
    filter: string;
    option: string;
}

@Component({
    components: {
        "v-pokemon-list": PokemonList,
        "v-header": TheHeader,
        "v-pagination": ThePagination
    },
    computed: {
        pokemons() {
            const pokemonSpecies = this.$data.pokemonSpecies as Array<
                PokemonSpeciesData
            >;
        }
    }
})
export default class Home extends Vue {
    pokemonSpeciesList = new Array<string>();
    page = {
        limit: 20,
        offset: 0
    };

    search = "";

    activeFilters: Record<string, Array<string>> = {};

    beforeRouteUpdate(to: Route, from: Route, next: Next<Home>) {
        this.calculateOffset();
        this.reload();
        next();
    }

    setFilter({ filter, option }: FilterEvent) {
        const options = this.activeFilters[filter];
        if (!options) {
            this.$set(this.activeFilters, filter, [option]);
        } else {
            const index = options.indexOf(option);
            index !== -1 ? options.splice(index, 1) : options.push(option);
        }
        this.reload();
    }

    activeOptionsCheck(): boolean {
        for (const options in this.activeFilters)
            if (this.activeFilters[options].length > 0) return true;
        return false;
    }

    async loadPokemonSpeciesList(): Promise<Array<string>> {
        let pokemonSpeciesMap = new Map<string, string>();
        pokemonSpeciesMap = this.activeOptionsCheck()
            ? await pokemonFilterService.getFiltersIntersection({
                  filters: this.activeFilters
              })
            : await pokemonSpeciesService.getMap();
        if (this.search)
            pokemonSpeciesMap.forEach((value, key) => {
                if (!key.startsWith(this.search.toLowerCase()))
                    pokemonSpeciesMap.delete(key);
            });
        return [...pokemonSpeciesMap.values()];
    }

    async calculateOffset() {
        this.page.offset = this.$route.params.page
            ? (+this.$route.params.page - 1) * this.page.limit
            : 0;
        if (this.page.offset > this.pokemonSpeciesList.length)
            this.page.offset = this.pokemonSpeciesList.length - this.page.limit;
        if (this.page.offset < 0) this.page.offset = 0;
    }

    async reload() {
        this.pokemonSpeciesList = await this.loadPokemonSpeciesList();
        this.calculateOffset();
    }

    async created() {
        this.reload();
    }
}
</script>

<style lang="sass" scoped>
.home
    display: grid
    grid-template-columns: 1fr 4em max-content 1fr
    grid-template-areas: ". . header ." ". pagination listing ."

    &__header
        grid-area: header

    &__pagination
        grid-area: pagination

    &__listing
        grid-area: listing
</style>