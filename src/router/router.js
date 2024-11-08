import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/InicioVista.vue';
import Crear from '../views/ArmarViajeVista.vue';
import Resultados from '../views/ResutadoVista.vue';
import Perfil from '../views/PerfilVista.vue';
import Guias from '../views/GuiasVista.vue';
import Listas from '../views/ListaVista.vue';

const routes = [
    { path: '/',                        component: HomeView, },
    { path: '/crear',                   component: Crear, },
    { path: '/resultados',              component: Resultados, },
    { path: '/perfil',                  component: Perfil, },
    { path: '/guias',                   component: Guias, },
    { path: '/listas',                  component: Listas,},
];

const router = createRouter({
  // routes: routes,
  routes,
  //history: createWebHashHistory(),
  history: createWebHistory(),

scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash };
    } else {
  
      return { top: 0 };
    }
  },

});


export default router;

