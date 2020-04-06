<template>
    <div class="pokemon-card" @mouseenter="active = true" @mouseleave="active = false">
        <div class="pokemon-card__portrait">
            <img
                class="pokemon-card__portrait__img"
                :class="{'pokemon-card__portrait__img--active': active}"
                :src="pokemonData.sprites.frontDefault"
            />
        </div>
        <div class="pokemon-card__info">
            <div class="pokemon-card__info__label">
                <div class="pokemon-card__info__label__id">{{id}}</div>
                <div class="pokemon-card__info__label__name">{{pokemonData.name | capitalize}}</div>
            </div>
            <ul class="pokemon-card__info__tags">
                <li
                    class="pokemon-card__info__tags__tag"
                    v-for="(type, i) in pokemonData.types"
                    :key="i"
                >{{type.type.name | capitalize}}</li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import PokemonData from "@/classes/PokemonData";

@Component({
    props: {
        pokemonData: {
            type: PokemonData,
            required: true
        }
    },
    computed: {
        id() {
            let id: string = this.$props.pokemonData.id.toString();
            while (id.length < 3) id = `0${id}`;
            return id;
        }
    },
    filters: {
        capitalize(value?: string) {
            if (!value) return;
            value = value.replace("-", " ");
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
})
export default class PokemonCard extends Vue {
    active = false;
}
</script>

<style lang="sass" scoped>
.pokemon-card

    &__portrait
        max-width: 100%
        max-height: 100%
        background-color: #E9E9E9
        border-radius: 1em
        &__img
            transition-duration: .25s
            opacity: .75
            width: 100%
            height: 100%
            image-rendering: pixelated
        &__img--active
            transform: translateY(-.25em)
            opacity: 1

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
                font-size: 1

        &__tags
            display: flex
            margin: 0
            margin-top: .5em
            padding: 0

            &__tag
                padding: .125em .5em
                font-size: .75em
                border-radius: .5em
                margin-right: .5em
                background-color: #E9E9E9
                list-style: none
                &:last-of-type
                    margin-right: unset
</style>