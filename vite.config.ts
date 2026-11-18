import { defineConfig } from "vite";

// Root domain (<username>.github.io) serves from "/".
// If deploying to a project subpath (<username>.github.io/<repo>/), change base to "/<repo>/".
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
