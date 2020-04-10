<template>
    <ul class="nav__filters-list">
        <li class="nav__filters-list__element">
            <button
                v-for="(filter, filterKey) in filtersDictionary"
                :key="filterKey"
                class="nav__filters-list__element__button"
                @click="$emit('click', filterKey)"
            >{{filter}}</button>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { filtersDictionary } from "@/enums/Filters";

@Component
export default class NavigationFilters extends Vue {
    filtersDictionary = filtersDictionary;
}
</script>

<style lang="sass" scoped>
.nav__filters-list
    padding: 0
    margin: 0
    &__element
        list-style: none
        &__button
            cursor: pointer
            outline: none
            font-size: inherit
            font-family: inherit
            border: unset
            background-color: unset
            color: #707070
            padding: .625em
            opacity: .5
            transition-duration: .2s
        &__button--active
            opacity: 1
        &__button:nth-last-child(1)
            margin-right: unset
        &__button--right
            float: right
        &__button:nth-child(n)
            margin-right: 1em
            @media (max-width: 768px)
                margin-right: .25em
            @media (max-width: 350px)
                padding: .625em .25em
</style>