<template>
    <section class="pokemon-overview-moves">
        <h3>Moves</h3>
        <nav class="pokemon-overview-moves__navigation">
            <button
                class="pokemon-overview-moves__navigation__button"
                :class="{'pokemon-overview-moves__navigation__button--active': page === currentPage}"
                v-for="page in pageAmount"
                :key="page"
                @click="changePage(page)"
            >{{page | page}}</button>
        </nav>
        <ul class="pokemon-overview-moves__list">
            <li
                class="pokemon-overview-moves__list__element"
                v-for="(move) of movesToDisplay"
                :key="move.name"
            >{{move.name | name}}</li>
        </ul>
    </section>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Mixins, Prop, Watch } from "vue-property-decorator";
import { StringFilters } from "@/mixins/StringFilters";
import PokemonData, { Move } from "@/classes/PokemonData";

@Component({
    filters: {
        page(value: number | string) {
            while (value.toString().length < 2)
                value = `0${value}`;
            return value;
        }
    }
})
export default class PokemonMovesList extends Mixins(StringFilters) {
    @Prop(PokemonData)
    readonly pokemonData!: PokemonData;

    @Watch("pokemonData")
    onPokemonDataChange() {
        this.page.offset = 0;
    }

    page = {
        offset: 0,
        limit: 10
    };

    get sortedMoves() {
        return this.pokemonData.moves.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    get canGoForward() {
        return this.page.offset + this.page.limit < this.sortedMoves.length;
    }

    get canGoBackward() {
        return this.page.offset > 0;
    }

    get pageAmount() {
        const pageAmount = Math.floor(this.sortedMoves.length / this.page.limit);
        if (pageAmount * this.page.limit < this.sortedMoves.length)
            return pageAmount + 1;
        return pageAmount;
    }

    get currentPage() {
        return Math.floor(this.page.offset / this.page.limit) + 1;
    }

    changePage(pageNumber: number) {
        this.page.offset = (pageNumber - 1) * this.page.limit;
        if (this.page.offset < 0) this.page.offset = 0;
        else if (this.page.offset >= this.sortedMoves.length)
            this.page.offset = this.page.offset - this.page.limit;
    }

    get movesToDisplay() {
        const moves: Array<Move> = [];
        for (
            let i = this.page.offset;
            i < this.page.offset + this.page.limit &&
            i < this.sortedMoves.length;
            i++
        )
            moves.push(this.sortedMoves[i]);
        return moves;
    }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables"

.pokemon-overview-moves
    position: relative
    &__navigation
        margin-bottom: .5em
        padding-bottom: .5em
        border-bottom: 1px solid $light-gray
        width: 100%
        overflow-x: auto
        display: flex
        &__button
            display: inline-block
            margin-right: .75em
            color: inherit
            cursor: pointer
            font-family: inherit
            background-color: unset
            border: unset
            outline: unset
            font-weight: bolder
            font-size: inherit
            opacity: .5
        &__button--active
            opacity: 1

    &__list
        margin: 0
        padding: 0
        &__element
            list-style: none
            padding: .5em 1em
            border-bottom: 1px solid $light-gray
</style>