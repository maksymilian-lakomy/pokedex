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

@Component({
    components: {
        "v-header": TheHeader
    }
})
export default class App extends Vue {}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap')
body
    margin: 0

#app
    font-family: 'Roboto', sans-serif
    display: flex
    position: relative
    flex-direction: column
    margin: auto
    width: 75%
    @media (max-width: 768px)
        width: 90%                
    @media (max-width: 350px)
        width: 100%
</style>
