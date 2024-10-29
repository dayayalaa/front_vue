import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/InicioVista.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/crear',
      name: 'crear',
      component: () => import('../views/ArmarViajeVista.vue')
    },
    {
      path: '/resultados',
      name: 'Resultados',
      component: () => import('../views/ResutadoVista.vue')
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('../views/PerfilVista.vue')
    }
    , 
    {
      path: '/guias',
      name: 'guias',
      component: () => import('../views/GuiasVista.vue')
    }
  ]
})

export default router
