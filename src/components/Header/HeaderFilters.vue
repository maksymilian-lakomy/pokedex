<template>
    <div class="filters">
        <ul>
            <li v-for="(filter, i) in filters" :key="i">
                <button>{{filter}}</button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { Queries } from '@/classes/Queries';

import { filtersDictionary } from '@/enums/Filters';

@Component
export default class HeaderFilters extends Vue {
    readonly filters = filtersDictionary;

    isActive(filter: string): boolean {
        return this.queries.has(filter);
    }

    get queries(): Queries {
        return new Queries(this.$route.params);
    }
}
</script>

<style lang="sass">

</style>