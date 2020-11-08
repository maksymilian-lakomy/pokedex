<template>
  <div class="home">
    <div class="home__filters-column">
      <v-filters
        :filters="filters"
        :value="activeFilters"
        @input="onFiltersChange"
      ></v-filters>
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
import { FiltersReferencePage, Pokemon, PokemonsReferencePage } from '@/models';
import { PokemonsManager, FiltersManager } from '@/classes';

import PaginationComponent from '@/components/pagination.component.vue';
import FiltersComponent from '@/components/filters.component.vue';
import PokemonTileComponent from '@/components/pokemon-tile.component.vue';

import { Location } from 'vue-router';
import { getFiltersFromRouteQueries } from '@/helpers';

/* eslint-disable prefer-const */
let pokemonsReferencePage: PokemonsReferencePage.PokemonExtendedReferenceModel[] = [];
let filters = new Map<string, string[]>();

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
      filters: filters,
      activeFilters: filters,
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
      const searchText: string =
        (to.query.s instanceof Array ? to.query.s[0] : to.query.s) || '';
      const pokemonService = new PokemonsManager(50);
      pokemonService.setFilters(queries, searchText);

      const page = await pokemonService.getPokemons(currentPage);

      const filtersManager = new FiltersManager();
      const filters = await filtersManager.getFilters();

      next((vm) => {
        vm.$set(vm.$data, 'pokemonsReferencePage', page);
        vm.$set(vm.$data, 'currentPage', currentPage);
        vm.$set(vm.$data, 'pagesAmount', pokemonService.pagesAmount);
        vm.$set(vm.$data, 'filters', filters);
        vm.$set(vm.$data, 'activeFilters', queries);
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
      const searchText: string =
        (to.query.s instanceof Array ? to.query.s[0] : to.query.s) || '';
      const pokemonService = new PokemonsManager(50);
      pokemonService.setFilters(queries, searchText);

      const page = await pokemonService.getPokemons(currentPage);

      this.$set(this.$data, 'pokemonsReferencePage', page);
      this.$set(this.$data, 'currentPage', currentPage);
      this.$set(this.$data, 'pagesAmount', pokemonService.pagesAmount);
      this.$set(this.$data, 'activeFilters', queries);

      next();
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    onFiltersChange(filters: Map<string, string[]>) {
      let queryWithoutFilters: Record<string, (string | null)[]> = {};
      Object.assign(queryWithoutFilters, this.$route.query);

      FiltersReferencePage.availableFilters.forEach((filterName) => {
        delete queryWithoutFilters[filterName];
      });

      filters.forEach((_filters, filterName) => {
        queryWithoutFilters[filterName] = _filters;
      });

      this.$router.push({
        ...this.$route,
        name: this.$route.name!,
        query: { ...queryWithoutFilters, p: '1' },
      });
    },
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
