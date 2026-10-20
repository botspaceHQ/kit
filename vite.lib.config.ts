import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Builds the @botspace/kit package into dist/: one ES module per source file, every
// dependency left external. Run by scripts/build-lib.ts, which also writes the types and styles.css.
const local = (id: string) => id.startsWith(".") || id.startsWith("/") || id.startsWith("@/") || id.startsWith("\0")

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    copyPublicDir: false,
    minify: false,
    sourcemap: true,
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) => !local(id),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        banner: '"use client";',
      },
    },
  },
})
