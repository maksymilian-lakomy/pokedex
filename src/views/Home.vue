<template>
  <div class="home">
    <ol class="pokemons-list">
      <li v-for="(pokemon, i) in pokemonsReferencePage" :key="i">
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

import { PokemonsWithSprites } from '@/components/pokemon-tile.models';
import PokemonTileComponent from '@/components/pokemon-tile.component.vue';
import { PokemonsManager } from '@/classes/pokemons-manager.class';

/* eslint-disable prefer-const */
let pokemonsReferencePage: PokemonsReferencePage.PokemonsReferencePageModel | null = null;

export default Vue.extend({
  components: {
    'v-pokemon-tile': PokemonTileComponent,
  },
  data() {
    return {
      pokemonsReferencePage: pokemonsReferencePage,
      limit: 50,
    };
  },

  async beforeRouteEnter(to, from, next) {
    try {
      const pokemonService = new PokemonsManager(50);
      pokemonService.addFilter(PokemonsFilterService.FilterType.COLORS, 'yellow');
      const page = await pokemonService.getPokemons(2);

      next((vm) => {
        vm.$set(vm.$data, 'pokemonsReferencePage', page);
      });
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
