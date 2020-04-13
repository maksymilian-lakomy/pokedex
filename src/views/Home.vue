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
import Vue from "vue";
import Component from "vue-class-component";
import { parseQuery } from "@/mixins/parseQuery";

import ThePagination from "@/components/ThePagination.vue";

import PokemonList from "@/components/PokemonList.vue";

import pokemonFilterService from "@/services/pokemonFilterService";
import pokemonSpeciesService from "@/services/pokemonSpeciesService";
import PokemonSpeciesData from "../classes/PokemonSpeciesData";

import { EventBus } from "@/events/EventBus";
import { Watch, Mixins } from "vue-property-decorator";

import { Route, Next } from "vue-router";

import { Filters } from "@/mixins/Filters.ts";
import { Search } from "@/mixins/Search.ts";

interface OptionChangeEvent {
    filterKey: string;
    option: string;
}

@Component({
    components: {
        "v-pokemon-list": PokemonList,
        "v-pagination": ThePagination
    }
})
export default class Home extends Mixins(Filters, Search) {
    pokemonSpeciesList = new Array<string>();
    @Watch("pokemonSpeciesList")
    onPokemonSpeciesListChange() {
        const availablePage = this.checkPageBoundary(this.currentPage);
        if (availablePage !== this.currentPage) this.setPage(availablePage);
    }

    page = {
        limit: 20,
        offset: 0
    };

    created() {
        this.calculateOffset();
        this.reload();
    }

    // --------------------------
    // Query Page
    // --------------------------
    get currentPage(): number {
        const query = parseQuery(this.$route.query);
        if (!query.p) return 1;
        return +query.p;
    }

    @Watch("currentPage")
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

    @Watch("search")
    onSearchChange() {
        this.reload();
    }

    @Watch("activeFilters")
    onActiveFiltersChange() {
        this.reload();
    }

    // --------------------------
    // View logic
    // --------------------------
    async reload() {
        window.scrollTo(0, 0);
        EventBus.$emit("loading-species-list", true);
        this.pokemonSpeciesList = await this.loadPokemonSpeciesList();
        EventBus.$emit("loading-species-list", false);
    }

    async loadPokemonSpeciesList(): Promise<Array<string>> {
        let pokemonSpeciesMap = new Map<string, string>();
        const activeOptionsCheck = () => {
            for (const options in this.activeFilters)
                if (this.activeFilters[options].length > 0) return true;
            return false;
        };
        pokemonSpeciesMap = activeOptionsCheck()
            ? await pokemonFilterService.getFiltersIntersection({
                  filters: this.activeFilters
              })
            : await pokemonSpeciesService.getMap();
        pokemonSpeciesMap.forEach((value, key) => {
            if (this.search && !key.startsWith(this.search.toLowerCase()))
                pokemonSpeciesMap.delete(key);
        });
        return [...pokemonSpeciesMap.values()];
    }

    // --------------------------
    // Miscellaneous
    // --------------------------
    cardClicked(event: PokemonSpeciesData) {
        this.$router.push({
            name: "Pokemon",
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