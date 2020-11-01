<template>
  <figure class="pokemon-tile">
    <div
      class="pokemon-tile__sprite-wrapper"
      :style="{ 'font-size': maxWidth }"
    >
      <span class="pokemon-tile__id" :style="{ 'font-size': fontSize }">{{
        id
      }}</span>
      <img :src="pokemon.sprites.front_default" class="pokemon-tile__sprite" />
    </div>
    <figcaption class="pokemon-tile__name">{{ pokemon.name }}</figcaption>
  </figure>
</template>

<script lang="ts">
import Vue from 'vue';

import { getPokemonIdFromUrl, calculatePokemonSpriteWidth } from '@/helpers';

import { PokemonsWithSprites } from './pokemon-tile.models';

export default Vue.extend({
  data() {
    return {
      maxWidth: '1rem',
    };
  },
  props: {
    pokemonWithSprites: {
      required: true,
      type: Object,
    },
  },
  mounted(): void {
    this.calculateMaxWidth();
    addEventListener('resize', this.calculateMaxWidth.bind(this));
  },
  methods: {
    calculateMaxWidth(): void {
      this.maxWidth = `${calculatePokemonSpriteWidth(this.$el, 96) / 16}rem`;
    },
  },
  beforeDestroy(): void {
    removeEventListener('resize', this.calculateMaxWidth);
  },
  computed: {
    pokemon(): PokemonsWithSprites {
      return this.pokemonWithSprites;
    },
    id(): string {
      return getPokemonIdFromUrl(this.pokemon.url);
    },
    fontSize(): string {
      return `${2 / Math.max(this.id.length, 2)}em`;
    },
  },
});
</script>

<style lang="scss" scoped>
.pokemon-tile {
  $block-name: &;

  padding: 0;
  margin: 0;

  &__sprite-wrapper {
    position: relative;
    background-color: #e9e9e9;
    border-radius: 1rem;

    &::after {
      content: '';
      display: block;
      padding-bottom: 100%;
    }
  }

  &__id {
    transition: opacity ease-out 0.1s;
    font-size: 1em;
    position: absolute;
    color: #707070;
    left: 50%;
    top: 0%;
    opacity: 0.25;
    transform: translate(-50%, 0);
    line-height: 1;
    font-weight: bold;
  }

  &__sprite {
    transition: opacity ease-out 0.1s, padding ease-out 0.1s;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.75;
    width: 1em;
    height: 1em;
    image-rendering: pixelated;
  }

  &__name {
    color: #707070;
    margin: 0.5rem 1rem;
    font-weight: bold;
    display: block;
    text-align: left;
    font-size: 1.25rem;

    &::first-letter {
      text-transform: uppercase;
    }
  }

  &:hover {
    cursor: pointer;

    #{$block-name}__id {
      opacity: 0.5;
    }

    #{$block-name}__sprite {
      opacity: 1;
      padding-bottom: 0.5rem;
    }
  }
}
</style>
