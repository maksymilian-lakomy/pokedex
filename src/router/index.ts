import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Pokemon from '@/views/Pokemon.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/page=:page',
        name: 'Listing',
        component: Home
    },
    {
        path: '/pokemon/evolution=:evolution&species=:speciesId',
        name: 'Pokemon',
        component: Pokemon
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
