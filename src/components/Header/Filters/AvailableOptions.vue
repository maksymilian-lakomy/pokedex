<template>
    <div>
        <ul>
            <li v-for="(option, i) in options" :key="i">
                <button @click="$emit('option-click', option)">
                    {{option}} 
                    <span v-if="isActive(option)">Active</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Queries } from '@/classes/Queries';

@Component
export default class AvailableOptions extends Vue {
    @Prop({ type: Array, required: true })
    readonly options!: Array<string>;

    @Prop({type: String, required: true})
    readonly filter!: string;

    isActive(option: string): boolean {
        return this.queries.has(this.filter, option);
    }

    get queries(): Queries {
        return new Queries(this.$route.query);
    }
}
</script>