<template>
    <div>
        <header id="header">
            <v-header-name />
            <v-header-search />
            <v-header-filters />
        </header>
        <main>
            <slot />
        </main>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import HeaderName from '@/components/Header/HeaderName.vue';
import HeaderSearch from '@/components/Header/HeaderSearch.vue';
import HeaderFilters from '@/components/Header/HeaderFilters.vue';

@Component({
    components: {
        'v-header-name': HeaderName,
        'v-header-search': HeaderSearch,
        'v-header-filters': HeaderFilters
    }
})
export default class LayoutMain extends Vue {}
</script>