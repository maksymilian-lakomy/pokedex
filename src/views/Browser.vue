<template>
    <v-layout-main>
        <v-browser-loading v-show="loading" />
        <div v-if="displayList">
            <v-browser-pagination :currentPage="currentPage" :pageAmount="pageAmount" />
            <v-browser-list :pokemonSpecies="pokemonSpecies" />
        </div>
        <keep-alive>
            <v-not-found v-if="!displayList" class="not-found">
                <h1>There are no pokemons that match your criteria!</h1>
                <span v-if="searchQuery">
                    <p>
                        Are you sure that you are looking for
                        '
                        <b>{{searchQuery}}</b>'?
                    </p>
                    <p>If it is a variation of a pokemon, it won't be listed here!</p>
                </span>
            </v-not-found>
        </keep-alive>
    </v-layout-main>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import BrowserPagination from '@/components/Browser/BrowserPagination.vue';
import BrowserList from '@/components/Browser/BrowserList.vue';
import BrowserLoading from '@/components/Browser/BrowserLoading.vue';
import NotFound from '@/components/NotFound.vue';

import pokemonSpeciesService from '@/services/pokemonSpeciesService';
import PokemonSpeciesData from '@/classes/PokemonSpeciesData';
import { PokemonsSpeciesList } from '@/classes/PokemonsList';

import { MetaInfo } from 'vue-meta';

import { Queries } from '@/classes/Queries';
import { filters } from '@/enums/Filters';
import { countTree } from '@/methods/countTree';

import Main from '@/Layouts/Main.vue';

@Component({
    components: {
        'v-browser-list': BrowserList,
        'v-browser-pagination': BrowserPagination,
        'v-browser-loading': BrowserLoading,
        'v-not-found': NotFound,
        'v-layout-main': Main
    },
    metaInfo(): MetaInfo {
        return {
            title: 'Pokedex',
            titleTemplate: undefined
        };
    }
})
export default class Browser extends Vue {
    private readonly pokemonsSpeciesList = new PokemonsSpeciesList();
    private pokemonSpecies = new Array<PokemonSpeciesData>();
    private pageUrls: Array<string> = [];
    private loading = true;

    get searchQuery(): string | null {
        if (this.queries.has('search'))
            return this.queries.queries['search'][0];
        return null;
    }

    get displayList(): boolean {
        return this.loading || this.pokemonSpecies.length > 0;
    }

    get currentPage(): number {
        return this.pokemonsSpeciesList.currentPage;
    }

    get pageAmount(): number {
        return this.pokemonsSpeciesList.pageAmount;
    }

    @Watch('pageUrls')
    async onPokemonSpeciesListChange(pageUrls: Array<string>) {
        this.pokemonSpecies = await Promise.all(
            pageUrls.map(url => pokemonSpeciesService.getByUrl({ url }))
        );
        this.loading = false;
    }

    @Watch('queries', { immediate: true })
    async onQueriesChange(queries: Queries) {
        this.loading = true;
        if (!queries.has('p')) {
            this.queries.setQuery('p', (1).toString());
            try {
                await this.$router.push({
                    path: '/',
                    params: this.$route.params,
                    query: queries.queries
                });
                return;
            } catch (e) {
                return;
            }
        }

        let newFilters:
            | Record<string, Array<string>>
            | undefined = queries.getMap(filters);
        let search: string | undefined = undefined;
        let page: number | undefined = undefined;

        if (
            this.pokemonsSpeciesList.filters !== null &&
            countTree(this.pokemonsSpeciesList.filters) ===
                countTree(newFilters)
        )
            newFilters = undefined;

        if (queries.has('p')) page = parseInt(queries.queries['p'][0]);

        if (queries.has('search')) search = queries.queries['search'][0];

        if (
            !queries.has('search') &&
            this.pokemonsSpeciesList.search.length > 0
        )
            search = '';

        this.pokemonsSpeciesList.setOptions({
            filters: newFilters,
            page,
            search
        });
        if (newFilters !== undefined)
            await this.pokemonsSpeciesList.reloadSpeciesList();

        this.pageUrls = this.pokemonsSpeciesList.selectedPokemonsUrls;
    }

    get queries(): Queries {
        return new Queries(this.$route.query);
    }

    async cardClicked(event: PokemonSpeciesData) {
        try {
            await this.$router.push({
                name: 'Pokemon',
                params: {
                    speciesId: event.id.toString(),
                    evolution: event.evolutionChain.toString()
                }
            });
        } catch (e) {
            return;
        }
    }
}
</script>

<style lang="sass" scoped>
.not-found
    width: 100%
</style>