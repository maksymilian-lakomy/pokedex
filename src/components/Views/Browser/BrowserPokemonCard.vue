<template>
    <div
        class="pokemon-card"
        @mouseenter="active = true"
        @mouseleave="active = false"
        @click="$emit('click', pokemonSpecies)"
    >
        <v-pokemon-portrait
            :pokemonData="pokemonData"
            :generation="generation"
            :customClasses="{'pokemon-card__portrait__img--browser': true, 'pokemon-card__portrait__img--browser--active': active}"
        >
            <div class="pokemon-card__top-wrapper">
            <transition name="slide">
                <div
                    class="pokemon-card__additional-info"
                    v-show="active"
                >{{pokemonSpecies.varieties.length}}</div>
            </transition>
            <div class="pokemon-card__favorite-button__wrapper">
                <v-favorite-button :name="pokemonData.name"/>
            </div>
            </div>
        </v-pokemon-portrait>
        <div class="pokemon-card__info">
            <div class="pokemon-card__info__label">
                <div class="pokemon-card__info__label__id">{{pokemonData.id | id}}</div>
                <div class="pokemon-card__info__label__name">{{pokemonData.name | name}}</div>
            </div>
            <v-pokemon-tags-list :pokemonData="pokemonData" />
            <!-- <ul class="pokemon-card__info__tags">
                <li
                    class="pokemon-card__info__tags__element"
                    v-for="(tag, i) in tags"
                    :key="i"
                ><v-pokemon-tag :tag="tag"/></li>
            </ul>-->
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import PokemonCardFavoriteButton from './PokemonCard/PokemonCardFavoriteButton.vue';

import PokemonSpeciesData from '@/classes/PokemonSpeciesData';
import PokemonTagsList from '@/components/Views/PokemonTagsList.vue';
import PokemonPortrait from '@/components/Views/PokemonPortrait.vue';
import { Prop, Mixins } from 'vue-property-decorator';
import { StringFilters } from '@/mixins/StringFilters';
import { FavoritesStore } from '@/classes/FavoritesStore';

@Component({
    components: {
        'v-favorite-button': PokemonCardFavoriteButton,
        'v-pokemon-tags-list': PokemonTagsList,
        'v-pokemon-portrait': PokemonPortrait
    }
})
export default class BrowserPokemonCard extends Mixins(StringFilters) {
    @Prop(PokemonSpeciesData)
    pokemonSpecies!: PokemonSpeciesData;

    @Prop(Number)
    variety!: number;

    active = false;
    get pokemonData() {
        return this.pokemonSpecies.varieties[this.variety].pokemonFull!;
    }

    get generation(): string {
        return this.pokemonSpecies.generation.name;
    }

    get tags() {
        return [...this.pokemonData.tags];
    }

    get isPokemonFavorite() {
        return FavoritesStore.isFavorite(this.pokemonSpecies.name);
    }
}
</script>

<style lang="sass" >
.pokemon-card

    &__portrait
        position: relative
        max-width: 100%
        max-height: 100%
        background-color: #E9E9E9
        border-radius: 1em
        overflow: hidden
        &__img--browser
            opacity: .75
        &__img--browser--active
            transform: translateY(.5em)
            opacity: 1

    &__top-wrapper
        padding: .5em .75em
        top: 0
        position: absolute
        display: flex
        width: calc(100% - 2 * .75em)

        @media (max-width: 840px)
            font-size: 2em
        @media (max-width: 320px)
            font-size: 2.5em


    &__additional-info
        z-index: 1
        font-weight: bolder
        color: #707070
    
    &__favorite-button__wrapper
        margin-left: auto
        width: 1.5em
        height: 1.5em
        z-index: 1

    &__info
        text-align: left
        padding: .5em .75em
        color: #707070

        &__label
            cursor: pointer
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