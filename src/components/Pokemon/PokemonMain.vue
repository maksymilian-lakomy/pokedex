<template>
    <section class="pokemon-overview-main">
        <div class="pokemon-overview-main__portrait">
            <img
                class="pokemon-overview-main__portrait__img--placeholder"
                src="@/assets/pokemon-placeholder.png"
                v-show="!pokemonData.sprites.frontDefault || loading"
            />
            <img
                v-show="!loading"
                :src="pokemonData.sprites.frontDefault"
                :class="{'pokemon-overview-main__portrait__img--filter': filterPortrait}"
                @load="onLoaded()"
            />
        </div>
        <h1>{{pokemonData.id | id}} {{pokemonData.name | name}}</h1>
    </section>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Mixins, Prop } from "vue-property-decorator";
import { StringFilters } from "@/mixins/StringFilters";
import PokemonData from "@/classes/PokemonData";

@Component
export default class PokemonMain extends Mixins(StringFilters) {
    @Prop(PokemonData)
    readonly pokemonData!: PokemonData;

    @Prop(Boolean)
    readonly filterPortrait!: boolean;

    loading = true;

    onLoaded() {
        this.loading = false;
    }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"

.pokemon-overview-main
    width: 100%
    &__portrait
        text-align: center
        background-color: $light-gray
        border-radius: 1em
        image-rendering: pixelated
        width: inherit
        img
            width: 288px
        &__img
            &--placeholder
                opacity: $placeholder-opacity
            &--filter
                image-rendering: auto
</style>