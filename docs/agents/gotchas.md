# Gotchas

## Commands

- `pnpm build --filter=<pkg>` fails (`tsc` unknown option, `rm` missing file...): the root `build` script ends with `--`, so the flag is appended to every package's build command. Use `pnpm turbo build --filter=<pkg>` or a `pnpm build:<name>` script.
- `lint` differs per package: ESLint and `tsc` in `core-ui` and `webplayer-angular`, ESLint only in the other packages and `apps/showroom`, `tsc --noEmit` (`vue-tsc` in `demo-vue`) only in `packages/demo`, the demo apps and `apps/e2e`, nothing in `apps/docs` and `packages/config-typescript`. `pnpm build` type-checks the rest.
- `lint`, `test` and `dev` depend on `^build` (turbo). The private packages resolve to their TypeScript sources, but core-ui's `style.css` and the published wrappers resolve to their `dist`, and the wrappers' declarations are built: a direct `pnpm --filter <pkg> exec ...`, `pnpm e2e` or `pnpm test:consumers` doesn't build, and a stale `dist` gives results from the old code.
- The `test` scripts run with `--coverage` and 100% thresholds: a single file run through them fails on coverage. Use `exec vitest run <file>` ([`testing.md`](testing.md)).
- There is no format script, and some existing files aren't Prettier-formatted (`pnpm-lock.yaml` among them, which only pnpm writes): `prettier --write .` would rewrite unrelated files. Format the files you change only.

## Ports

- `pnpm dev` (core-ui playground) runs on vite's 5173, which other apps of the team use too: pass `--port <n>` (`pnpm dev --port 4190`; with `-- --port` vite gets a stray `--` and ignores the port). The demos use 4170-4179 (`packages/demo/src/ports.ts`): the vite ones with `strictPort`, while `demo-next` and `demo-angular` set theirs in their `dev` script (the Angular CLI asks for another port when it is taken), the consumer previews 4180 and up.
- Leave a process you didn't start running, even on these ports: check its working directory first (`lsof -p <pid> | grep cwd`).

## Packages

- `@car-cutter/core-ui` exports its TypeScript sources (`"."` → `index.ts`); its build outputs only `dist/style.css` (`"./style.css"`). A change of core-ui reaches a wrapper only when the wrapper is rebuilt.
- The player renders in a **closed** shadow root: the host page's CSS doesn't reach it, tests can't query inside it, only inherited CSS variables (`--cc-webplayer-*`) and `composed` events cross it.
- `packages/**` can't import `.css` files (ESLint): only `?inline` strings, as `packages/core-wc/src/webplayer.tsx` does. A CSS import would be emitted as a separate, unprocessed file in the wrappers' builds.
- `webplayer-wc` (and so vue, angular, vanilla, script) runs the player on preact (`react` aliased to `preact/compat` in its `vite.config.ts`). Test React-specific APIs in core-ui with `pnpm dev:core-preact --port 4190` too.
- `core-wc-react-16-17` uses the legacy `ReactDOM.render` (an ESLint exemption allows its deprecation), has no build, and is bundled by `react-webplayer/legacy`.
- `webplayer-angular` builds with its own Angular ~19.2 and TypeScript ~5.8: [`packages/webplayer-angular/AGENTS.md`](../../packages/webplayer-angular/AGENTS.md).
- `webplayer-vue` builds its declarations against Vue 3.3 (`vue-3.3` alias, `npm:vue@~3.3`), the lowest it supports.
- `react-webplayer` and `next-webplayer` declare no `peerDependencies` though they build with React external: intended (`.syncpackrc`, "publishable wrappers omit them"), keep it so. `vue-webplayer` and `angular-webplayer` do declare their framework as a peer.
- The CDN bundle's file name comes from the version: `packages/webplayer-script/dist/bundle-<version>.js`; the script demo serves the newest one.

## Dependencies

- `apps/demo-react-legacy` runs React 17 next to the React 18/19 of the rest; its vite config dedupes React, and `.syncpackrc` ignores its versions.
- `pnpm-workspace.yaml` `packageExtensions` gives `next` the React types it imports without declaring them; keep it when upgrading next.
- `demo-angular` uses an injected copy of `angular-webplayer` (`dependenciesMeta.injected`), refreshed after its build (`syncInjectedDepsAfterScripts`); turbo doesn't cache that build (`packages/webplayer-angular/turbo.json`).

## Styles

- `tailwindCompat` (`packages/core-ui/vite.config.ts`) fails the build on a color with an opacity it can't rewrite (`Opaque without color-mix()`): use a theme color of the `hsl(var(--x))` form.
- The theme block of `src/index.css` is `@theme inline reference`: some theme keys have the name of the runtime variable they read (`--radius-ui: var(--radius-ui)`), which would be a cycle if Tailwind output them.
- `translate-*` / `scale-*` utilities write the `translate` / `scale` CSS properties (Tailwind 4). `transition-transform` covers them; an arbitrary list must name them (`transition-[opacity,translate]`), `transform` alone misses them.
