import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import pkg from 'tdd-guard-vitest';
const { VitestReporter } = pkg;


// https://vitejs.dev/config/
export default defineConfig({
   test: {
    reporters: ['default', new VitestReporter()],
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
