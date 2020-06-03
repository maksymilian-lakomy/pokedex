import Vue from 'vue';
import Vuex from 'vuex';
import { PokemonsModule } from './pokemons/module';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        'pokemons': PokemonsModule
    }
});

export { store };