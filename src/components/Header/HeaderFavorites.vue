<template>
    <button @click="toggleFavorites">
        <v-heart-decorator :isActive="isActive"/>
    </button>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import HeartDecorator from './Favorites/HeartDecorator.vue';

import { Queries } from '@/classes/Queries';

@Component({
    components: {
        'v-heart-decorator': HeartDecorator
    }
})
export default class HeaderClear extends Vue {

    async toggleFavorites() {
        if (this.queries.has('f'))
            this.queries.setQuery('f', '');
        else
            this.queries.setQuery('f', 'show');
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

    get isActive(): boolean {
        return this.queries.has('f', 'show');
    }

    get queries(): Queries {
        return new Queries(this.$route.query);
    }
}
</script>
