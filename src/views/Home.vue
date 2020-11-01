<template>
  <div class="home">
    <v-pagination :count="45" :current="currentPage" />
    <ol class="pokemons-list">
      <li v-for="pokemon in pokemonsReferencePage" :key="pokemon.url">
        <v-pokemon-tile :pokemonWithSprites="pokemon" />
      </li>
    </ol>
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

import PaginationComponent from '@/components/pagination.component.vue';

import { PokemonsWithSprites } from '@/components/pokemon-tile.models';
import PokemonTileComponent from '@/components/pokemon-tile.component.vue';

import { PokemonsManager } from '@/classes/pokemons-manager.class';

/* eslint-disable prefer-const */
let pokemonsReferencePage: PokemonsWithSprites[] = [];

export default Vue.extend({
  components: {
    'v-pagination': PaginationComponent,
    'v-pokemon-tile': PokemonTileComponent,
  },
  data() {
    return {
      pokemonsReferencePage: pokemonsReferencePage,
      currentPage: 1,
    };
  },
  async beforeRouteEnter(to, from, next) {
    try {
      const currentPage = +to.query.p || 1;

      const pokemonService = new PokemonsManager(50);
      const page = await pokemonService.getPokemons(currentPage);

      next((vm) => {
        vm.$set(vm.$data, 'pokemonsReferencePage', page);
        vm.$set(vm.$data, 'currentPage', currentPage);
      });
    } catch (error) {
      console.error(error);
    }
  },
  async beforeRouteUpdate(to, from, next) {
    try {
      const currentPage = +to.query.p;

      const pokemonService = new PokemonsManager(50);
      const page = await pokemonService.getPokemons(currentPage);

      this.$set(this.$data, 'pokemonsReferencePage', page);
      this.$set(this.$data, 'currentPage', currentPage);
      
      next();
    } catch (error) {
      console.error(error);
    }
  },
});
</script>

<style lang="scss" scoped>
.pokemons-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 1rem;
  row-gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
