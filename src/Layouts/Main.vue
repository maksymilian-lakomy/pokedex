<template>
    <div id="wrapper">
        <v-header />
        <main id="main">
            <slot />
        </main>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import Header from '@/components/Header/Header.vue';

@Component({
    components: {
        'v-header': Header
    }
})
export default class MainLayout extends Vue {}
</script>

<style lang="sass">

#wrapper
    display: flex
    min-height: 100vh
    flex-direction: column

#main
    position: relative
    flex: 1 1 auto
</style>