<template>
    <div class="home">
        <v-header
            :activeFilters.sync="activeFilters"
            @option-change="setFilter($event)"
            @reset-filters="resetFilters()"
            @reload="reload()"
            @search="setSearch($event)"
        />
        <v-pagination
            :currentPage="page.currentPage"
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
import { Watch } from 'vue-property-decorator';

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
        currentPage: 1,
        limit: 20,
        offset: 0
    };

    search = "";

    activeFilters: Record<string, Array<string>> = {};

    @Watch("pokemonSpeciesList")
    onPokemonSpeciesListChange() {
        this.setPage(this.page.currentPage);
    }

    setPage(page: number) {
        const pageCheck = this.checkPageBoundary(page);
        if (pageCheck === this.page.currentPage)
            return;
        this.page.currentPage = pageCheck;
        this.calculateOffset();
    }

    calculateOffset() {
        this.page.offset = (this.page.currentPage - 1) * this.page.limit;
    }

    checkPageBoundary(page: number) {
        if (this.pokemonSpeciesList.length === 0)
            return 1;
        else if (page > this.pageAmount)
            return this.pageAmount;
        else
            return page;
    }

    get pageAmount(): number {
        if (this.pokemonSpeciesList.length === 0) return 0;
        return (
            Math.floor(this.pokemonSpeciesList.length / this.page.limit) +
            (this.pokemonSpeciesList.length % this.page.limit !== 0 ? 1 : 0)
        );
    }

    async setSearch(search: string) {
        this.search = search;
        await this.reload();
    }

    async setFilter({ filterKey, option }: OptionChangeEvent) {
        const options = this.activeFilters[filterKey];
        if (!options) {
            this.$set(this.activeFilters, filterKey, [option]);
        } else {
            const index = options.indexOf(option);
            index !== -1 ? options.splice(index, 1) : options.push(option);
        }
        await this.reload();
    }

    async resetFilters() {
        this.activeFilters = {};
        await this.reload();
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

    async reload() {
        window.scrollTo(0, 0);
        EventBus.$emit("loading-species-list", true);
        this.pokemonSpeciesList = await this.loadPokemonSpeciesList();
        EventBus.$emit("loading-species-list", false);
    }

    async created() {
        await this.reload();
    }

    cardClicked(event: number) {
        this.$router.push({name: 'Pokemon', params: {
            speciesName: event.toString()
        }})
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