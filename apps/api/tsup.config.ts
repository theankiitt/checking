import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    target: "node20",
    platform: "node",
    bundle: true,
    noExternal: ["@prisma/client", "prisma"],
    esbuildOptions(options) {
      options.alias = {
        "@": "./src",
      };
    },
  },
  {
    entry: ["src/scripts/seedAdmin.ts"],
    format: ["cjs"],
    dts: false,
    splitting: false,
    sourcemap: false,
    clean: false,
    outDir: "dist/scripts",
    target: "node20",
    platform: "node",
    bundle: true,
    noExternal: ["@prisma/client", "prisma", "bcryptjs", "dotenv"],
    esbuildOptions(options) {
      options.alias = {
        "@": "./src",
      };
    },
  },
]);
