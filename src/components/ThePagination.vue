<template>
    <ol class="pagination">
        <li class="pagination__element pagination__element__page-number" v-if="(pages[0] > 1)">
            <button
                @click="goToPage(1)"
                class="pagination__element__button pagination__element__page-number"
            >{{'1' | numeric}}</button>
        </li>
        <li class="pagination__element pagination__element__page-number" v-if="(pages[0] > 1)">. . .</li>
        <li class="pagination__element" v-for="i in pages" :key="i">
            <button
                @click="goToPage(i)"
                class="pagination__element__button pagination__element__page-number"
                :class="{'pagination__element__button--active': i === activePage}"
            >{{i.toString() | numeric}}</button>
        </li>
        <li
            class="pagination__element pagination__element__page-number"
        >/ {{pageAmount.toString() | numeric}}</li>
    </ol>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
    filters: {
        numeric(value: string) {
            if (typeof value !== "string") return;
            while (value.length < 2) value = `0${value}`;
            return value;
        }
    }
})
export default class ThePagination extends Vue {
    @Prop(Array)
    readonly pokemonSpeciesList!: Array<string>;

    @Prop(Number)
    readonly offset!: number;

    @Prop(Number)
    readonly limit!: number;

    get pageAmount() {
        return Math.floor(this.pokemonSpeciesList.length / this.limit) + 1;
    }

    get pages() {
        const pages = [];
        let upperLimit = this.activePage + 2;
        if (upperLimit > this.pageAmount) upperLimit = this.pageAmount;
        if (upperLimit - 4 <= 1) upperLimit -= upperLimit - 5;
        while (pages.length < 4) {
            pages.unshift(upperLimit);
            upperLimit--;
        }
        pages.unshift(upperLimit);
        return pages;
    }

    get activePage() {
        if (this.$route.params.page) return +this.$route.params.page;
        return 1;
    }

    goToPage(page: number) {
        this.$router.push({
            params: {
                page: page.toString()
            }
        });
    }
}
</script>

<style lang="sass" scoped>
.pagination
    padding: 0
    margin: 0
    margin-right: 1em
    text-align: right

    &__element
        list-style: none
        margin-bottom: .5em

        &__button
            outline: none
            border: unset
            background-color: unset
            opacity: .5
        &__button--active
            opacity: 1
        &__page-number
            font-family: inherit
            font-size: 1em
            color: #707070

</style>