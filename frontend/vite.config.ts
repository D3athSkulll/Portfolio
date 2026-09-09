import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// When VITE_STATIC_DATA=true (set by the Vercel build) the app fetches the JSON
// data files directly as static assets instead of hitting the Axum /api/*
// routes. Local dev and the single-binary/Docker build leave it unset.
const STATIC_DATA = process.env.VITE_STATIC_DATA === "true";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "import.meta.env.VITE_STATIC_DATA": JSON.stringify(STATIC_DATA ? "true" : ""),
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8080",
      "/blog-assets": "http://localhost:8080",
    },
  },
});
