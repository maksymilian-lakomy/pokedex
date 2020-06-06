<template>
    <section>
        <h2>Evolution</h2>
        <div class="pokemon-evolutions-table">
            <div class="pokemon-evolutions-table__previous" v-if="previousEvolution">
                <v-pokemon-evolution-portrait
                    :pokemonData="getPokemonVariation(previousEvolution, 0)"
                    @click="changeEvolution(previousEvolution.id)"
                />
            </div>
            <div class="pokemon-evolutions-table__current" v-if="currentEvolution">
                <v-pokemon-evolution-portrait
                    :pokemonData="getPokemonVariation(currentSpecies, variation)"
                    :isMain="true"
                    @click="changeEvolution(currentSpecies.id)"
                />
            </div>
            <div
                class="pokemon-evolutions-table__next"
                v-if="nextEvolutions && nextEvolutions.length > 0"
            >
                <v-pokemon-evolution-portrait
                    class="pokemon-evolutions-table__portrait"
                    v-for="evolution in nextEvolutions"
                    :key="evolution.id"
                    :pokemonData="getPokemonVariation(evolution, 0)"
                    @click="changeEvolution(evolution.id)"
                />
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import PokemonData from '@/classes/PokemonData';
import PokemonEvolutionPortrait from './PokemonEvolutionPortrait.vue';
import PokemonSpeciesData from '@/classes/PokemonSpeciesData';
import EvolutionData from '@/classes/EvolutionData';

@Component({
    components: {
        'v-pokemon-evolution-portrait': PokemonEvolutionPortrait
    }
})
export default class PokemonEvolutions extends Vue {
    @Prop({ type: Object, required: true })
    readonly chain!: Record<string, EvolutionData>;

    @Prop({ type: String, required: true })
    readonly name!: string;

    @Prop({ type: Number, required: true })
    readonly variation!: number;

    // --------------------------
    // Pokemon Evolutions
    // --------------------------
    get previousEvolution(): PokemonSpeciesData | null {
        if (this.currentEvolution.evolvesFrom === undefined) return null;
        return this.chain[this.currentEvolution.evolvesFrom].speciesData!;
    }

    get currentSpecies(): PokemonSpeciesData {
        return this.currentEvolution.speciesData!;
    }

    get currentEvolution(): EvolutionData {
        return this.chain[this.name];
    }

    get nextEvolutions(): Array<PokemonSpeciesData> {
        return this.currentEvolution.evolvesTo.map(
            name => this.chain[name].speciesData!
        );
    }

    async changeEvolution(id: number) {
        if (+this.$route.params.speciesId === id) return;
        const params = {};
        Object.assign(params, this.$route.params, { speciesId: id.toString() });
        try {
            await this.$router.push({
                name: this.$route.name as string,
                params,
                query: {}
            });
        } catch (e) {
            return;
        }
    }

    getPokemonVariation(pokemonSpecies: PokemonSpeciesData, index: number) {
        if (pokemonSpecies !== undefined)
            return pokemonSpecies.varieties[index].pokemonFull;
        return undefined;
    }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"

@mixin evolution-chain-arrow
    content: ""
    position: absolute
    height: 4px
    border-radius: 2px
    top: calc(50% - 4px / 2)
    z-index: -1
    background-color: $light-gray

.pokemon-evolutions-table
    justify-content: center
    display: grid
    grid-template-columns: repeat(3, 96px)
    grid-template-areas: "previous current next"
    align-items: center
    column-gap: 1em

    &__portrait
        &:nth-child(1n+2)
            margin-top: 1em

    &__previous, &__next
        position: relative

    &__previous
        grid-area: previous
        &::after
            @include evolution-chain-arrow
            left: calc(100% - 1em)
            width: 3em

    &__current
        grid-area: current

    &__next
        grid-area: next
        &::before
            @include evolution-chain-arrow
            right: calc(100% - 1em)
            width: 3em
</style>