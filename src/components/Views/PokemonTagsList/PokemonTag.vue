<template>
    <div class="pokemon-card__tag">{{tag.name | name}}</div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Mixins, Prop } from "vue-property-decorator";
import { StringFilters } from "@/mixins/StringFilters";

@Component
export default class PokemonTag extends Mixins(StringFilters) {
    @Prop(Object)
    tag!: {
        name: string;
        url: string;
    };
}
</script>

<style lang="sass" scoped>
.pokemon-card__tag
    padding: .125em .5em
    font-size: .75em
    border-radius: .5em
    margin-right: .5em
    background-color: #E9E9E9
    list-style: none
    &:last-of-type
        margin-right: unset
</style>