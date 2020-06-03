<template>
    <div class="home">
        <v-pagination />
        <v-pokemon-list />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { parseQuery } from '@/mixins/parseQuery';

import ThePagination from '@/components/ThePagination.vue';
import PokemonList from '@/components/PokemonList.vue';

import PokemonSpeciesData from '@/classes/PokemonSpeciesData';
import { Route, Next } from 'vue-router';

import { MetaInfo } from 'vue-meta';

import { getModule, PokemonsModule } from '@/store/pokemons/module';

import { filters as availableFilters } from '@/enums/Filters';

Component.registerHooks(['beforeRouteEnter', 'beforeRouteUpdate']);
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
export default class Home extends Vue {
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

    setUpStore(next: Route) {
        // ADD CHECK FOR SAME FILTERS
        const queries = parseQuery(next.query);

        const page = queries['p'] ? parseInt(queries['p'][0]) : 1;
        const search = queries['search'] ? queries['search'][0] : null;
        const filters: Record<string, Array<string>> = {};

        for (const query in queries)
            if (availableFilters.includes(query))
                filters[query] = queries[query];

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