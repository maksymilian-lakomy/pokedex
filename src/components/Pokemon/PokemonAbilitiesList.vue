<template>
    <section class="pokemon-overview-abilities">
        <h3>Abilities</h3>
        <ul class="pokemon-overview-abilities__list">
            <li
                class="pokemon-overview-abilities__list__element"
                v-for="ability of pokemonData.abilities"
                :key="ability.name"
            >{{ability.name | name}}</li>
        </ul>
    </section>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Mixins, Prop } from "vue-property-decorator";
import { StringFilters } from "@/mixins/StringFilters";
import PokemonData from "@/classes/PokemonData";

@Component
export default class PokemonAbilitiesList extends Mixins(StringFilters) {
    @Prop(PokemonData)
    readonly pokemonData!: PokemonData;
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"

.pokemon-overview-abilities
    &__list
        margin: 0
        padding: 0
        &__element
            margin-bottom: .75em
            margin-right: .75em
            padding: .25em 1em
            border-radius: 1em
            background-color: $light-gray
            list-style: none
            display: inline-block
</style>