<template>
    <ol class="list">
        <li class="list__element pagination__element__page-number" v-if="(pages[0] > 1)">
            <button
                @click="setPage(1)"
                class="list__element__button list__element__page-number"
            >{{'1' | numeric}}</button>
        </li>
        <li class="list__element list__element__page-number" v-if="(pages[0] > 1)">. . .</li>
        <li class="list__element" v-for="i in pages" :key="i">
            <button
                @click="setPage(i)"
                class="list__element__button list__element__page-number"
                :class="{'list__element__button--active': i === currentPage}"
            >{{i.toString() | numeric}}</button>
        </li>
        <li
            class="list__element list__element__page-number list__element__page-number--count"
        >/ {{pageAmount.toString() | numeric}}</li>
    </ol>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { EventBus } from '@/events/EventBus';

import { AsyncFlags } from '@/mixins/AsyncFlags';
import { parseQuery } from '@/mixins/parseQuery';

import { PokemonsModule, getModule } from '@/store/pokemons/module';

@Component({
    filters: {
        numeric(value: string) {
            if (typeof value !== 'string') return;
            while (value.length < 2) value = `0${value}`;
            return value;
        }
    }
})
export default class ThePagination extends Mixins(AsyncFlags) {
    readonly pokemonsStore = getModule(PokemonsModule, this.$store);

    get currentPage(): number {
        return this.pokemonsStore.currentPage;
    }

    get pageAmount(): number {
        return this.pokemonsStore.pageAmount;
    }

    get pages() {
        const pages: Array<number> = [];
        let upperLimit = this.currentPage + 2;
        if (upperLimit - 5 < 0) upperLimit -= upperLimit - 5;
        if (upperLimit > this.pageAmount) upperLimit = this.pageAmount;
        while (pages.length < 5 && upperLimit > 0) {
            pages.unshift(upperLimit);
            upperLimit--;
        }
        return pages;
    }

    setPage(page: number) {
        const query = parseQuery(this.$route.query);
        if (query.p && query.p.includes(page.toString())) return;
        query.p = [page.toString()];
        this.$router.push({
            path: this.$route.path,
            params: this.$route.params,
            query
        });
    }
}
</script>

<style lang="sass" scoped>
.list
    border-bottom: 1px solid #E9E9E9
    padding: 1em 0
    font-size: .8em
    margin: 0
    margin-bottom: 1em
    position: sticky
    background-color: white
    top: 0
    display: flex
    z-index: 999999

    &__element
        list-style: none
        padding: 0 .25em

        &__button
            cursor: pointer
            outline: none
            border: unset
            background-color: unset
            opacity: .5
        &__button--active
            opacity: 1
        &__page-number
            font-family: inherit
            font-weight: bolder
            font-size: 1em
            color: #707070

</style>