import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8085",
      "/auth": "http://localhost:8085",
      "/analytics": "http://localhost:8085"
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js"
  }
});
