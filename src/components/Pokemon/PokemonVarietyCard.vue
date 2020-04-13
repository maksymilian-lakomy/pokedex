<template>
    <div
        class="pokemon-variety-card"
        :class="{'pokemon-variety-card--displayed': displayed}"
        @mouseenter="active = true"
        @mouseleave="active = false"
        @click="$emit('click', $event)"
    >
        <div
            class="pokemon-variety-card__portrait"
            :class="{'pokemon-variety-card__portrait--active': active && !displayed, 'pokemon-variety-card__portrait--displayed': displayed}"
        >
            <img
                class="pokemon-variety-card__portrait__placeholder"
                v-if="!pokemonData.sprites.frontDefault"
                src="@/assets/pokemon-placeholder.png"
            />
            <img v-else :src="pokemonData.sprites.frontDefault" />
        </div>
        <div class="pokemon-variety-card__label">
            <span class="pokemon-variety-card__label__id">{{pokemonData.id | id}}</span>
            <span class="pokemon-variety-card__label__name">{{pokemonData.name | name}}</span>
        </div>
    </div>
</template>

<script lang="ts">
import Component from "vue-class-component";

import { StringFilters } from "@/mixins/StringFilters";
import { Mixins, Prop } from "vue-property-decorator";
import PokemonData from "@/classes/PokemonData";

@Component
export default class PokemonVarietyCard extends Mixins(StringFilters) {
    @Prop(PokemonData)
    pokemonData!: PokemonData;
    @Prop(Boolean)
    displayed!: boolean;

    active = false;
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"
    
.pokemon-variety-card
    width: 100%
    border-radius: 1em
    background-color: $light-gray
    display: flex
    color: $darkest-gray
    image-rendering: pixelated
    font-weight: bolder
    align-items: center
    cursor: pointer
    &__portrait
        padding: .25em 1em
        width: 96px
        height: 96px
        opacity: $portrait-not-active-opacity
        transition-duration: .25s
        &__placeholder
            opacity: $placeholder-opacity
    &__portrait--active
        transform: translateY(-.25em)
        opacity: 1
    &__portrait--displayed
        opacity: 1 !important
    &__label
        &__id
            font-size: .8em
            margin-right: 1em
        &__name
            vertical-align: middle
            font-size: 1.25em
.pokemon-variety-card--displayed
    cursor: default !important
</style>