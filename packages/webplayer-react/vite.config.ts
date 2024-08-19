import path from "path";

import react from "@vitejs/plugin-react";
import chalk from "chalk";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

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

  // TODO
  // const mocksAlias: Record<string, string> = {};
  // if (mockZod) {
  //   logMock("Zod", "Be sure that types are in sync with the Backend");

  //   mocksAlias["zod"] = pathToDir("../../mock_modules/zod.mock.ts");
  // }
  // if (mockReactQuery) {
  //   logMock("React-Query");

  //   mocksAlias["@tanstack/react-query"] = pathToDir(
  //     "../../mock_modules/react-query.mock.tsx"
  //   );
  // }

  return {
    plugins: [
      react(),
      dts({
        tsconfigPath: pathToDir("./tsconfig.app.json"),
        rollupTypes: true,
      }),
    ],

    // TODO
    // resolve: { alias: mocksAlias },

    // BUILD
    define: {
      "process.env": {
        NODE_ENV: isBuild ? "production" : "development",
      },
    },
    // FUTURE: Find a way to build in watch mode. The simple script "watch": "vite build --watch" does not work because it does not rebuild the TS.
    build: {
      lib: {
        name: "react-webplayer",
        fileName: "index",
        entry: pathToDir("./index.ts"),
      },
      copyPublicDir: false, // The only public file is mock data

      rollupOptions: {
        external: ["react", "@tanstack/react-query", "zod"],
        output: {
          globals: {
            react: "React",
            "@tanstack/react-query": "ReactQuery",
            zod: "Zod",
          },
        },
      },
      //       Maybe peerDependencies ? Find example on https://github.com/bitovi/react-to-web-component
    },
  };
});
