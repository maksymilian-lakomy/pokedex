<template>
    <div>
        <table>
            <tr>
                <td>From</td>
                <td>Current</td>
                <td>To</td>
            </tr>
            <td>
                <tr v-if="previousIndex !== -1">{{currentChain[previousIndex].name}}</tr>
            </td>
            <td>
                <tr v-if="currentIndex !== -1">{{currentChain[currentIndex].name}}</tr>
            </td>
            <td>
                <tr
                    v-for="pokemonSpecies of thirdColumn"
                    :key="pokemonSpecies.id"
                >{{pokemonSpecies.name}}</tr>
            </td>
        </table>
        <button @click="changePage(currentIndex+1)">Next pokemon in evolution</button>
        <button @click="changePage(currentIndex-1)">Previous pokemon in evolution</button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { Route, Next } from "vue-router";

import pokemonEvolutionChainService from "@/services/pokemonEvolutionChainService";
import EvolutionData from "@/classes/EvolutionData";
import PokemonSpeciesData from "../classes/PokemonSpeciesData";

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate"]);

@Component
export default class Pokemon extends Vue {
    async beforeRouteEnter(to: Route, from: Route, next: Next<Pokemon>) {
        let evolutionData = await pokemonEvolutionChainService.getEvolutionData(
            { evolutionChainId: to.params.evolution }
        );
        evolutionData = await pokemonEvolutionChainService.getSpeciesFromEvolutionChain(
            evolutionData
        );
        next(vm => {
            vm.evolutionData = evolutionData;
            vm.currentChain = vm.getPokemonSpecies(
                +to.params.speciesId,
                evolutionData
            );
        });
    }

    async beforeRouteUpdate(to: Route, from: Route, next: Next<Pokemon>) {
        if (this.evolutionData)
            this.currentChain = this.getPokemonSpecies(
                +to.params.speciesId,
                this.evolutionData
            );
        next();
    }

    changePage(index: number) {
        this.$router.push({
            params: {
                speciesId: this.currentChain[index].id.toString()
            }
        });
    }

    evolutionData: EvolutionData | null = null;
    currentChain = new Array<PokemonSpeciesData>();
    isLoading = true;

    get previousIndex() {
        return this.currentChain.findIndex(
            (value, index) => index < this.currentIndex
        );
    }
    get currentIndex() {
        return this.currentChain.findIndex(
            pokemonSpecies =>
                pokemonSpecies.id === +this.$route.params.speciesId
        );
    }

    get thirdColumn() {
        return this.currentChain.slice(
            this.currentIndex + 1,
            this.currentChain.length
        );
    }

    getPokemonSpecies(
        id: number,
        evolutionData: EvolutionData
    ): Array<PokemonSpeciesData> {
        let tree = new Array<PokemonSpeciesData>();
        if (
            evolutionData?.evolvesTo !== undefined &&
            evolutionData.speciesData?.id !== id
        ) {
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
}
</script>

<style lang="sass" scoped>

</style>