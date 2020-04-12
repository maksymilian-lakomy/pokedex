<template>
    <div class="home">
        <v-header
            :activeFilters.sync="activeFilters"
            @option-change="setFilter($event)"
            @reset-filters="resetFilters()"
            @search="setSearch($event)"
            :search="search"
        />
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

import TheHeader from "@/components/TheHeader.vue";
import ThePagination from "@/components/ThePagination.vue";

import PokemonList from "@/components/PokemonList.vue";

import pokemonFilterService from "@/services/pokemonFilterService";
import pokemonSpeciesService from "@/services/pokemonSpeciesService";
import PokemonSpeciesData from "../classes/PokemonSpeciesData";

import { EventBus } from "@/events/EventBus";
import { Watch } from "vue-property-decorator";

import { filters } from "@/enums/Filters";
import { Route, Next } from "vue-router";

interface OptionChangeEvent {
    filterKey: string;
    option: string;
}

@Component({
    components: {
        "v-pokemon-list": PokemonList,
        "v-header": TheHeader,
        "v-pagination": ThePagination
    }
})
export default class Home extends Vue {
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

    get pageAmount(): number {
        if (this.pokemonSpeciesList.length === 0) return 0;
        return (
            Math.floor(this.pokemonSpeciesList.length / this.page.limit) +
            (this.pokemonSpeciesList.length % this.page.limit !== 0 ? 1 : 0)
        );
    }

    setPage(page: number) {
        const query = parseQuery(this.$route.query);
        if (query.p && query.p.includes(page.toString())) return;
        query.p = [page.toString()];
        this.$router.push({
            path: this.$route.path,
            params: this.$route.params,
            query
        });
    }

    calculateOffset() {
        this.page.offset = (this.currentPage - 1) * this.page.limit;
    }

    checkPageBoundary(page: number) {
        if (this.pokemonSpeciesList.length === 0) return 1;
        else if (page > this.pageAmount) return this.pageAmount;
        else return page;
    }

    // --------------------------
    // Query Search
    // --------------------------
    get search(): string | undefined {
        const query = parseQuery(this.$route.query);
        if (query.search) return parseQuery(this.$route.query).search[0];
        else return undefined;
    }

    @Watch("search")
    onSearchChange() {
        this.reload();
    }

    async setSearch(search: string) {
        const query = parseQuery(this.$route.query);
        if (!query.search && search.length === 0) return;
        else if (query.search && query.search.includes(search)) return;
        else if (search.length === 0) delete query.search;
        else query.search = [search];
        this.$router.push({
            path: this.$route.path,
            params: this.$route.params,
            query
        });
    }

    // --------------------------
    // Query for filters
    // --------------------------
    get activeFilters(): Record<string, Array<string>> {
        const activeFilters: Record<string, Array<string>> = parseQuery(
            this.$route.query
        );
        for (const query in activeFilters)
            if (!filters.includes(query)) delete activeFilters[query];
        return activeFilters;
    }

    @Watch("activeFilters")
    onActiveFiltersChange() {
        this.reload();
    }

    async setFilter({ filterKey, option }: OptionChangeEvent) {
        const query = parseQuery(this.$route.query);
        if (!query[filterKey]) query[filterKey] = [option];
        else if (query[filterKey] && !query[filterKey].includes(option))
            query[filterKey].push(option);
        else query[filterKey].splice(query[filterKey].indexOf(option), 1);
        this.$router.push({
            path: this.$route.path,
            params: this.$route.params,
            query
        });
    }

    async resetFilters() {
        const query = parseQuery(this.$route.query);
        for (const filterKey of filters) {
            if (query[filterKey]) delete query[filterKey];
        }
        this.$router.push({
            path: this.$route.path,
            params: this.$route.params,
            query
        });
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