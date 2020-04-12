import Vue from 'vue';
import Component from 'vue-class-component'

import { parseQuery } from "@/mixins/parseQuery";

@Component
export class Search extends Vue {
    // --------------------------
    // Query Search
    // --------------------------
    get search(): string | undefined {
        const query = parseQuery(this.$route.query);
        if (query.search) return parseQuery(this.$route.query).search[0];
        else return undefined;
    }
}



