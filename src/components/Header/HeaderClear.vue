<template>
    <button @click="clearQueries">
        <v-clear-decorator />
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
    async clearQueries() {
        filters.forEach(filter => this.queries.setQuery(filter, []));
        this.queries.setQuery('search', []);
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

    get queries(): Queries {
        return new Queries(this.$route.query);
    }
}
</script>
