<template>
    <ul class="filters">
        <li
            class="filters__element"
            :class="{'filters__element--active': hasActiveOptions(filter)}"
            v-for="(filter, i) in filters"
            :key="i"
        >
            <button @click="$emit('active-filter', filter)">
                {{filterName(filter)}}
                <v-drop-down-decorator :active="activeFilter === filter"/>
            </button>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import DropDownDecorator from './DropDownDecorator.vue';

import { Queries } from '@/classes/Queries';
import { Prop } from 'vue-property-decorator';

import { filtersDictionary } from '@/enums/Filters';

@Component({
    components: {
        'v-drop-down-decorator': DropDownDecorator
    }
})
export default class AvailableFilters extends Vue {
    @Prop({ required: true, type: Array })
    filters!: Array<string>;

    @Prop({required: true})
    activeFilter!: string | null;

    hasActiveOptions(filter: string): boolean {
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

<style lang="sass">

@import "@/styles/variables"
.filters
    display: flex
    align-items: center
    padding: 1em 0
    color: $dark-gray
    &__element
        list-style: none
        margin-right: .75em
        position: relative
        transition-duration: .2s
        font-weight: bolder
        &::after
            position: absolute
            content: ""
            transition-duration: .2s
            width: 0%
            height: 1px
            background-color: $light-gray
            left: 0
            bottom: -.25em
        svg
            vertical-align: middle
        &__element--active
            opacity: 1
    &__element--clear 
        margin-left: auto
    &__element--active
        &::after
            width: 100%
</style>