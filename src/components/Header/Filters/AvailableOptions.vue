<template>
    <div class="options-wrapper">
        <ul class="options">
            <li
                class="options__element"
                :class="{'options__element--active': isActive(option)}"
                v-for="(option, i) in options"
                :key="i"
            >
                <button @click="$emit('option-click', option)">{{option | uncode}}</button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Queries } from '@/classes/Queries';

@Component({
    filters: {
        uncode: function(value: string) {
            if (!value) return;
            return (
                value.charAt(0).toUpperCase() +
                value
                    .slice(1)
                    .split('-')
                    .join(' ')
            );
        }
    }
})
export default class AvailableOptions extends Vue {
    @Prop({ type: Array, required: true })
    readonly options!: Array<string>;

    @Prop({ type: String, required: true })
    readonly filter!: string;

    isActive(option: string): boolean {
        return this.queries.has(this.filter, option);
    }

    get queries(): Queries {
        return new Queries(this.$route.query);
    }
}
</script>

<style lang="sass">
.options-wrapper
    height: 100%

.options
    margin: 0
    width: 100%
    display: flex
    overflow-x: auto
    overflow-y: hidden
    font-size: .8em
    padding: 1em 0
    &__element
        padding: .1em .5em
        display: inline-block
        list-style: none
        margin-right: .5em
        color: #707070
    &__element--active
        border-radius: .25em
        color: white
        background-color: #707070
    &__element:nth-last-child(1)
        margin-right: unset
</style>