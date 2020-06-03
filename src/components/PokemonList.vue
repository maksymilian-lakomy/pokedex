<template>
    <div class="pokemon-list">
        <!-- <div class="pokemon-list__loading" v-if="loading" /> -->
        <div v-if="pokemonSpecies.length === 0">No pokemons found.</div>
        <ol class="pokemon-list__listing" v-else>
            <router-link
                v-for="pokemon in pokemonSpeciesSorted"
                :key="pokemon.id"
                :to="{name: 'Pokemon', params: {
                    evolution: pokemon.evolutionChain,
                    speciesId: pokemon.id
                }}"
            >
                <v-pokemon-card
                    class="pokemon-list__listing__card"
                    :pokemonSpecies="pokemon"
                    :variety="0"
                />
            </router-link>
        </ol>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import pokemonSpeciesService from '@/services/pokemonSpeciesService';
import PokemonSpeciesData from '@/classes/PokemonSpeciesData';

import PokemonCard from '@/components/PokemonCard.vue';

import { getModule, PokemonsModule } from '@/store/pokemons/module';

@Component({
    components: {
        'v-pokemon-card': PokemonCard
    }
})
export default class PokemonList extends Vue {
    readonly pokemonsStore = getModule(PokemonsModule, this.$store);

    get pokemonSpeciesList(): Array<string> {
        return this.pokemonsStore.pokemonsUrls;
    }

    @Watch('pokemonSpeciesList')
    async onPokemonSpeciesListChange(array: Array<string>) {
        this.pokemonSpecies = await Promise.all(
            array.map(url => pokemonSpeciesService.getByUrl({ url }))
        );
    }

    pokemonSpecies = new Array<PokemonSpeciesData>();

    get pokemonSpeciesSorted() {
        return this.pokemonSpecies.sort(
            (a: PokemonSpeciesData, b: PokemonSpeciesData) => a.id - b.id
        );
    }
}
</script>

<style lang="sass" scoped>
.pokemon-list
    position: relative
    
    &__listing
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
            background-image: url("../assets/loading-circle.png")
            left: calc(50% - 3em / 2)

@keyframes loading-circle
    0% 
        transform: rotate(0deg)

    100%
        transform: rotate(360deg)
</style>