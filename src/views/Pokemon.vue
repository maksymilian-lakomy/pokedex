<template>
    <div class="pokemon-overview">
        <div class="pokemon-overview__left" v-if="currentVariety">
            <v-pokemon-main :pokemonData="currentVariety" :filterPortrait="filterPortrait" />
            <v-pokemon-tags-list :pokemonData="currentVariety" />
            <v-pokemon-data-description :pokemonSpeciesData="currentEvolution" />
            <v-pokemon-abilities-list :pokemonData="currentVariety" />
        </div>
        <div class="pokemon-overview__center" v-if="currentVariety">
            <h1>Overview</h1>
            <v-pokemon-stats-list :pokemonData="currentVariety" />
            <v-pokemon-moves-list :pokemonData="currentVariety" />
        </div>
        <div class="pokemon-overview__right" v-if="currentEvolution">
            <v-pokemon-evolutions
                :chain="currentChain"
                :index="currentIndex"
                :varietyIndex="varietyIndex"
            />
            <v-pokemon-variaties-list
                :varieties="currentEvolution.varieties"
                :currentVarietyIndex="varietyIndex"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Component from "vue-class-component";

import { Route, Next } from "vue-router";

import pokemonEvolutionChainService from "@/services/pokemonEvolutionChainService";
import EvolutionData from "@/classes/EvolutionData";
import PokemonSpeciesData from "@/classes/PokemonSpeciesData";

import { StringFilters } from "@/mixins/StringFilters";
import { Mixins } from "vue-property-decorator";
import { parseQuery } from "@/mixins/parseQuery";

import { MetaInfo } from "vue-meta";

import PokemonMain from "@/components/Pokemon/PokemonMain.vue";
import PokemonEvolutions from "@/components/Pokemon/PokemonEvolutions.vue";
import PokemonDataDescription from "@/components/Pokemon/PokemonDataDescription.vue";
import PokemonAbilitiesList from "@/components/Pokemon/PokemonAbilitiesList.vue";
import PokemonStatsList from "@/components/Pokemon/PokemonStatsList.vue";
import PokemonMovesList from "@/components/Pokemon/PokemonMovesList.vue";
import PokemonVarietiesList from "@/components/Pokemon/PokemonVarietiesList.vue";
import PokemonTagsList from "@/components/Pokemon/PokemonTagsList.vue";
import PokemonData from "@/classes/PokemonData";

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate"]);

@Component<Pokemon>({
    components: {
        "v-pokemon-main": PokemonMain,
        "v-pokemon-data-description": PokemonDataDescription,
        "v-pokemon-abilities-list": PokemonAbilitiesList,
        "v-pokemon-stats-list": PokemonStatsList,
        "v-pokemon-moves-list": PokemonMovesList,
        "v-pokemon-evolutions": PokemonEvolutions,
        "v-pokemon-variaties-list": PokemonVarietiesList,
        "v-pokemon-tags-list": PokemonTagsList
    },
    metaInfo(): MetaInfo {
        return {
            title: this.name
        };
    }
})
export default class Pokemon extends Mixins(StringFilters) {
    async beforeRouteEnter(to: Route, from: Route, next: Next<Pokemon>) {
        let evolutionData = await pokemonEvolutionChainService.getEvolutionData(
            { evolutionChainId: to.params.evolution }
        );
        evolutionData = await pokemonEvolutionChainService.getSpeciesFromEvolutionChain(
            evolutionData
        );
        next(vm => {
            vm.evolutionData = evolutionData;
            vm.getPokemonSpecies(
                +to.params.speciesId,
                evolutionData
            ).forEach((pokemonSpecies, i) =>
                vm.$set(vm.currentChain, i, pokemonSpecies)
            );
            vm.setCurrentIndex(+to.params.speciesId);
            window.scrollTo(0, 0);
        });
    }

    beforeRouteUpdate(to: Route, from: Route, next: Next<Pokemon>) {
        this.currentChain = [];
        if (this.evolutionData)
            this.getPokemonSpecies(
                +to.params.speciesId,
                this.evolutionData
            ).forEach((pokemonSpecies, i) => {
                this.$set(this.currentChain, i, pokemonSpecies);
            });
        this.setCurrentIndex(+to.params.speciesId);
        window.scrollTo(0, 0);
        next();
    }

    evolutionData: EvolutionData | null = null;
    currentChain = new Array<PokemonSpeciesData>();
    currentIndex = 0;

    get varietyIndex(): number {
        const query = parseQuery(this.$route.query);
        if (!query.v) return 0;
        return +query.v;
    }

    // --------------------------
    // Meta
    // --------------------------
    get name() {
        return this.currentVariety?.name.replace(
            /\w\S*/g,
            string =>
                string.charAt(0).toUpperCase() + string.substr(1).toLowerCase()
        ).replace('-', ' ');
    }

    // --------------------------
    // Pokemon Species Portraits
    // --------------------------
    setCurrentIndex(speciesId: number) {
        this.currentIndex = this.currentChain.findIndex(
            pokemonSpecies => pokemonSpecies.id === +speciesId
        );
    }

    get currentEvolution(): PokemonSpeciesData | undefined {
        return this.currentChain[this.currentIndex];
    }

    get currentVariety(): PokemonData | undefined {
        if (this.currentEvolution)
            return this.getPokemonVariation(
                this.currentEvolution,
                this.varietyIndex
            );
        return undefined;
    }

    getPokemonVariation(pokemonSpecies: PokemonSpeciesData, index: number) {
        return pokemonSpecies.varieties[index].pokemonFull;
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
                if (tree.length !== 0 && evolutionData.speciesData) {
                    tree = [evolutionData.speciesData, ...tree];
                    return tree;
                }
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

    get filterPortrait() {
        if (!this.currentEvolution) return false;
        return (
            ["generation-vii", "generation-viii"].indexOf(
                this.currentEvolution?.generation.name
            ) !== -1
        );
    }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"

.pokemon-overview
    display: grid
    grid-template-columns: repeat(3, calc(33.33% - 4em / 3))
    grid-template-areas: "description overview varieties"
    column-gap: 2em
    color: $dark-gray
    @media (max-width: 1640px)
        grid-template-columns: min-content 1fr min-content
    @media (max-width: 1140px)
        grid-template-columns: repeat(2, calc(50% - 2em / 2))
        grid-template-areas: "description overview" "varieties varieties"
    @media (max-width: 768px)
        grid-template-columns: repeat(1, 100%)      
        grid-template-areas: "description" "overview" "varieties"

    &__left
        grid-area: description
        margin-top: 1.6em

    &__center
        grid-area: overview

    &__right
        grid-area: varieties
</style>