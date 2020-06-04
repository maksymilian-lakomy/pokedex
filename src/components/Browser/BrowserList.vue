<template>
    <ol class="pokemon-list__listing">
        <router-link
            v-for="pokemon in pokemonSpeciesSorted"
            :key="pokemon.id"
            :to="{name: 'Pokemon', params: {
                    evolution: pokemon.evolutionChain,
                    speciesId: pokemon.id
                }}"
        >
            <v-browser-pokemon-card
                class="pokemon-list__listing__card"
                :pokemonSpecies="pokemon"
                :variety="0"
            />
        </router-link>
    </ol>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import PokemonSpeciesData from '@/classes/PokemonSpeciesData';

import BrowserPokemonCard from './BrowserPokemonCard.vue';

@Component({
    components: {
        'v-browser-pokemon-card': BrowserPokemonCard
    }
})
export default class BrowserList extends Vue {
    @Prop({ required: true, type: Array })
    readonly pokemonSpecies!: Array<PokemonSpeciesData>;
    
    get pokemonSpeciesSorted() {
        return this.pokemonSpecies.sort(
            (a: PokemonSpeciesData, b: PokemonSpeciesData) => a.id - b.id
        );
    }
}
</script>

<style lang="sass" scoped>
.pokemon-list__listing
    position: relative
    min-height: 512px
    padding: 0
    display: grid
    grid-template-columns: repeat(6, 198px)
    column-gap: 1.25em
    row-gap: 2em
    justify-content: center
    @media (max-width: 1640px)
        grid-template-columns: repeat(5, 198px)
    @media (max-width: 1440px)
        grid-template-columns: repeat(4, 198px)
    @media (max-width: 1140px)
        grid-template-columns: repeat(3, 198px)
    @media (max-width: 840px)
        grid-template-columns: repeat(2, 198px)
    @media (max-width: 480px)
        grid-template-columns: repeat(1, 288px)
    @media (max-width: 320px)
        grid-template-columns: repeat(1, 198px)

    &__loading
        position: absolute
        width: 100%
        height: 100%
        background-color: #ffffffbb
        z-index: 99999
        &:before
            content: ""
            animation-name: loading-circle
            animation-duration: 1s
            animation-iteration-count: infinite
            animation-timing-function: linear
            position: fixed
            width: 3em
            height: 3em
            top: 50%
            left: calc(50% - 3em / 2)

@keyframes loading-circle
    0% 
        transform: rotate(0deg)

    100%
        transform: rotate(360deg)
</style>