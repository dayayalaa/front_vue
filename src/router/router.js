import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/InicioVista.vue';
import Crear from '../views/ArmarViajeVista.vue';
import Resultados from '../views/ResutadoVista.vue';
import Perfil from '../views/PerfilVista.vue';
import Guias from '../views/GuiasVista.vue';
import Listas from '../views/ListaVista.vue';
import ItinerarioDetalle from '../views/ItinerarioDetalle.vue';
import DestinosPopulares from '../components/DestinosPopulares.vue';
import DestinosArcana from '../components/DestinosArcana.vue';

const routes = [
  { path: '/',                     name: 'Home',                   component: HomeView },
  { path: '/crear',                name: 'Crear',                  component: Crear },
  { path: '/resultados',           name: 'Resultados',             component: Resultados },
  { path: '/perfil',               name: 'Perfil',                 component: Perfil },
  { path: '/guias',                name: 'Guias',                  component: Guias },
  { path: '/listas',               name: 'Listas',                 component: Listas },
  { path: '/itinerario/:id',       name: 'ItinerarioDetalle',      component: ItinerarioDetalle },
  { path: '/destinos-popular/:id/:type', name: 'destinoPopular', component: DestinosPopulares },
  { path: '/destinos-arcana/:id/:type', name: 'destinoArcana', component: DestinosArcana },

  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash };
    } else {
      return { top: 0 };
    }
  },
});

export default router;
