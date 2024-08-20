const path = require("path");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "@car-cutter/eslint-config/react.json",
    "plugin:tailwindcss/recommended",
  ],

  settings: {
    tailwindcss: {
      config: path.join(__dirname, "./tailwind.config.ts"),
    },
  },
};
