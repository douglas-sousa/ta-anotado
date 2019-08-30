import Vue from 'vue';
import Router from 'vue-router';

import Inicial from './views/Inicial.vue';
import Contato from './views/Contato.vue';
import Entre from './views/Entre.vue';
import NotaMod from './views/NotaMod.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Inicial',
      component: Inicial
    },
    {
      path: '/principal',
      name: 'Principal',
      beforeEnter: (to, from, next) => {
        const tnToken = localStorage.getItem('tn-token');
        if(!tnToken) {
          next('/entre');
          return;
        }
        next();
      },
      component: () => import('./views/Principal.vue')
    },
    {
      path: '/notamod',
      name: 'NotaMod',
      component: NotaMod
    },
    {
      path: '/contato',
      name: 'Contato',
      component: Contato
    },
    {
      path: '/entre',
      name: 'Entre',
      component: Entre
    }
  ]
})
