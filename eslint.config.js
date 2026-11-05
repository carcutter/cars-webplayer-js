// ESLint config of the whole repo: each package's `lint` script runs eslint,
// which finds this file from the package folder

import path from "node:path";

import react from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
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

/** Packages and apps styled with Tailwind (from their src/index.css) */
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
    plugins: { perfectionist, "unused-imports": unusedImports },
    rules: {
      "no-console": "error",

      // The groups of eslint-plugin-import's import/order, which doesn't
      // support ESLint 10. Unlike it, the fix moves imports across side-effect
      // imports: disable it in the files where their order matters
      "perfectionist/sort-imports": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          internalPattern: ["^@/", "^@car-cutter/"],
          newlinesBetween: 1,
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
    {
      plugins: {
        "@eslint-react": react,
        "react-hooks": reactHooks,
      },
      rules: {
        // The rules of eslint-plugin-react's recommended config (replaced as
        // it doesn't support ESLint 10), not the React 19 and React Compiler
        // ones of @eslint-react's: the player supports React 16.8. TypeScript
        // covers undefined names and duplicate props; no longer checked:
        // unescaped entities in JSX text, string refs, isMounted, the other
        // deprecated APIs (unmountComponentAtNode...), and target="_blank"
        // links with a dynamic href
        "@eslint-react/no-missing-key": "error",
        "@eslint-react/jsx-no-comment-textnodes": "error",
        "@eslint-react/jsx-no-children-prop": "error",
        "@eslint-react/no-direct-mutation-state": "error",
        "@eslint-react/no-component-will-mount": "error",
        "@eslint-react/no-component-will-receive-props": "error",
        "@eslint-react/no-component-will-update": "error",
        "@eslint-react/dom-no-dangerously-set-innerhtml-with-children": "error",
        "@eslint-react/dom-no-find-dom-node": "error",
        "@eslint-react/dom-no-hydrate": "error",
        "@eslint-react/dom-no-render": "error",
        "@eslint-react/dom-no-render-return-value": "error",
        "@eslint-react/dom-no-unknown-property": "error",
        "@eslint-react/dom-no-unsafe-target-blank": "error",

        // The rules of hooks: not the React Compiler ones of
        // eslint-plugin-react-hooks 7, which the code isn't written for
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  ]),
  ...scoped(
    // Renders with React 16.8 / 17, whose ReactDOM.render isn't deprecated
    ["packages/core-wc-react-16-17"],
    [{ settings: { "react-x": { version: "17.0.0" } } }]
  ),
  {
    // The player's styles are built from core-ui's src/index.css: a CSS
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
              message: "Import it in packages/core-ui/src/index.css",
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
        tailwind.configs.recommended,
        {
          settings: {
            tailwindcss: {
              cssConfigPath: path.join(
                import.meta.dirname,
                dir,
                "src/index.css"
              ),
              functions: ["cn"],
            },
          },
        },
      ]
    )
  ),
  ...scoped(
    ["packages/core-ui"],
    [
      {
        rules: {
          // The playground (dev/) has its own stylesheet
          "tailwindcss/no-custom-classname": [
            "warn",
            { whitelist: ["pg(-[\\w-]+)?"] },
          ],
        },
      },
    ]
  ),

  prettier,
];
