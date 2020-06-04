<template>
    <div class="filters">
        <ul>
            <li v-for="(filter, i) in filters" :key="i">
                <button @click="$emit('active-filter', filter)">
                    {{filterName(filter)}}
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { Queries } from '@/classes/Queries';
import { Prop } from 'vue-property-decorator';

import { filtersDictionary } from '@/enums/Filters';

@Component
export default class AvailableFilters extends Vue {
    @Prop({ required: true, type: Array })
    filters!: Array<string>;

    isActive(filter: string): boolean {
        return this.queries.has(filter);
    }

    filterName(filter: string): string {
        if (filtersDictionary[filter]) return filtersDictionary[filter];
        return filter;
    }

    get queries(): Queries {
        return new Queries(this.$route.query);
    }
}
</script>