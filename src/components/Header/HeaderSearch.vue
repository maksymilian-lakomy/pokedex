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
        const queries = new Queries(this.$route.query);
        const formatted = event.target.value.toLowerCase().split(' ').join('-');
        queries.setQuery('search', formatted);

        this.$router.push({
            path: '/',
            params: this.$route.params,
            query: queries.queries
        });
    }

    get searchString(): string {
        const queries = new Queries(this.$route.query);
        return queries.has('search') ? queries.queries['search'][0] : '';
    }
}
</script>