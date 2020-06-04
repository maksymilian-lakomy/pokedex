<template>
    <div>
        <v-available-filters :filters="Object.keys(filters)" @active-filter="setActiveFilter" :activeFilter="activeFilter"/>
        <keep-alive>
            <v-available-options
                v-if="activeFilter !== null"
                @option-click="changeOption(activeFilter, $event)"
                :options="filters[activeFilter]"
                :filter="activeFilter"
            />
        </keep-alive>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import AvailableFilters from './Filters/AvailableFilters.vue';
import AvailableOptions from './Filters/AvailableOptions.vue';

import { filters } from '@/enums/Filters';
import pokemonFilterService from '@/services/pokemonFilterService';
import { Queries } from '@/classes/Queries';
@Component({
    components: {
        'v-available-filters': AvailableFilters,
        'v-available-options': AvailableOptions
    }
})
export default class HeaderFilters extends Vue {
    readonly filters: Record<string, Array<string>> = {};
    activeFilter: string | null = null;

    created() {
        filters.forEach(filter => Vue.set(this.filters, filter, {}));
        this.loadOptions();
    }

    changeOption(filter: string, option: string) {
        if (this.queries.has(filter, option))
            this.queries.removeFromQuery(filter, option);
        else this.queries.addToQuery(filter, option);
        this.queries.setQuery('p', (1).toString());
        this.$router.push({
            path: '/',
            params: this.$route.params,
            query: this.queries.queries
        });
    }

    setActiveFilter(filter: string) {
        this.activeFilter = this.activeFilter === filter ? null : filter;
    }

    async loadOptions() {
        const availableOptions = await Promise.all(
            filters.map(filter => pokemonFilterService.getOptions({ filter }))
        );
        filters.forEach((filter, i) =>
            Vue.set(this.filters, filter, availableOptions[i])
        );
    }

    get queries(): Queries {
        return new Queries(this.$route.query);
    }
}
</script>

<style lang="sass">

</style>