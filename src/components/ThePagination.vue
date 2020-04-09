<template>
    <div>
        <div v-for="i in pageAmount" :key="i" @click="goToPage(i)">{{i}}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
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

    goToPage(page: number) {
        this.$router.push({
            params: {
                'page': page.toString()
            }
        });
    }
}
</script>