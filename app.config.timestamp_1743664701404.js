// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "unenv";
var app_config_default = defineConfig({
  tsr: {
    appDirectory: "src"
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"]
      }),
      tailwindcss()
    ],
    ser
  },
  server: {
    preset: "cloudflare-pages",
    unenv: cloudflare
  }
});
export {
  app_config_default as default
};
