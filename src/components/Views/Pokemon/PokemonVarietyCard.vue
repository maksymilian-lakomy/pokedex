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
                v-show="!pokemonData.sprites.frontDefault || loading"
                src="@/assets/pokemon-placeholder.png"
            />
            <img v-show="!loading" @load="onLoaded()" :src="pokemonData.sprites.frontDefault" />
        </div>
        <div class="pokemon-variety-card__label">
            <span class="pokemon-variety-card__label__id">{{pokemonData.id | id}}</span>
            <span class="pokemon-variety-card__label__name">{{pokemonData.name | name}}</span>
            <ul class="pokemon-variety-card__label__stats-changes" v-if="stats">
                <li
                    class="pokemon-variety-card__label__stats-changes__element"
                    :class="`pokemon-variety-card__label__stats-changes__element--${stat > 0 ? 'better' : 'worse'}`"
                    v-for="(stat, key) in stats"
                    :key="key"
                >
                    {{statsDictionary[key].name}}
                    {{stat > 0 ? '+' : '-'}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import Component from "vue-class-component";

import { StringFilters } from "@/mixins/StringFilters";
import { Mixins, Prop } from "vue-property-decorator";
import PokemonData from "@/classes/PokemonData";

import { statsDictionary } from "@/enums/Stats";

@Component
export default class PokemonVarietyCard extends Mixins(StringFilters) {
    @Prop(PokemonData)
    readonly pokemonData!: PokemonData;
    @Prop(Boolean)
    readonly displayed!: boolean;
    @Prop(Object)
    readonly stats?: Record<string, number>;

    get statsDictionary() {
        return statsDictionary;
    }

    loading = true;

    onLoaded() {
        this.loading = false;
    }

    active = false;
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"
    
.pokemon-variety-card
    padding: .25em 1em
    width: calc(100% - 2 * 1em)
    border-radius: 1em
    background-color: $light-gray
    display: flex
    color: $darkest-gray
    image-rendering: pixelated
    font-weight: bolder
    align-items: center
    cursor: pointer
    &__portrait
        margin-right: .25em
        width: 96px
        height: 96px
        opacity: $portrait-not-active-opacity
        transition-duration: .25s
        img
            width: inherit
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
        &__stats-changes
            margin: 0
            padding: 0
            margin-top: .5em
            font-size: .75em
            &__element
                color: $light-gray
                padding: .25em 1em
                margin-right: .5em
                margin-bottom: .5em
                border-radius: 1em
                display: inline-block
                list-style: none
                color: white
            &__element--better
                background-color: #76c97e
            &__element--worse
                background-color: #e06b6b
.pokemon-variety-card--displayed
    cursor: default !important
    
</style>