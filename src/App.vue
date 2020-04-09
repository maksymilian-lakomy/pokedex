<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class App extends Vue {
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap')
body
    margin: 0

#app 
    font-family: 'Roboto', sans-serif
    width: 100%
</style>
