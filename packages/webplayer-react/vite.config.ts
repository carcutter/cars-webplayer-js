import path from "path";

import react from "@vitejs/plugin-react";
import chalk from "chalk";
import { defineConfig } from "vite";

const logMock = (name: string, warn?: string) => {
  let msg = `🎭 using ${chalk.blue(name)} mock`;
  if (warn) {
    msg += ` ${chalk.yellow(warn)}`;
  }
  // eslint-disable-next-line no-console
  console.info(msg);
};
const pathToDir = (dir: string) => path.resolve(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isBuild = command === "build";

  let mockZod: boolean;
  let mockReactQuery: boolean;

  switch (mode) {
    case "development":
    case "safe":
      mockZod = false;
      mockReactQuery = false;
      break;
    case "light":
      mockZod = true;
      mockReactQuery = true;
      break;
    case "production":
      mockZod = true;
      mockReactQuery = false;
      break;
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }

  const mocksAlias: Record<string, string> = {};
  if (mockZod) {
    logMock("Zod", "Be sure that types are in sync with the Backend");

    mocksAlias["zod"] = pathToDir("./mock_modules/zod.mock.ts");
  }
  if (mockReactQuery) {
    logMock("React-Query");

    mocksAlias["@tanstack/react-query"] = pathToDir(
      "./mock_modules/react-query.mock.tsx"
    );
  }

  return {
    resolve: {
      alias: {
        "@/components": pathToDir("./src/components"),
        "@/const": pathToDir("./src/const"),
        "@/hooks": pathToDir("./src/hooks"),
        "@/lib": pathToDir("./src/lib"),
        "@/providers": pathToDir("./src/providers"),
        "@/types": pathToDir("./src/types"),
        "@/utils": pathToDir("./src/utils"),

        ...mocksAlias,
      },
    },
    plugins: [react()],

    // BUILD
    define: {
      "process.env": {
        NODE_ENV: isBuild ? "production" : "development",
      },
    },
    // TODO: Find a way to build in watch mode. The simple script "watch": "vite build --watch" does not work because it does not rebuild the TS.
    build: {
      lib: {
        entry: "./src/index.wc.tsx",
        name: "cc-web-player",
        fileName: format => {
          switch (format) {
            case "umd":
              return "bundle.js";
            default:
              return `cc-web-player.${format}.js`;
          }
        },
      },
      target: "esnext",
      copyPublicDir: false, // The only public file is mock data
    },
  };
});
