import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/InicioVista.vue";
import Crear from "../views/ArmarViajeVista.vue";
import Resultados from "../views/ResutadoVista.vue";
import Perfil from "../views/PerfilVista.vue";
import GuiaPerfil from "../views/PerfilGuiaVista.vue";
import EditarPerfil from "../components/EditarPerfil.vue";
import GuiasTarjetas from "../components/GuiasTarjetas.vue";
import GuiasPerfilVista from "../views/GuiasPerfilVista.vue";
import Listas from "../views/ListaVista.vue";
import ItinerarioDetalle from "../views/ItinerarioDetalle.vue";

import HotelesVista from "../views/HotelesVista.vue";
import InicioSesion from "../views/InicioSesion.vue";
import OpcionInicio from "../views/OpcionInicio.vue";
import RegistroUsuario from "../views/RegistroUsuario.vue";
import RegistroGuia from "../views/RegistroGuia.vue";
import CraerTur from "../components/CrearTur.vue";
import VistaTur from "../views/VistaTur.vue";
import EditarTur from "../components/EditarTur.vue";
import Ajustes from "../components/Ajustes.vue";
import Pago from "../components/PagoVista.vue";
import ProvinciasVistas from "../components/ProvinciasVistas.vue";
import LugaresVistas from "../components/LugaresVistas.vue";
import InicioGuiaVista from "../views/InicioGuiaVista.vue";
import VistaTourUsuario from "../views/VistaReservaDetalle.vue";
import VistaReserva from "../views/VistaReserva.vue";

const routes = [
  { path: "/",                   name: "Home",              component: HomeView,          meta: { requiresAuth: true } },
  { path: "/crear",              name: "Crear",             component: Crear,             meta: { requiresAuth: true } },
  { path: "/resultados",         name: "Resultados",        component: Resultados,        meta: { requiresAuth: true } },
  { path: "/perfil/:id",         name: "Perfil",            component: Perfil,            meta: { requiresAuth: true } },
  { path: "/perfil/guia/:id",    name: "GuiaPerfil",        component: GuiaPerfil,        meta: { requiresAuth: true } },
  { path: "/editar/:id",         name: "EditarPerfil",      component: EditarPerfil,      meta: { requiresAuth: true } },
  { path: "/guiasTarjetas",      name: "GuiasTarjetas",     component: GuiasTarjetas,     meta: { requiresAuth: true } },
  { path: "/guias/:id",          name: "GuiasPerfilVista",  component: GuiasPerfilVista,  meta: { requiresAuth: true } },
  { path: "/listas/:id",         name: "Listas",            component: Listas,            meta: { requiresAuth: true } },
  { path: "/itinerario/:id",     name: "ItinerarioDetalle", component: ItinerarioDetalle, meta: { requiresAuth: true }},
 
  { path: "/hoteles/:id",        name: "opcionesHoteles",   component: HotelesVista,      meta: { requiresAuth: true }},
  { path: "/login",              name: "login",             component: InicioSesion},
  { path: "/opcion",             name: "opcion",            component: OpcionInicio,      meta: { publicRoutes: true }},
  { path: "/registroUsuario",    name: "registroUsuario",   component: RegistroUsuario,   meta: { publicRoutes: true }},
  { path: "/registroGuia",       name: "registroGuia",      component: RegistroGuia,      meta: { publicRoutes: true }},
  { path: "/crearTur",           name: "crearTur",          component: CraerTur},
  { path: "/vistaTur/:id",       name: "vistaTur",          component: VistaTur},
  { path: "/editarTur/:id",      name: "editarTur",         component: EditarTur},
  { path: "/ajustes",            name: "ajustes",           component: Ajustes,           meta: { requiresAuth: true }},
  { path: "/pago",               name: "pago",              component: Pago,              meta: { requiresAuth: true }},
  { path: "/provincia/:id",      name: "ProvinciasVistas",  component: ProvinciasVistas,  meta: { requiresAuth: true }},
  { path: "/lugar/:id",          name: "LugaresVistas",     component: LugaresVistas,  meta: { requiresAuth: true }},
  { path: "/inicioguia",         name: "inicioGuia",        component: InicioGuiaVista,  meta: { requiresAuth: true }},
  { path: "/vistaReserva", name: "vistaReserva",    component: VistaReserva,  meta: { requiresAuth: true }},
  { path: "/reservaDetalle/:id", name: "reservaDetalle",    component: VistaTourUsuario,  meta: { requiresAuth: true }},
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

function isValidToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
   // console.error("Error al verificar el token:", error);
    return false;
  }
}

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  //console.log("Token en localStorage:", token); 
  
  const isAuthenticated = token !== null && isValidToken(token);
 // console.log("isAuthenticated:", isAuthenticated);

  if (isAuthenticated) {
    const decodedToken = decodeJWT(token);
   // console.log("Decoded token:", decodedToken);
    const userRole = decodedToken.rols;

   // console.log("Rol del usuario (decodificado):", userRole); 
    
    if (userRole === "guia" && to.path === "/") {
      //console.log("Redirigiendo a la vista de guía...");
      return next("/inicioguia");
    }
  }

  if (!isAuthenticated && to.matched.some(record => record.meta.requiresAuth)) {
   // console.log("No autenticado, redirigiendo a login...");
    return next("/login");
  }

 // console.log("Navegando a:", to.path); 
  next();
});

export default router;