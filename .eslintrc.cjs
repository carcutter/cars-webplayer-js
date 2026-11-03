// ESLint config of the whole repo: each package's `lint` script runs eslint,
// which finds this file from the package folder

const path = require("path");

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

/** @type {import("eslint").Linter.LegacyConfig} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: { browser: true, es2020: true, node: true },

  ignorePatterns: ["node_modules/", "dist/", "coverage/"],

  extends: ["eslint:recommended", "prettier"],

  plugins: ["import", "unused-imports"],

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
  },

  overrides: [
    {
      files: ["*.ts", "*.tsx"],

      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
      },
    },
    {
      files: REACT,

      extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        "react/react-in-jsx-scope": "off",
        "react/display-name": "off",
        "react/prop-types": "off",
      },
    },
    ...TAILWIND.map(dir => ({
      files: [`${dir}/**`],

      extends: ["plugin:tailwindcss/recommended"],
      settings: {
        tailwindcss: {
          config: path.join(__dirname, dir, "tailwind.config.ts"),
          callees: ["cn"],
        },
      },
    })),
  ],
};
