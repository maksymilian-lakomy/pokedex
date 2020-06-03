import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueMeta from "vue-meta";
import Vuex from 'vuex';
import { store } from '@/store/store';

import { sync } from 'vuex-router-sync';

sync(store, router);

Vue.config.productionTip = false

Vue.use(VueMeta);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
