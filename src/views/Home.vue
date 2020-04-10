<template>
    <div class="home">
        <v-header
            :search.sync="search"
            :activeFilters.sync="activeFilters"
            @option-change="setFilter($event)"
            @reset-filters="resetFilters()"
            @reload="reload()"
        />
        <v-pagination
            :pokemonSpeciesList="pokemonSpeciesList"
            :limit="page.limit"
            :offset="page.offset"
            :pageAmount="pageAmount"
        />
        <v-pokemon-list
            :pokemonSpeciesList="pokemonSpeciesList"
            :limit="page.limit"
            :offset.sync="page.offset"
        />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Route, Next } from "vue-router";

import TheHeader from "@/components/TheHeader.vue";
import ThePagination from "@/components/ThePagination.vue";

import PokemonList from "@/components/PokemonList.vue";

import pokemonFilterService from "@/services/pokemonFilterService";
import pokemonSpeciesService from "@/services/pokemonSpeciesService";
import PokemonSpeciesData from "../classes/PokemonSpeciesData";

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate"]);

import { EventBus } from "@/events/EventBus";

interface OptionChangeEvent {
    filterKey: string;
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
        this.reload();
        next();
    }

    get pageAmount() {
        if (this.pokemonSpeciesList.length === 0) return 0;
        return (
            Math.floor(this.pokemonSpeciesList.length / this.page.limit) +
            (this.pokemonSpeciesList.length % this.page.limit !== 0 ? 1 : 0)
        );
    }

    get overRange() {
        if (+this.$route.params.page > this.pageAmount)
            return true;
        return false;
    }

    get underRange() {
        if (+this.$route.params.page <= 0)
            return true;
        return false;
    }

    setFilter({ filterKey, option }: OptionChangeEvent) {
        const options = this.activeFilters[filterKey];
        if (!options) {
            this.$set(this.activeFilters, filterKey, [option]);
        } else {
            const index = options.indexOf(option);
            index !== -1 ? options.splice(index, 1) : options.push(option);
        }
        this.reload();
    }

    resetFilters() {
        this.activeFilters = {};
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
        window.scrollTo(0, 0);
        EventBus.$emit("loading-species-list", true);
        this.pokemonSpeciesList = await this.loadPokemonSpeciesList();
        if (this.overRange)
            this.$router.push({ params: { page: this.pageAmount.toString() } });
        else if (this.underRange)
            this.$router.push({params: {page: '1'}});
        this.calculateOffset();
        EventBus.$emit("loading-species-list", false);
    }

    async created() {
        this.reload();
    }
}
</script>

<style lang="sass" scoped>
.home
    display: flex
    position: relative
    flex-direction: column
    margin: auto
    width: 75%
    @media (max-width: 768px)
        width: 90%                
    @media (max-width: 350px)
        width: 100%
</style>