<template>
    <div class="home">
        <v-pagination @change-page="setPage($event)" />
        <v-pokemon-list @click-card="cardClicked($event)" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { parseQuery } from '@/mixins/parseQuery';

import ThePagination from '@/components/ThePagination.vue';

import PokemonList from '@/components/PokemonList.vue';

import pokemonFilterService from '@/services/pokemonFilterService';
import pokemonSpeciesService from '@/services/pokemonSpeciesService';
import PokemonSpeciesData from '../classes/PokemonSpeciesData';

import { EventBus } from '@/events/EventBus';
import { Watch, Mixins } from 'vue-property-decorator';

import { Route, Next } from 'vue-router';

import { Filters } from '@/mixins/Filters.ts';
import { Search } from '@/mixins/Search.ts';

import { MetaInfo } from 'vue-meta';

import { getModule, PokemonsModule } from '@/store/pokemons/module';

Component.registerHooks(['beforeRouteEnter', 'beforeRouteUpdate']);

import { filters as availableFilters } from "@/enums/Filters";

@Component({
    components: {
        'v-pokemon-list': PokemonList,
        'v-pagination': ThePagination
    },
    metaInfo(): MetaInfo {
        return {
            title: 'Pokedex',
            titleTemplate: undefined
        };
    }
})
export default class Home extends Mixins(Filters, Search) {
    readonly pokemonsStore = getModule(PokemonsModule, this.$store);

    beforeRouteEnter(to: Route, from: Route, next: Next<Home>) {
        next(vm => {
            vm.setUpStore(to);
        });
    }

    beforeRouteUpdate(to: Route, from: Route, next: Next<Home>) {
        this.setUpStore(to);
        next();
    }

    setUpStore(route: Route) {
        const queries = parseQuery(route.query);
        const page = queries['p'] ? parseInt(queries['p'][0]) : 1;
        const filters: Record<string, Array<string>> = {};
        for (const query in queries)
            if (availableFilters.includes(query))
                filters[query] = queries[query];
        const search = queries['search'] ? queries['search'][0] : null;
        this.pokemonsStore.setFilters(filters);
        this.pokemonsStore.setPage(page);
        this.pokemonsStore.setSearch(search);
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