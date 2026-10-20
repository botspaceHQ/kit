import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Builds the design-system bundle: one classic script (IIFE) that reads window.React and
// window.ReactDOM and sets window.BotSpaceKit, plus one stylesheet. Run by scripts/build-ds.ts.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  resolve: {
    alias: [
      { find: /^react\/jsx-(dev-)?runtime$/, replacement: resolve(import.meta.dirname, "ds/jsx-runtime-shim.ts") },
      { find: "@", replacement: resolve(import.meta.dirname, "./src") },
    ],
  },
  build: {
    outDir: "ds-dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(import.meta.dirname, "ds/entry.tsx"),
      name: "BotSpaceKit",
      formats: ["iife"],
      fileName: () => "bundle.js",
      cssFileName: "bundle",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-dom/client"],
      output: {
        globals: { react: "React", "react-dom": "ReactDOM", "react-dom/client": "ReactDOM" },
        footer: "window.BotSpaceKit = BotSpaceKit;",
      },
    },
  },
})
