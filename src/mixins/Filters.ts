import Vue from 'vue';
import Component from 'vue-class-component'

import { parseQuery } from "@/mixins/parseQuery";
import { filters } from "@/enums/Filters";

@Component
export class Filters extends Vue {
    // --------------------------
    // Query for filters
    // --------------------------
    get activeFilters(): Record<string, Array<string>> {
        const activeFilters: Record<string, Array<string>> = parseQuery(
            this.$route.query
        );
        for (const query in activeFilters)
            if (!filters.includes(query)) delete activeFilters[query];
        return activeFilters;
    }
}



