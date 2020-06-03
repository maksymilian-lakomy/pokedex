<template>
    <div id="app">
        <v-header />
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import TheHeader from "@/components/TheHeader.vue";

import { MetaInfo } from "vue-meta";

@Component({
    components: {
        "v-header": TheHeader
    },
    metaInfo(): MetaInfo {
        return {
            titleTemplate: "%s | Pokedex",
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1"
                },
                {
                    name: "author",
                    content: "Maksymilian Łakomy"
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

#app
    font-family: 'Roboto', sans-serif
    display: flex
    position: relative
    flex-direction: column
    margin: auto
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
