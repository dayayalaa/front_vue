import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/InicioVista.vue";
import Crear from "../views/ArmarViajeVista.vue";
import Resultados from "../views/ResutadoVista.vue";
import Perfil from "../views/PerfilVista.vue";
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

const routes = [
  { path: "/",                   name: "Home",               component: HomeView },
  { path: "/crear",              name: "Crear",              component: Crear },
  { path: "/resultados",         name: "Resultados",         component: Resultados },
  { path: "/perfil",             name: "Perfil",             component: Perfil },
  { path: "/guiasTarjetas",      name: "GuiasTarjetas",      component: GuiasTarjetas },
  { path: "/guias/:id",          name: "GuiasPerfilVista",   component: GuiasPerfilVista },
  { path: "/listas",             name: "Listas",             component: Listas },
  { path: "/itinerario/:id",     name: "ItinerarioDetalle",  component: ItinerarioDetalle,},
  { path: '/arcana/lugares/:id', name: 'lugarDetalle',       component: DestinosArcana, },
  { path: '/hoteles',            name: 'opcionesHoteles',    component: HotelesVista},
  { path: '/login',              name: 'login',              component: InicioSesion},
  { path: '/opcion',             name: 'opcion',             component: OpcionInicio},
  { path: '/registroUsuario',    name: 'registroUsuario',    component: Registro},
  { path: '/registroGuia',    name: 'registroGuia',    component: RegistroGuia},
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
