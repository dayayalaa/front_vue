// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Arcana",
        short_name: "Arcana",
        description:
          "Arcana es una solución integral para facilitar la planificación de viajes. Permite reservar vuelos y hoteles, planificar itinerarios y descubrir nuevos destinos, todo desde un solo lugar, simplificando el proceso de organización y promoviendo el turismo local.",
        start_url: "/",
        display: "standalone",
        background_color: "#F7F5EB",
        theme_color: "#3C4A28",
        icons: [
          {
            src: "/icono/icon_192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icono/icon_512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "/icono/pantalla_930x1920.png",
            sizes: "930x1920",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/front-vue-omega\.vercel\.app/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
