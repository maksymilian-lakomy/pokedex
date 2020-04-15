<template>
    <div class="pokemon-overview">
        <section class="pokemon-overview__description" v-if="currentVariety">
            <div class="pokemon-overview__description__portrait">
                <img
                    class="pokemon-overview__description__portrait__img--placeholder"
                    src="@/assets/pokemon-placeholder.png"
                    v-if="!currentVariety.sprites.frontDefault"
                />
                <img
                    v-else
                    :src="currentVariety.sprites.frontDefault"
                    :class="{'pokemon-overview__description__portrait__img--filter': filterPortrait}"
                />
            </div>
            <h1>{{currentVariety.id | id}} {{currentVariety.name | name}}</h1>
            <v-pokemon-tags-list :pokemonData="currentVariety" />
            <v-pokemon-data-description :pokemonSpeciesData="currentEvolution" />
            <v-pokemon-abilities-list :pokemonData="currentVariety" />
        </section>
        <section class="pokemon-overview__overview" v-if="currentVariety">
            <h1>Overview</h1>
            <v-pokemon-stats-list :pokemonData="currentVariety" />
            <v-pokemon-moves-list :pokemonData="currentVariety" />
        </section>
        <section class="pokemon-overview__species" v-if="currentEvolution">
            <h1>Evolution</h1>
            <v-pokemon-evolutions
                :chain="currentChain"
                :index="currentIndex"
                :varietyIndex="varietyIndex"
            />
            <h1>Varieties</h1>
            <ol class="pokemon-overview__species__varieties">
                <li
                    class="pokemon-overview__species__varieties__element"
                    v-for="(variety, index) of currentEvolution.varieties"
                    :key="variety.pokemonFull.id"
                >
                    <v-pokemon-variety-card
                        :displayed="index === varietyIndex"
                        @click="changeVariation(index)"
                        :pokemonData="variety.pokemonFull"
                    />
                </li>
            </ol>
        </section>
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

import PokemonEvolutions from "@/components/Pokemon/PokemonEvolutions.vue";

import PokemonDataDescription from "@/components/Pokemon/PokemonDataDescription.vue";
import PokemonAbilitiesList from "@/components/Pokemon/PokemonAbilitiesList.vue";
import PokemonStatsList from "@/components/Pokemon/PokemonStatsList.vue";
import PokemonMovesList from "@/components/Pokemon/PokemonMovesList.vue";
import PokemonVarietyCard from "@/components/Pokemon/PokemonVarietyCard.vue";
import PokemonTagsList from "@/components/Pokemon/PokemonTagsList.vue";
import PokemonData from "@/classes/PokemonData";

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate"]);

@Component({
    components: {
        "v-pokemon-data-description": PokemonDataDescription,
        "v-pokemon-abilities-list": PokemonAbilitiesList,
        "v-pokemon-stats-list": PokemonStatsList,
        "v-pokemon-moves-list": PokemonMovesList,
        "v-pokemon-evolutions": PokemonEvolutions,
        "v-pokemon-variety-card": PokemonVarietyCard,
        "v-pokemon-tags-list": PokemonTagsList
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
    // --------------------------
    // Navigation
    // --------------------------
    changeVariation(variety: number) {
        if (variety === this.varietyIndex) return;
        this.$router.push({
            path: this.$route.path,
            params: this.$route.params,
            query: {
                v: variety.toString()
            }
        });
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
    currentIndex = 0;

    get varietyIndex(): number {
        const query = parseQuery(this.$route.query);
        if (!query.v) return 0;
        return +query.v;
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

    &__description
        grid-area: description
        margin-top: 1.6em

        &__tags
            margin: 0
            padding: 0
            display: inline-block
            &__element
                list-style: none

        &__portrait
            width: 100%
            text-align: center
            background-color: $light-gray
            border-radius: 1em
            image-rendering: pixelated
            img
                width: 288px
            &__img
                &--placeholder
                    opacity: $placeholder-opacity
                &--filter
                    image-rendering: auto

    &__overview
        grid-area: overview

    &__species
        grid-area: varieties
        &__evolutions-table

        &__varieties
            width: 100%
            padding: 0
            margin: 0
            &__element
                list-style: none
                margin-bottom: 1em
</style>