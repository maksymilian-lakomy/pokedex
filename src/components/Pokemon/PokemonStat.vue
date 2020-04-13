<template>
    <div class="pokemon-stat">
        <div class="pokemon-stat__name">{{statFromDictionary.name}}</div>
        <div class="pokemon-stat__base">{{stat.base}}</div>
        <div class="pokemon-stat__bar">
            <div class="pokemon-stat__bar__fillment" :style="{'width': fill, 'background-color': statFromDictionary.color}" />
        </div>
    </div>
</template>

<style lang="sass" scoped>

</style>

<script lang="ts">
import { StringFilters } from "@/mixins/StringFilters";
import Component from "vue-class-component";
import { Stat } from "@/classes/PokemonData";
import { statsDictionary } from "@/enums/Stats";
import { Prop, Mixins } from "vue-property-decorator";

@Component
export default class PokemonStat extends Mixins(StringFilters) {
    @Prop(Object)
    readonly stat!: Stat;

    @Prop(Number)
    readonly max!: number;

    get fill(): string {
        return `${(this.stat.base / this.max) * 100}%`;
    }

    get statFromDictionary() {
        return statsDictionary[this.stat.stat.name];
    }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"
.pokemon-stat
    display: flex
    align-items: center
    &__name
        font-size: .8em
        font-weight: bolder
        margin-right: 1em
        width: 20%
    &__base
        font-weight: bolder
        margin-right: 1em
        width: 10%
        text-align: right
    &__bar
        border-radius: .125em
        background-color: $light-gray
        height: .25em
        width: 100%
        &__fillment
            border-radius: inherit
            transition-duration: .2s
            height: inherit
            background-color: $dark-gray
</style>