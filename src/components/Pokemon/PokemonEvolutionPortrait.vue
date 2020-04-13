<template>
    <div
        class="pokemon-evolution-portrait"
        :class="{'pokemon-evolution-portrait--main': isMain}"
        @mouseenter="active = true"
        @mouseleave="active = false"
        @click="$emit('click', $event)"
    >
        <img
            class="pokemon-evolution-portrait__img"
            :class="{'pokemon-evolution-portrait__img--active': active && !isMain,
                'pokemon-evolution-portrait__img--placeholder': !hasSprite,
                'pokemon-evolution-portrait__img--main': isMain}"
            :src="hasSprite ? pokemonData.sprites.frontDefault : require('@/assets/pokemon-placeholder.png')"
        />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import PokemonData from "@/classes/PokemonData";

@Component
export default class PokemonEvolutionPortrait extends Vue {
    @Prop(PokemonData)
    readonly pokemonData!: PokemonData;

    @Prop({
        type: Boolean,
        default: false
    })
    readonly isMain!: boolean;

    active = false;

    get hasSprite() {
        if (this.pokemonData.sprites.frontDefault) return true;
        return false;
    }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"

.pokemon-evolution-portrait
    border-radius: 50%
    width: 96px
    height: 96px

    &__img
        opacity: $portrait-not-active-opacity
        width: 100%
        transition-duration: .25s

    &__img--placeholder
        opacity: $placeholder-opacity !important

    &__img--active
        opacity: 1
        transform: translateY(-.25em)

    &__img--main
        opacity: 1

.pokemon-evolution-portrait--main
    background-color: $light-gray
</style>