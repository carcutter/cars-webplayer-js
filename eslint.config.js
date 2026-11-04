// ESLint config of the whole repo: each package's `lint` script runs eslint,
// which finds this file from the package folder

import path from "node:path";

import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tailwind from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

/** The linted files (the other ones, JS configs and scripts, aren't) */
const FILES = ["**/*.ts", "**/*.tsx"];

/** Packages and apps written with React (JSX, hooks) */
const REACT = [
  "apps/showroom/**",
  "packages/core-ui/**",
  "packages/core-wc/**",
  "packages/core-wc-react-*/**",
  "packages/webplayer-next/**",
  "packages/webplayer-react/**",
];

/** Packages and apps styled with Tailwind (with a tailwind.config.ts) */
const TAILWIND = ["apps/showroom", "packages/core-ui"];

/** Applies configs to the given files only */
const only = (files, configs) => configs.map(config => ({ ...config, files }));

/** Applies configs to the linted files of some folders only */
const scoped = (dirs, configs) =>
  only(
    dirs.flatMap(dir => FILES.map(file => `${dir}/${file}`)),
    configs
  );

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/coverage/",
      "**/*.{js,mjs,cjs,jsx}",
    ],
  },

  ...only(FILES, [
    js.configs.recommended,
    ...tsPlugin.configs["flat/recommended"],
  ]),
  {
    files: FILES,

    languageOptions: {
      parser: tsParser,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { import: importPlugin, "unused-imports": unusedImports },
    settings: {
      "import/internal-regex": "^(@/|@car-cutter/)",
    },

    rules: {
      "no-console": "error",

      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
        },
      ],
      "unused-imports/no-unused-imports": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  ...scoped(REACT, [
    react.configs.flat.recommended,
    {
      plugins: { "react-hooks": reactHooks },
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        // The rules of hooks: not the React Compiler ones of
        // eslint-plugin-react-hooks 7, which the code isn't written for
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",

        "react/react-in-jsx-scope": "off",
        "react/display-name": "off",
        "react/prop-types": "off",
      },
    },
  ]),
  ...scoped(
    // Renders with React 16.8 / 17, whose ReactDOM.render isn't deprecated
    ["packages/core-wc-react-16-17"],
    [{ settings: { react: { version: "17.0" } } }]
  ),
  {
    // The player's styles are built from core-ui's src/style.css: a CSS
    // import in the code bundled by the wrappers would be emitted as a
    // separate, unprocessed CSS file (`?inline` imports are strings)
    files: ["packages/**"],
    ignores: ["packages/core-ui/dev/**"],

    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["*.css"],
              message: "Import it in packages/core-ui/src/style.css",
            },
          ],
        },
      ],
    },
  },
  ...TAILWIND.flatMap(dir =>
    scoped(
      [dir],
      [
        ...tailwind.configs["flat/recommended"],
        {
          settings: {
            tailwindcss: {
              config: path.join(import.meta.dirname, dir, "tailwind.config.ts"),
              callees: ["cn"],
            },
          },
        },
      ]
    )
  ),

  prettier,
];
