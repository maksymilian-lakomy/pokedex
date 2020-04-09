<template>
    <div class="pokemon-list">
        <!-- <v-observer v-if="pokemonSpecies.length > 0" @intersection="loadPreviousPokemons" style="top: 0" /> -->
        <v-pokemon-card
            v-for="pokemon in pokemonSpecies"
            :key="pokemon.id"
            :pokemonSpecies="pokemon"
            :variety="0"
        />
        <!-- <div v-show="load">Wczytywanie</div> -->
        <!-- <v-observer
            v-if="pokemonSpecies.length > 0"
            @intersection="loadNextPokemons"
            style="bottom: 0"
        /> -->
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import pokemonSpeciesService from "@/services/pokemonSpeciesService";
import PokemonSpeciesData from "@/classes/PokemonSpeciesData";

import PokemonCard from "@/components/PokemonCard.vue";

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

    async mounted() {
        this.loadNextPokemons();
    }

    async loadNextPokemons() {
        // if (this.page.loading) return;
        const startPosition = this.$props.offset + this.pokemonSpecies.length;
        this.loadPage(startPosition, this.$props.limit);
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
        this.loadPage(this.$props.offset, limit);
    }

    async loadPage(startPosition: number, limit: number) {
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
        this.pokemonSpecies = [...this.pokemonSpecies, ...newPokemons];
        // this.page.loading = false;
    }
}
</script>

<style lang="sass" scoped>
.pokemon-list
    position: relative
    justify-content: center
    display: grid
    grid-template-columns: repeat(5, 198px)
    column-gap: 2em
    row-gap: 1.25em
</style>