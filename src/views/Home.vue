<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {PokemonsSpeciesService, PokemonSpritesService} from "@/services";

export default Vue.extend({
  async beforeRouteEnter(to, from, next) {
    try {
      const response = await PokemonsSpeciesService.getAll();

      console.log(response.data);

      response.data.results.forEach(result => {
        console.log(PokemonSpritesService.getSprites(result.url));
      });

    } catch (error) {
      console.error(error);
    }
  },
});
</script>
