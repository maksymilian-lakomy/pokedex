<template>
    <div class="pokemon-list">
        <div class="pokemon-list__loading" v-show="allFlagsFalse" />
        <ol class="pokemon-list__listing">
            <v-pokemon-card
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
import { Watch } from "vue-property-decorator";

import pokemonSpeciesService from "@/services/pokemonSpeciesService";
import PokemonSpeciesData from "@/classes/PokemonSpeciesData";

import PokemonCard from "@/components/PokemonCard.vue";

import { EventBus } from "@/events/EventBus";

@Component({
    props: {
        pokemonSpeciesList: {
            type: Array,
            required: true
        },
        limit: {
            type: Number,
            required: true
        },
        offset: {
            type: Number,
            required: true
        }
    },
    components: {
        "v-pokemon-card": PokemonCard
    }
})
export default class PokemonList extends Vue {
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
            this.$props.offset,
            this.$props.limit
        );
    }

    @Watch("pokemonSpeciesList")
    async onPokemonSpeciesListChange() {
        this.pokemonSpecies = await this.loadPage(
            this.$props.offset,
            this.$props.limit
        );
    }

    async loadNextPokemons() {
        // if (this.page.loading) return;
        const startPosition = this.$props.offset + this.pokemonSpecies.length;
        this.pokemonSpecies = [
            ...this.pokemonSpecies,
            ...(await this.loadPage(startPosition, this.$props.limit))
        ];
    }

    async loadPreviousPokemons() {
        // if (this.page.loading) return;
        let limit = this.$props.limit;
        const offset = this.$props.offset;
        this.$emit("update:offset", offset - limit);
        if (offset < 0) {
            limit += this.$props.offset;
            this.$emit("update:offset", 0);
        }
        this.pokemonSpecies = [
            ...this.pokemonSpecies,
            ...(await this.loadPage(this.$props.offset, limit))
        ];
    }

    async loadPage(startPosition: number, limit: number) {
        EventBus.$emit("loading-species", true);
        const newPokemons = new Array<PokemonSpeciesData>();
        const condition = (i: number) =>
            i < startPosition + limit &&
            i < this.$props.pokemonSpeciesList.length;
        for (let i = startPosition; condition(i); i++)
            newPokemons.push(
                await pokemonSpeciesService.getByUrl(
                    this.$props.pokemonSpeciesList[i]
                )
            );
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