<template>
    <div id="app">
        <v-header />
        <main id="main">
            <router-view />
        </main>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { MetaInfo } from 'vue-meta';

import Header from '@/components/Header/Header.vue';

@Component({
    components: {
        'v-header': Header
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
    display: flex
    align-items: center

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
