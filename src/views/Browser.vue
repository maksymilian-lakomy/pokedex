<template>
    <div>
        <v-browser-pagination :currentPage="currentPage" :pageAmount="pageAmount" />
        <v-browser-list :pokemonSpecies="pokemonSpecies" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import BrowserPagination from '@/components/Browser/BrowserPagination.vue';
import BrowserList from '@/components/Browser/BrowserList.vue';

import pokemonSpeciesService from '@/services/pokemonSpeciesService';
import PokemonSpeciesData from '@/classes/PokemonSpeciesData';
import { PokemonsSpeciesList } from '@/classes/PokemonsList';

import { MetaInfo } from 'vue-meta';

import { Queries } from '@/classes/Queries';
import { filters } from '@/enums/Filters';
import { countTree } from '@/methods/countTree';

@Component({
    components: {
        'v-browser-list': BrowserList,
        'v-browser-pagination': BrowserPagination
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
            this.$router.push({path: '/', params: this.$route.params, query: queries.queries });
            return;
        }

        let newFilters: Record<string, Array<string>> | undefined = queries.getMap(filters);
        let search: string | undefined = undefined;
        let page: number | undefined = undefined;

        if (this.pokemonsSpeciesList.filters !== null && countTree(this.pokemonsSpeciesList.filters) === countTree(newFilters)) 
            newFilters = undefined;

        if (queries.has('p'))
            page = parseInt(queries.queries['p'][0]);

        if (queries.has('search')) 
            search = queries.queries['search'][0];

        if (!queries.has('search') && this.pokemonsSpeciesList.search.length > 0)
            search = '';

        this.pokemonsSpeciesList.setOptions({ filters: newFilters, page, search });
        if (newFilters !== undefined)
            await this.pokemonsSpeciesList.reloadSpeciesList();

        this.pageUrls = this.pokemonsSpeciesList.selectedPokemonsUrls;
    }

    get queries(): Queries {
        return new Queries(this.$route.query);
    }

    cardClicked(event: PokemonSpeciesData) {
        this.$router.push({
            name: 'Pokemon',
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