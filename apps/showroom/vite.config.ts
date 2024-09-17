import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // We need to set the base path because the app' is stored in a S3 and not simply served from the root of the domain
    base: command === "build" ? "/web-player/v3/" : "",

    build: {
      target: browserslistToEsbuild(),
    },
  };
});
