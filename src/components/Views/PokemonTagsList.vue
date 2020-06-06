<template>
    <ul class="pokemon-card__tags">
        <li class="pokemon-card__tags__element" v-for="tag of pokemonData.tags" :key="tag.name">
            <v-pokemon-tag :tag="tag" />
        </li>
    </ul>
</template>

<script lang="ts">
import Component from "vue-class-component";
import PokemonTag from "./PokemonTagsList/PokemonTag.vue";
import { Mixins, Prop } from "vue-property-decorator";
import { StringFilters } from "@/mixins/StringFilters";
import PokemonData from "@/classes/PokemonData";

@Component({
    components: {
        "v-pokemon-tag": PokemonTag
    }
})
export default class PokemonTagsList extends Mixins(StringFilters) {
    @Prop(PokemonData)
    pokemonData!: PokemonData;
}
</script>

<style lang="sass" scoped>
.pokemon-card__tags
    padding: 0
    margin: 0
    margin-top: .5em
    display: flex
    &__element
        margin-right: .5em
        list-style: none
        &:last-of-type
            margin-right: unset
</style>