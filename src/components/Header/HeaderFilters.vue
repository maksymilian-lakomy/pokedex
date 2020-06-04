<template>
    <div style="max-width: 100%">
        <v-available-filters
            :filters="Object.keys(filters)"
            @active-filter="setActiveFilter"
            :activeFilter="activeFilter"
        />
        <keep-alive>
            <transition name="filter-options">
                <v-available-options
                    v-if="activeFilter !== null"
                    @option-click="changeOption(activeFilter, $event)"
                    :options="filters[activeFilter]"
                    :filter="activeFilter"
                />
            </transition>
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
import { Route, Next } from 'vue-router';

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

    async changeOption(filter: string, option: string) {
        if (this.queries.has(filter, option))
            this.queries.removeFromQuery(filter, option);
        else this.queries.addToQuery(filter, option);
        this.queries.setQuery('p', (1).toString());
        try {
            await this.$router.push({
                path: '/',
                params: this.$route.params,
                query: this.queries.queries
            });
        } catch (e) {
            return;
        }
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
.filter-options-enter-active, .filter-options-leave-active 
    transition-duration: .5s
    transition-timing-function: ease-out
    opacity: 1
    padding-bottom: 1em
    max-height: 2em

.filter-options-enter, .filter-options-leave-to
    padding: 0
    opacity: 0
    max-height: 0
</style>