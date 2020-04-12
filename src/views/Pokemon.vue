<template>
    <div></div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import pokemonSpeciesService from "../services/pokemonSpeciesService";
import { Route, Next } from "vue-router";
import PokemonSpeciesData from "@/classes/PokemonSpeciesData";

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate"]);

@Component
export default class Pokemon extends Vue {
    async beforeRouteEnter(to: Route, from: Route, next: Next<Pokemon>) {
        const pokemonSpecies = await pokemonSpeciesService.get({ pokemon: to.params.speciesName, full: true });
        next(vm => vm.setData(pokemonSpecies));
    }

    setData(pokemonSpeciesData: PokemonSpeciesData) {
        this.pokemonSpeciesData = pokemonSpeciesData;
        this.isLoading = false;
    }

    pokemonSpeciesData: PokemonSpeciesData | null = null;
    isLoading = true;
}
</script>

<style lang="sass" scoped>

</style>