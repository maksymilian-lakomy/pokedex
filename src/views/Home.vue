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

import { PokemonsSpeciesService, PokemonSpritesService, PokemonsFilterService } from '@/services';
import { Pokemon, PokemonsReferencePage } from '@/models';

import { PokemonsWithSprites } from '@/components/pokemon-tile.models';
import PokemonTileComponent from '@/components/pokemon-tile.component.vue';
import { PokemonsService } from '@/services/pokemons.service';

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
      const pokemonService = new PokemonsService(50);
      pokemonService.addFilter(PokemonsFilterService.FilterType.COLORS, 'yellow');
      pokemonService.addFilter(PokemonsFilterService.FilterType.SHAPES, 'wings');
      const page = await pokemonService.getPokemons(1);
      console.log(page);

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
  grid-template-columns: repeat(7, 1fr);
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
