<template>
    <div class="pokemon-card" @mouseenter="active = true" @mouseleave="active = false" @click="$emit('click', pokemonSpecies)">
        <div class="pokemon-card__portrait">
            <transition name="slide">
                <div
                    class="pokemon-card__portrait__additional-info"
                    v-show="active"
                >{{pokemonSpecies.varieties.length}}</div>
            </transition>
            <div>
                <img
                    class="pokemon-card__portrait__img pokemon-card__portrait__img--placeholder"
                    src="@/assets/pokemon-placeholder.png"
                    v-if="!portrait.loaded"
                />
                <span class = "pokemon-card__portrait__img--placeholder__message" v-if="!pokemonData.sprites.frontDefault">No image</span>
            </div>
            <img
                class="pokemon-card__portrait__img"
                :class="{'pokemon-card__portrait__img--active': active,
                'pokemon-card__portrait__img--filter': filterPortrait}"
                :src="pokemonData.sprites.frontDefault"
                @load="onLoaded()"
                v-show="portrait.loaded"
            />
        </div>
        <div class="pokemon-card__info">
            <div class="pokemon-card__info__label">
                <div class="pokemon-card__info__label__id">{{pokemonData.id | id}}</div>
                <div class="pokemon-card__info__label__name">{{pokemonData.name | name}}</div>
            </div>
            <v-pokemon-tags-list :pokemonData="pokemonData"/>
            <!-- <ul class="pokemon-card__info__tags">
                <li
                    class="pokemon-card__info__tags__element"
                    v-for="(tag, i) in tags"
                    :key="i"
                ><v-pokemon-tag :tag="tag"/></li>
            </ul> -->
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import PokemonSpeciesData from "@/classes/PokemonSpeciesData";
import PokemonTagsList from "@/components/Pokemon/PokemonTagsList.vue";
import { Prop, Mixins } from 'vue-property-decorator';
import { StringFilters } from '@/mixins/StringFilters';

@Component({
    components: {
        "v-pokemon-tags-list": PokemonTagsList
    }
})
export default class PokemonCard extends Mixins(StringFilters) {
    @Prop(PokemonSpeciesData)
    pokemonSpecies!: PokemonSpeciesData;

    @Prop(Number)
    variety!: number;

    active = false;
    portrait = {
        loaded: false
    };

    onLoaded() {
        this.portrait.loaded = true;
    }

    get pokemonData() {
        return this.$props.pokemonSpecies.varieties[this.$props.variety]
            .pokemonFull;
    }

    get filterPortrait() {
        return (
            ["generation-vii", "generation-viii"].indexOf(
                this.$props.pokemonSpecies.generation.name
            ) !== -1
        );
    }

    get tags() {
        //[this.$props.pokemonSpecies.color, this.$props.pokemonSpecies.habitat, this.$props.pokemonSpecies.shape]//
        return [...this.pokemonData.tags];
    }
}
</script>

<style lang="sass" scoped>
.pokemon-card

    &__portrait
        position: relative
        max-width: 100%
        max-height: 100%
        background-color: #E9E9E9
        border-radius: 1em
        overflow: hidden

        &__additional-info
            z-index: 1
            font-weight: bolder
            position: absolute
            top: 0
            right: 0
            padding: .5em .75em
            color: #707070

        &__img
            transition-duration: .25s
            opacity: .75
            width: 100%
            height: 100%
            image-rendering: pixelated
        &__img--active
            transform: translateY(.5em)
            opacity: 1
        &__img--placeholder
            opacity: 0.1
            position: relative
            &__message
                position: absolute
                width: 100%
                text-align: center
                left: 0
                color: #707070
                font-weight: bold
                top: 50%
                font-size: 2em
                transform: translateY(-50%)
        &__img--filter
            image-rendering: auto !important

    &__info
        text-align: left
        padding: .5em .75em
        color: #707070

        &__label
            display: flex
            font-weight: bold
            align-items: center
            &__id
                font-size: .75em
                margin-right: .75em

            &__name
                font-size: 1em

        &__tags
            display: flex
            margin: 0
            margin-top: .5em
            padding: 0

            &__element
                list-style: none

.slide-enter-active, .slide-leave-active 
    transition-duration: .25s
    transform: translateY(0%)

.slide-enter, .slide-leave-to
    transform: translateY(-100%)

</style>