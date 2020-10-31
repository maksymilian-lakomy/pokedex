<template>
  <div class="home">
    <ol class="pokemons-list">
      <li v-for="(pokemon, i) in pokemonsWithSprites" :key="i">
        <v-pokemon-tile :pokemonWithSprites="pokemon" />
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { PokemonsSpeciesService, PokemonSpritesService } from '@/services';
import { Pokemon, PokemonsReferencePage } from '@/models';

import { PokemonsWithSprites } from '@/components/pokemon-tile.models';
import PokemonTileComponent from '@/components/pokemon-tile.component.vue';

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
      const response = await PokemonsSpeciesService.getAll({
        limit: 20,
        offset: 0,
      });

      next((vm) => {
        vm.$set(vm.$data, 'pokemonsReferencePage', response.data);
      });
    } catch (error) {
      console.error(error);
    }
  },

  computed: {
    pokemonsWithSprites(): PokemonsWithSprites[] | [] {
      if (this.pokemonsReferencePage) {
        return this.pokemonsReferencePage.results.map((result) => {
          return {
            ...result,
            sprites: PokemonSpritesService.getSprites(result.url),
          };
        });
      }
      return [];
    },
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
