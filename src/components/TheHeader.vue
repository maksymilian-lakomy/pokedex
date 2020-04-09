<template>
    <header>
        <input name="search" @keyup="onEnter($event, $event.target.value)" :value="search"/>
        <button>Colors</button>
        <button>Shapes</button>
        <button>Habitats</button>
    </header>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component({
    props: {
        search: {
            type: String,
            required: true
        }
    }
})
export default class TheHeader extends Vue {
    onEnter(event: KeyboardEvent, search: string) {
        if (event.keyCode !== 13)
            return;
        this.$emit('update:search', search);
    }
} 
</script>

<style lang="sass" scoped>

</style>