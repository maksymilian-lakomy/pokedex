<template>
    <section class ="pokemon-overview-varieties">
        <h1>Varieties</h1>
        <ol class="pokemon-overview-varieties__list">
            <li
                class="pokemon-overview-varieties__list__element"
                v-for="(variety, index) of varieties"
                :key="variety.pokemonFull.id"
            >
                <v-pokemon-variety-card
                    :displayed="index === currentVarietyIndex"
                    @click="changeVariation(index)"
                    :pokemonData="variety.pokemonFull"
                    :stats="index !== currentVarietyIndex ? calculateStats(variety.pokemonFull) : undefined"
                />
            </li>
        </ol>
    </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import PokemonData from "@/classes/PokemonData";
import PokemonVarietyCard from "./PokemonVarietyCard.vue";

@Component({
    components: {
        "v-pokemon-variety-card": PokemonVarietyCard
    }
})
export default class PokemonVarietiesList extends Vue {
    @Prop(Array)
    readonly varieties!: Array<{pokemonFull: PokemonData}>;

    @Prop(Number)
    readonly currentVarietyIndex!: number;

    changeVariation(variety: number) {
        if (variety === this.currentVarietyIndex) return;
        this.$router.push({
            path: this.$route.path,
            params: this.$route.params,
            query: {
                v: variety.toString()
            }
        });
    }
    
    calculateStats(variety: PokemonData) {
        const stats: Record<string, number> = {};
        variety.stats.forEach(stat => {
            Object.assign(stats, {[stat.stat.name]: stat.base});
        });
        this.varieties[this.currentVarietyIndex].pokemonFull.stats.forEach(stat => {
            stats[stat.stat.name] -= stat.base;
            if (stats[stat.stat.name] === 0)
                delete(stats[stat.stat.name]);
        });
        return stats;
    }
}
</script>

<style lang="sass" scoped>
.pokemon-overview-varieties
    &__list
        width: 100%
        padding: 0
        margin: 0
        &__element
            list-style: none
            margin-bottom: 1em
</style>