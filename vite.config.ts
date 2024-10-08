import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

console.log("Alias configuration:", path.resolve(__dirname, "src"));
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
});
