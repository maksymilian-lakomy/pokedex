<template>
    <button class="pokemon-card__favorite-button" @click="toggleFavorite">
        <svg ref="shape" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="heart" :class="{'heart--fill': isFavorite}">
            <path
                d="M15.2,5c-1.2,0-2.4,0.6-3.1,1.6C11.2,5.6,10.1,5,8.9,5
	C6.7,5,5,6.8,5,9.2c0,2.9,2.4,5.2,6,8.8l1,1l1-1c3.6-3.6,6-5.9,6-8.8C19,6.8,17.3,5,15.2,5z"
            />/>
        </svg>
    </button>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { FavoritesStore } from '@/classes/FavoritesStore';  

import anime from 'animejs';

@Component
export default class PokemonCardFavoriteButton extends Vue {
    @Prop({required: true, type: String})
    readonly name!: string;

    isFavorite = false;

    created() {
        this.isFavorite = FavoritesStore.isFavorite(this.name);   
    }

    toggleFavorite(event: Event) {
        const favoritesStore = new FavoritesStore();
        favoritesStore.setInFavorites(this.name);
        this.isFavorite = FavoritesStore.isFavorite(this.name);
        event.preventDefault();
    }

    current: anime.AnimeInstance | null = null;

    @Watch('isFavorite')
    onActiveChange(value: boolean) {
        const shape = this.$refs.shape as SVGElement;
        if (this.current !== null) this.current.pause();
        this.current = anime({
            targets: [shape],
            keyframes: [
                {
                    scale: 1.5,
                    duration: 300,
                    easing: 'cubicBezier(0.065, 0.925, 0.515, 1)'
                },
                {
                    scale: 1,
                    duration: 500
                }
            ]
        })
    }
}
</script>

<style lang="sass">
@import "@/styles/variables"
.pokemon-card__favorite-button
    display: inline-block
    width: 100%
    height: 100%

.heart
    fill: none
    stroke: $dark-gray
    stroke-width: 2px

.heart--fill
    fill: $dark-gray
    stroke: $dark-gray
</style>