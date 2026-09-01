import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 5173,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core", "three"],
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        /**
         * Split the heavy third-party libraries into their own long-lived
         * chunks. Two reasons:
         *
         *  - A visitor who never opens a 3D section never downloads Spline or
         *    three.js at all (those chunks are only referenced from lazily
         *    imported components).
         *  - Vendor code changes far less often than app code, so these chunks
         *    stay in the browser cache across deploys.
         */
        manualChunks(id) {
          // Vite's dynamic-import preload helper is a tiny virtual module that
          // the entry imports statically. If Rollup parks it inside a heavy
          // vendor chunk, that whole chunk becomes a static dependency of the
          // entry and gets <link modulepreload>-ed — which silently undoes the
          // lazy loading. Pin it to the react chunk, which is eager anyway.
          if (id.includes("vite/preload-helper") || id.includes("\0vite/")) {
            return "vendor-react";
          }

          if (!id.includes("node_modules")) return;

          // Match on the package boundary, not a bare substring: "/react/"
          // alone also matches paths like `some-lib/dist/react/index.js` and
          // quietly welds unrelated packages into the wrong chunk.
          const pkg = (name: string) => id.includes(`node_modules/${name}/`);

          if (pkg("@splinetool/react-spline") || id.includes("node_modules/@splinetool/"))
            return "vendor-spline";
          if (pkg("three") || id.includes("node_modules/@react-three/")) return "vendor-three";
          if (pkg("ogl")) return "vendor-ogl";
          if (id.includes("node_modules/@firebase/") || pkg("firebase")) return "vendor-firebase";
          if (pkg("framer-motion") || pkg("motion-dom") || pkg("motion-utils"))
            return "vendor-motion";
          if (pkg("gsap") || id.includes("node_modules/@gsap/")) return "vendor-gsap";
          if (pkg("recharts") || id.includes("node_modules/d3-")) return "vendor-charts";
          if (pkg("swiper") || pkg("embla-carousel-react") || pkg("embla-carousel"))
            return "vendor-carousel";
          if (id.includes("node_modules/@radix-ui/")) return "vendor-radix";
          if (pkg("react-router") || pkg("react-router-dom") || id.includes("node_modules/@remix-run/"))
            return "vendor-router";
          if (pkg("react") || pkg("react-dom") || pkg("scheduler")) return "vendor-react";

          // Everything else is deliberately left to Rollup's own splitting.
          // A catch-all `return "vendor"` merges libraries that nothing on the
          // landing page uses into one chunk the entry then depends on — which
          // is how 730 kB of three.js ended up preloaded on the home page.
          return undefined;
        },
      },
    },
  },
}));
