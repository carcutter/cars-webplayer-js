/**
 * The browsers the player's CSS is minified for, in its build and in the
 * wrappers inlining it: the oldest ones its styles support (CONTRIBUTING.md,
 * "Browser support"). Vite's default, from browserslist, would let Lightning
 * CSS write syntax they don't know, like media query ranges (`width>=1280px`)
 */
export const CSS_TARGET = [
  "chrome99",
  "edge99",
  "firefox97",
  "safari15.4",
  "ios15.4",
];
