<template>
    <input
        class="nav__search"
        placeholder="Search"
        @keyup="onSearchEnter($event, $event.target.value)"
        :value="search"
    />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class NavigationSearch extends Vue {
    @Prop(String)
    search!: string;

    onSearchEnter(event: KeyboardEvent, search: string) {
        if (event.keyCode !== 13) return;
        this.$emit("update:search", search);
    }
}
</script>

<style lang="sass" scoped>
.nav__search
    outline: none
    font-size: inherit
    font-family: inherit
    border: unset
    background-color: #E9E9E9
    color: #707070
    padding: .625em 1em
    border-radius: 1em
    margin-right: 1em
</style>