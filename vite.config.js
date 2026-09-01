import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base : "/" en local, "/<nom-du-depot>/" sur GitHub Pages.
// Le workflow de deploiement renseigne VITE_BASE automatiquement.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/",
});
