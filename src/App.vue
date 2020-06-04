<template>
    <div id="app">
        <header id="header">
            <v-header-name />
            <v-header-search />
            <v-header-filters />
        </header>
        <main id="main">
            <router-view/>
        </main>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import HeaderName from '@/components/Header/HeaderName.vue';
import HeaderSearch from '@/components/Header/HeaderSearch.vue';
import HeaderFilters from '@/components/Header/HeaderFilters.vue';

import { MetaInfo } from 'vue-meta';

@Component({
    components: {
        'v-header-name': HeaderName,
        'v-header-search': HeaderSearch,
        'v-header-filters': HeaderFilters
    },
    metaInfo(): MetaInfo {
        return {
            titleTemplate: '%s | Pokedex',
            meta: [
                { charset: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                },
                {
                    name: 'author',
                    content: 'Maksymilian Łakomy'
                }
            ]
        };
    }
})
export default class App extends Vue {}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap')
body
    margin: 0

a
    text-decoration: none
    color: inherit

#main
    position: relative
    flex: 1 1 auto

#header
    max-width: 100%
    border-bottom: 1px solid #E9E9E9
    flex: 0 1 auto
    
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

#app
    font-family: 'Roboto', sans-serif
    display: flex
    position: relative
    flex-direction: column
    margin: auto
    min-height: 100vh
    width: 75%
    @media (max-width: 1440px)
        width: 80%
    @media (max-width: 1140px)
        width: 85%
    @media (max-width: 768px)
        width: 90%
    @media (max-width: 350px)
        width: 100%
</style>
