<template>
    <div></div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { Route, Next } from "vue-router";

import pokemonEvolutionChainService from "@/services/pokemonEvolutionChainService";
import EvolutionData from '@/classes/EvolutionData';
import PokemonSpeciesData from '../classes/PokemonSpeciesData';

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate"]);

@Component
export default class Pokemon extends Vue {
    async beforeRouteEnter(to: Route, from: Route, next: Next<Pokemon>) {
        let evolutionData = await pokemonEvolutionChainService.getEvolutionData({evolutionChainId: to.params.evolution});
        evolutionData = await pokemonEvolutionChainService.getSpeciesFromEvolutionChain(evolutionData);
        next(vm => vm.setData(evolutionData));
    }

    setData(evolutionData: EvolutionData) {
        this.evolutionData = evolutionData;
        console.log(this.getPokemonSpecies(+this.$route.params.speciesId, evolutionData));
    }

    getPokemonSpecies(id: number, evolutionData: EvolutionData): Array<PokemonSpeciesData> {
        let tree = new Array<PokemonSpeciesData>();
        if (evolutionData?.evolvesTo !== undefined && evolutionData.speciesData?.id !== id) {
            for (const _evolutionData of evolutionData.evolvesTo) {
                tree = this.getPokemonSpecies(id, _evolutionData);
                if (tree.length !== 0 && evolutionData.speciesData) 
                    tree = [evolutionData.speciesData, ...tree];
                return tree;
            }
            return tree;
        } else if (evolutionData.speciesData?.id === id) {
            tree.push(evolutionData.speciesData);
            evolutionData.evolvesTo?.reduce((result, evolution) => {
                if (evolution.speciesData) result.push(evolution.speciesData);
                return result;
            }, tree);
            return tree;
        } else {
            return tree;
        }
    }

    evolutionData: EvolutionData | null = null;
    isLoading = true;
}
</script>

<style lang="sass" scoped>

</style>