<template>
  <div class="home">
    <div class="home__filters-column">
      <v-filters></v-filters>
    </div>
    <div class="home__content-column">
      <v-pagination :count="pagesAmount" :current="currentPage" />
      <ol class="pokemons-list">
        <li v-for="pokemon in pokemonsReferencePage" :key="pokemon.url">
          <v-pokemon-tile :extendedPokemon="pokemon" />
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {
  PokemonsSpeciesService,
  PokemonSpritesService,
  PokemonsFilterService,
} from '@/services';
import { Pokemon, PokemonsReferencePage } from '@/models';
import { PokemonsManager } from '@/classes/pokemons-manager.class';

import PaginationComponent from '@/components/pagination.component.vue';
import FiltersComponent from '@/components/filters.component.vue';
import PokemonTileComponent from '@/components/pokemon-tile.component.vue';

import { Location } from 'vue-router';
import { getFiltersFromRouteQueries } from '@/helpers';

/* eslint-disable prefer-const */
let pokemonsReferencePage: PokemonsReferencePage.PokemonExtendedReferenceModel[] = [];

export default Vue.extend({
  components: {
    'v-filters': FiltersComponent,
    'v-pagination': PaginationComponent,
    'v-pokemon-tile': PokemonTileComponent,
  },
  data() {
    return {
      pokemonsReferencePage: pokemonsReferencePage,
      currentPage: 1,
      pagesAmount: 1,
    };
  },
  async beforeRouteEnter(to, from, next) {
    const currentPage = +to.query.p;

    // GUARD: Is page query set?
    if (!currentPage && to.name) {
      const location: Location = {
        name: to.name,
        query: {
          p: '1',
        },
      };

      next(location);
    }

    try {
      const queries = getFiltersFromRouteQueries(to);
      const pokemonService = new PokemonsManager(50);
      pokemonService.setFilters(queries);

      const page = await pokemonService.getPokemons(currentPage);

      next((vm) => {
        vm.$set(vm.$data, 'pokemonsReferencePage', page);
        vm.$set(vm.$data, 'currentPage', currentPage);
        vm.$set(vm.$data, 'pagesAmount', pokemonService.pagesAmount);
      });
    } catch (error) {
      console.error(error);
    }
  },

  async beforeRouteUpdate(to, from, next) {
    try {
      // TODO: GUARD: Is page query set?
      const currentPage = +to.query.p;

      const queries = getFiltersFromRouteQueries(to);
      const pokemonService = new PokemonsManager(50);
      pokemonService.setFilters(queries);

      const page = await pokemonService.getPokemons(currentPage);

      this.$set(this.$data, 'pokemonsReferencePage', page);
      this.$set(this.$data, 'currentPage', currentPage);
      this.$set(this.$data, 'pagesAmount', pokemonService.pagesAmount);

      next();
    } catch (error) {
      console.error(error);
    }
  },
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: row;

  &__filters-column {

  }

  &__content-column {

  }
}
.pokemons-list {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  column-gap: 1rem;
  row-gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
