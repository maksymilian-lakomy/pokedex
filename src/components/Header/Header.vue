<template>
    <header id="header">
        <v-header-name />
        <v-header-search />
        <div id="header__bottom-menu">
            <v-header-filters />
            <div id="header__bottom-menu__right">
                <v-header-clear v-if="hasActiveQueries" />
                <v-header-favorites />
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import HeaderName from '@/components/Header/HeaderName.vue';
import HeaderSearch from '@/components/Header/HeaderSearch.vue';
import HeaderFilters from '@/components/Header/HeaderFilters.vue';

import HeaderClear from '@/components/Header/HeaderClear.vue';
import HeaderFavorites from './HeaderFavorites.vue';

import { Queries } from '@/classes/Queries';
import { filters } from '@/enums/Filters';

@Component({
    components: {
        'v-header-name': HeaderName,
        'v-header-search': HeaderSearch,
        'v-header-filters': HeaderFilters,
        'v-header-clear': HeaderClear,
        'v-header-favorites': HeaderFavorites
    }
})
export default class Header extends Vue {
    get hasActiveQueries(): boolean {
        for (const filter of filters) if (this.queries.has(filter)) return true;
        return this.queries.has('search');
    }

    get queries(): Queries {
        return new Queries(this.$route.query);
    }
}
</script>

<style lang="sass">
#header
    max-width: 100%
    border-bottom: 1px solid #E9E9E9
    flex: 0 1 auto

    &__bottom-menu
        margin: 1em 0
        display: flex
        align-items: baseline
        position: relative

        &__right
            display: flex
            position: absolute
            right: 0
            top: 0

</style>