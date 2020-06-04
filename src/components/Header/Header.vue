<template>
    <header id="header">
        <v-header-name />
        <v-header-search />
        <div id="header__bottom-menu">
            <v-header-filters />
            <div id="header__bottom-menu__right">
                <v-header-clear v-if="hasActiveQueries" />
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

import { Queries } from '@/classes/Queries';
import { filters } from '@/enums/Filters';

@Component({
    components: {
        'v-header-name': HeaderName,
        'v-header-search': HeaderSearch,
        'v-header-filters': HeaderFilters,
        'v-header-clear': HeaderClear
    }
})
export default class Header extends Vue {
    get hasActiveQueries(): boolean {
        for (const filter in filters) if (this.queries.has(filter)) return true;
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
        display: flex
        align-items: baseline

        &__right
            margin-left: auto

</style>