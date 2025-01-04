import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/InicioVista.vue";
import Crear from "../views/ArmarViajeVista.vue";
import Resultados from "../views/ResutadoVista.vue";
import Perfil from "../views/PerfilVista.vue";
import GuiaPerfil from "../views/PerfilGuiaVista.vue";
import GuiasTarjetas from "../components/GuiasTarjetas.vue";
import GuiasPerfilVista from "../views/GuiasPerfilVista.vue";
import Listas from "../views/ListaVista.vue";
import ItinerarioDetalle from "../views/ItinerarioDetalle.vue";
import DestinosArcana from "../components/DestinosArcana.vue";
import HotelesVista from "../views/HotelesVista.vue";
import InicioSesion from "../views/InicioSesion.vue";
import OpcionInicio from "../views/OpcionInicio.vue";
import Registro from "../views/Registro.vue";
import RegistroGuia from "../views/RegistroGuia.vue";
import CraerTur from "../views/CrearTur.vue";

const routes = [
  { path: "/",                   name: "Home",              component: HomeView,          meta: { requiresAuth: true } },
  { path: "/crear",              name: "Crear",             component: Crear,             meta: { requiresAuth: true } },
  { path: "/resultados",         name: "Resultados",        component: Resultados,        meta: { requiresAuth: true } },
  { path: "/perfil/:id",         name: "Perfil",            component: Perfil,            meta: { requiresAuth: true } },
  { path: "/perfil/guia/:id",         name: "GuiaPerfil",            component: GuiaPerfil,            meta: { requiresAuth: true } },
  { path: "/guiasTarjetas",      name: "GuiasTarjetas",     component: GuiasTarjetas,     meta: { requiresAuth: true } },
  { path: "/guias/:id",          name: "GuiasPerfilVista",  component: GuiasPerfilVista,  meta: { requiresAuth: true } },
  { path: "/listas",             name: "Listas",            component: Listas,            meta: { requiresAuth: true } },
  { path: "/itinerario/:id",     name: "ItinerarioDetalle", component: ItinerarioDetalle, meta: { requiresAuth: true }},
  { path: "/arcana/lugares/:id", name: "lugarDetalle",      component: DestinosArcana,    meta: { requiresAuth: true } },
  { path: "/hoteles",            name: "opcionesHoteles",   component: HotelesVista,      meta: { requiresAuth: true }},
  { path: "/login",              name: "login",             component: InicioSesion},
  { path: "/opcion",             name: "opcion",            component: OpcionInicio,      meta: { publicRoutes: true }},
  { path: "/registroUsuario",    name: "registroUsuario",   component: Registro,          meta: { publicRoutes: true }},
  { path: "/registroGuia",       name: "registroGuia",      component: RegistroGuia,      meta: { publicRoutes: true }},
  { path: "/crearTur",       name: "crearTur",      component: CraerTur},
];

const router = createRouter({
  history: createWebHistory(),
  routes, 

  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else if (to.matched.some(record => record.meta.publicRoutes) && isAuthenticated) {
    next('/'); 
  } else {
    next();
  }
});

export default router;
