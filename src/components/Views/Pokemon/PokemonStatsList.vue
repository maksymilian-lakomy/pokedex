<template>
    <section>
        <h3>Stats</h3>
        <ul class="pokemon-overview__stats-list">
            <li
                class="pokemon-overview__stats-list__element"
                v-for="(stat, i) of stats"
                :key="i"
            >
                <v-pokemon-stat :stat="getStat(stat)" :max="maxStat" />
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import PokemonStat from "./PokemonStat.vue";
import { Prop } from "vue-property-decorator";
import PokemonData from "@/classes/PokemonData";

import {stats} from "@/enums/Stats";

@Component({
    components: {
        "v-pokemon-stat": PokemonStat
    }
})
export default class PokemonStatsList extends Vue {
    @Prop(PokemonData)
    pokemonData!: PokemonData;

    getStat(statKey: string) {
        return this.pokemonData.stats.find(stat => stat.stat.name === statKey);
    }
    
    get maxStat() {
        return this.pokemonData.stats.reduce((previous, current) => (previous.base > current.base) ? previous : current).base;
    }

    get stats() {
        return stats;
    }
}
</script>

<style lang="sass" scoped>
.pokemon-overview__stats-list
    margin: 0
    padding: 0
    &__element
        list-style: none
        margin-bottom: .5em

</style>