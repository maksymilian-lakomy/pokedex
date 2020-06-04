<template>
    <button @click="clearQueries">
        <v-clear-decorator/>
    </button>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import ClearDecorator from './Clear/ClearDecorator.vue';

import { filters } from '@/enums/Filters';
import { Queries } from '@/classes/Queries';

@Component({
    components: {
        'v-clear-decorator': ClearDecorator
    }
})
export default class HeaderClear extends Vue {
    clearQueries() {
        filters.forEach(filter => this.queries.setQuery(filter, []));
        this.queries.setQuery('search', []);
        this.queries.setQuery('p', (1).toString());
        this.$router.push({
            path: '/',
            params: this.$route.params,
            query: this.queries.queries
        });
    }

    get queries(): Queries {
        return new Queries(this.$route.query);
    }
}
</script>
