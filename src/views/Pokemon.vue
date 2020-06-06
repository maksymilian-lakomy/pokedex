<template>
    <v-layout-main>
        <div class="pokemon-overview" v-if="currentVariety">
            <div class="pokemon-overview__left">
                <v-pokemon-portrait :pokemonData="currentVariety" :generation="generation" />
                <v-pokemon-tags-list :pokemonData="currentVariety" />
                <v-pokemon-data-description :pokemonSpeciesData="currentSpecies" />
                <v-pokemon-abilities-list :pokemonData="currentVariety" />
            </div>
            <div class="pokemon-overview__center">
                <h1>Overview</h1>
                <v-pokemon-stats-list :pokemonData="currentVariety" />
                <v-pokemon-moves-list :pokemonData="currentVariety" />
            </div>
            <div class="pokemon-overview__right" v-if="currentSpecies">
                <v-pokemon-evolutions
                    :chain="evolutionData"
                    :name="currentName"
                    :variation="variety"
                />
                <v-pokemon-variaties-list
                    :varieties="currentSpecies.varieties"
                    :currentVarietyIndex="variety"
                />
            </div>
        </div>
    </v-layout-main>
</template>

<script lang="ts">
import Component from 'vue-class-component';

import { Route, Next } from 'vue-router';

import pokemonEvolutionChainService from '@/services/pokemonEvolutionChainService';
import EvolutionData from '@/classes/EvolutionData';
import PokemonSpeciesData from '@/classes/PokemonSpeciesData';

import { StringFilters } from '@/mixins/StringFilters';
import { Mixins } from 'vue-property-decorator';
import { parseQuery } from '@/mixins/parseQuery';

import { MetaInfo } from 'vue-meta';

import PokemonPortrait from '@/components/Views/PokemonPortrait.vue';
import PokemonEvolutions from '@/components/Views/Pokemon/PokemonEvolutions.vue';
import PokemonDataDescription from '@/components/Views/Pokemon/PokemonDataDescription.vue';
import PokemonAbilitiesList from '@/components/Views/Pokemon/PokemonAbilitiesList.vue';
import PokemonStatsList from '@/components/Views/Pokemon/PokemonStatsList.vue';
import PokemonMovesList from '@/components/Views/Pokemon/PokemonMovesList.vue';
import PokemonVarietiesList from '@/components/Views/Pokemon/PokemonVarietiesList.vue';
import PokemonTagsList from '@/components/Views/PokemonTagsList.vue';
import PokemonData from '@/classes/PokemonData';

import Main from '@/Layouts/Main.vue';

Component.registerHooks(['beforeRouteEnter', 'beforeRouteUpdate']);

@Component<Pokemon>({
    components: {
        'v-layout-main': Main,
        'v-pokemon-portrait': PokemonPortrait,
        'v-pokemon-data-description': PokemonDataDescription,
        'v-pokemon-abilities-list': PokemonAbilitiesList,
        'v-pokemon-stats-list': PokemonStatsList,
        'v-pokemon-moves-list': PokemonMovesList,
        'v-pokemon-evolutions': PokemonEvolutions,
        'v-pokemon-variaties-list': PokemonVarietiesList,
        'v-pokemon-tags-list': PokemonTagsList
    },
    metaInfo(): MetaInfo {
        return {
            title: this.currentVarietyName,
            meta: [
                {
                    name: "Description",
                    content: this.description
                }
            ]
        }
    }
})
export default class Pokemon extends Mixins(StringFilters) {
    evolutionData: Record<string, EvolutionData> | null = null;

    async beforeRouteEnter(to: Route, from: Route, next: Next<Pokemon>) {
        try {
            const evolutionData = await pokemonEvolutionChainService.getEvolutionData(
                { evolutionChainId: to.params.evolution }
            );
            await pokemonEvolutionChainService.getSpeciesFromEvolutionChain(
                evolutionData
            );
            next(vm => {
                window.scrollTo(0, 0);
                vm.evolutionData = evolutionData;
            });
        } catch (e) {
            console.error(e);
        }
    }

    get description(): string {
        if (this.currentSpecies)
            return this.currentSpecies.flavorTextEntries[0].text;
        return '';
    }

    get currentVarietyName(): string {
        if (this.currentVariety)
            return this.currentVariety.name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        return 'Loading...';
    }

    get currentVariety(): PokemonData | null {
        if (this.currentSpecies === null) return null;
        return this.currentSpecies.varieties[this.variety].pokemonFull!;
    }

    get currentName(): string | null {
        if (this.evolutionData === null) return null;
        return Object.values(this.evolutionData).find(
            evolutionData =>
                evolutionData.speciesData!.id ===
                parseInt(this.$route.params.speciesId)
        )!.name;
    }

    get currentSpecies(): PokemonSpeciesData | null {
        if (this.evolutionData === null || this.currentName === null)
            return null;
        return this.evolutionData[this.currentName].speciesData!;
    }

    get variety(): number {
        const queries = parseQuery(this.$route.query);
        return queries['v'] ? parseInt(queries['v'][0]) : 0;
    }

    get generation(): string {
        return this.currentSpecies!.generation.name;
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