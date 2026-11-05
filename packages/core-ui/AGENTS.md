# @car-cutter/core-ui

The player itself (React), bundled from its sources by `react-webplayer` and `wc-webplayer` (the other wrappers depend on them). Its own build outputs only the stylesheet, `dist/style.css`.

- Try changes in the playground: `pnpm dev --port <n>` from the repo root (`dev/`, `index.html`); `pnpm dev:core-preact --port <n>` runs it on preact, as the web component build does. Its `shadowDom` checkbox renders the player in a shadow root with the inlined styles, as `<cc-webplayer>` does.
- `src/index.css` is the only stylesheet: Tailwind (scanning this folder's `src/` only), pannellum's styles (both imported first), the theme (`@theme inline reference`), the breakpoints (`@custom-variant`), the custom utilities, and last the overrides of pannellum's styles. It is built by `@tailwindcss/vite` and post-processed by `tailwindCompat` (`vite.config.ts`) for the shadow root and older browsers.
- The playground (`dev/`) has its own stylesheet, `dev/index.dev.css`, and `pg-*` classes; it isn't part of the build.
- No unit tests here: UI changes are checked with `pnpm build` then `pnpm e2e` from the root.
- Conventions of the components and classes: [`docs/agents/conventions.md`](../../docs/agents/conventions.md).
