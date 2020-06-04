<template>
    <section class="pokemon-overview-description">
        <h3>Description</h3>
        <p class="pokemon-overview-description__text">
            {{currentDescription}}
            <br />
            <span class="pokemon-overview-description__source">— from {{currentGameVersion | name}}</span>
        </p>
    </section>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Mixins, Prop } from "vue-property-decorator";
import { StringFilters } from "@/mixins/StringFilters";
import PokemonSpeciesData from "@/classes/PokemonSpeciesData";
import { parseQuery } from "@/mixins/parseQuery";

@Component
export default class PokemonDataDescription extends Mixins(StringFilters) {
    @Prop(PokemonSpeciesData)
    readonly pokemonSpeciesData!: PokemonSpeciesData;

    get currentDescriptionIndex() {
        const query = parseQuery(this.$route.query);
        if (!query.game || !query.game[0]) return 0;
        const index = this.pokemonSpeciesData.flavorTextEntries.findIndex(
            flavor => flavor.version.name === query.game[0]
        );
        if (index !== -1) return index;
        return 0;
    }

    get currentDescription() {
        if (
            this.pokemonSpeciesData.flavorTextEntries[
                this.currentDescriptionIndex
            ]
        )
            return this.pokemonSpeciesData.flavorTextEntries[
                this.currentDescriptionIndex
            ].text;
        return "No description found.";
    }

    get currentGameVersion() {
        if (
            this.pokemonSpeciesData.flavorTextEntries[
                this.currentDescriptionIndex
            ]
        )
            return this.pokemonSpeciesData.flavorTextEntries[
                this.currentDescriptionIndex
            ].version.name;
        return "";
    }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"

.pokemon-overview-description
    &__text
        line-height: 2em
        padding-left: 2em
        border-left: .2em solid $light-gray
        font-style: italic
    &__source
        font-style: normal
        font-weight: bolder
</style>