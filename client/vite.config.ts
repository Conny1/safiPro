// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies:"injectManifest",
      injectRegister:"auto",
      srcDir:"src/sw",
      filename:"service-worker.js",
      registerType: "autoUpdate", // handles update checking
      devOptions:{enabled:true, type:"module" },
      workbox:{
        navigateFallback:"/index.html"
      },
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        id: "/dashboard",
        name: "SafiPro",
        short_name: "SafiPro",
        description: "Manage laundry operations efficiently.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/dashboard",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
