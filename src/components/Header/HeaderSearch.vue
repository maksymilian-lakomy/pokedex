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
        const formatted = event.target.value.toLowerCase().split(' ').join('-');
        this.queries.setQuery('search', formatted);

        this.$router.push({
            path: '/',
            params: this.$route.params,
            query: this.queries.queries
        });
    }

    get searchString(): string {
        return this.queries.has('search') ? this.queries.queries['search'][0] : '';
    }

    get queries(): Queries {
        return new Queries(this.$route.query);
    }
}
</script>