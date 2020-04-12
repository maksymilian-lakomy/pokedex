<template>
    <div class="pokemon-list">
        <div class="pokemon-list__loading" v-show="allFlagsFalse" />
        <div v-if="!allFlagsFalse && (pokemonSpecies.length === 0 )">No pokemons found.</div>
        <ol class="pokemon-list__listing" v-else>
            <v-pokemon-card
                @click="$emit('click-card', $event)"
                class="pokemon-list__listing__card"
                v-for="pokemon in pokemonSpeciesSorted"
                :key="pokemon.id"
                :pokemonSpecies="pokemon"
                :variety="0"
            />
        </ol>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch, Prop } from "vue-property-decorator";

import pokemonSpeciesService from "@/services/pokemonSpeciesService";
import PokemonSpeciesData from "@/classes/PokemonSpeciesData";

import PokemonCard from "@/components/PokemonCard.vue";

import { EventBus } from "@/events/EventBus";

@Component({
    components: {
        "v-pokemon-card": PokemonCard
    }
})
export default class PokemonList extends Vue {
    @Prop(Array)
    readonly pokemonSpeciesList!: Array<string>;

    @Prop(Number)
    readonly limit!: number;

    @Prop(Number)
    readonly offset!: number;

    pokemonSpecies = new Array<PokemonSpeciesData>();
    flags = {
        loadingSpeciesList: false,
        loadingSpecies: false
    };

    get pokemonSpeciesSorted() {
        return this.pokemonSpecies.sort(
            (a: PokemonSpeciesData, b: PokemonSpeciesData) => a.id - b.id
        );
    }

    get allFlagsFalse() {
        return this.flags.loadingSpeciesList || this.flags.loadingSpecies;
    }

    async created() {
        EventBus.$on(
            "loading-species-list",
            (event: boolean) => (this.flags.loadingSpeciesList = event)
        );
        EventBus.$on(
            "loading-species",
            (event: boolean) => (this.flags.loadingSpecies = event)
        );
        this.pokemonSpecies = await this.loadPage(
            this.offset,
            this.limit
        );
    }

    @Watch("offset")
    async onPageChange() {
        this.pokemonSpecies = await this.loadPage(this.offset, this.limit);
    }

    @Watch("pokemonSpeciesList")
    async onPokemonSpeciesListChange() {
        this.pokemonSpecies = await this.loadPage(
            this.$props.offset,
            this.$props.limit
        );
    }

    async loadPage(startPosition: number, limit: number) {
        EventBus.$emit("loading-species", true);
        const newPokemons = new Array<PokemonSpeciesData>();
        const condition = (i: number) =>
            i < startPosition + limit &&
            i < this.pokemonSpeciesList.length;
        for (let i = startPosition; condition(i); i++) {
            newPokemons.push(
                await pokemonSpeciesService.getByUrl(
                    {url: this.$props.pokemonSpeciesList[i]}
                )
            );
        }
        EventBus.$emit("loading-species", false);
        return newPokemons;
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