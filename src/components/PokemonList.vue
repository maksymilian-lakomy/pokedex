<template>
    <div class="pokemon-list">
        <v-pokemon-card
            v-for="pokemon in pokemonSpeciesSorted"
            :key="pokemon.id"
            :pokemonSpecies="pokemon"
            :variety="0"
        />
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

    get pokemonSpeciesSorted() {
        return this.pokemonSpecies.sort((a: PokemonSpeciesData, b: PokemonSpeciesData) => a.id - b.id);
    }

    async created() {
        this.pokemonSpecies = await this.loadPage(this.$props.offset, this.$props.limit);
    }   
    
    @Watch('pokemonSpeciesList')
    async onPokemonSpeciesListChange() {
        this.pokemonSpecies = await this.loadPage(this.$props.offset, this.$props.limit);
    }


    async loadNextPokemons() {
        // if (this.page.loading) return;
        const startPosition = this.$props.offset + this.pokemonSpecies.length;
        this.pokemonSpecies = [...this.pokemonSpecies, ...await this.loadPage(startPosition, this.$props.limit)];
    }

    async loadPreviousPokemons() {
        // if (this.page.loading) return;
        let limit = this.$props.limit;
        const offset = this.$props.offset;
        this.$emit('update:offset', offset - limit);
        if (offset < 0) {
            limit += this.$props.offset;
            this.$emit('update:offset', 0);
        }
        this.pokemonSpecies = [...this.pokemonSpecies, ...await this.loadPage(this.$props.offset, limit)];
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
    display: grid
    grid-template-columns: repeat(5, 198px)
    column-gap: 2em
    row-gap: 1.25em
</style>