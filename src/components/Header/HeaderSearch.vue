<template>
    <div>
        <!-- Improve accessibility !-->
        <input class="search" placeholder="Search" :value="searchString" @keyup="updateRoute" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { Queries } from '@/classes/Queries';

@Component
export default class HeaderSearch extends Vue {
    updateRoute(event: KeyboardEvent): void {
        if (
            event.key.toLowerCase() !== 'enter' ||
            !(event.target instanceof HTMLInputElement)
        )
            return;

        const searchString = event.target.value;

        this.queries.setQuery('search', event.target.value);

        this.$router.push({
            path: '/',
            params: this.$route.params,
            query: this.queries.queries
        });
    }

    get searchString(): string {
        return this.queries.has('search')
            ? this.queries.queries['search'][0]
            : '';
    }

    get queries(): Queries {
        return new Queries(this.$route.query);
    }
}
</script>

<style lang="sass">
.search
    outline: none
    font-size: inherit
    font-family: inherit
    border: unset
    background-color: #E9E9E9
    color: #707070
    padding: .625em 1em
    border-radius: 1em
    margin-right: 1em
</style>