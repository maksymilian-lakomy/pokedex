<template>
    <div>
        <header id="header">
            <v-header-name />
            <v-header-search />
            <v-header-filters />
        </header>
        <main>
            <slot />
        </main>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import HeaderName from '@/components/Header/HeaderName.vue';
import HeaderSearch from '@/components/Header/HeaderSearch.vue';
import HeaderFilters from '@/components/Header/HeaderFilters.vue';

@Component({
    components: {
        'v-header-name': HeaderName,
        'v-header-search': HeaderSearch,
        'v-header-filters': HeaderFilters
    }
})
export default class LayoutMain extends Vue {}
</script>

<style lang="sass">

#header
    max-width: 100%
    border-bottom: 1px solid #E9E9E9
    
button
    cursor: pointer
    outline: none
    font-size: inherit
    font-family: inherit
    font-weight: inherit
    border: unset
    padding: unset
    color: inherit
    background-color: unset

ul
    margin: 0
    padding: 0
</style>