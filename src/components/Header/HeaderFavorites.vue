<template>
    <button>
        <v-heart-decorator />
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

    get queries(): Queries {
        return new Queries(this.$route.query);
    }
}
</script>
