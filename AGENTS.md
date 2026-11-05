# AGENTS.md

Guidance for AI agents working in **cars-webplayer-js**, the CarCutter WebPlayer: a player of a car's medias (photos, 360s, videos, hotspots) loaded from a composition URL. It is one React app (`packages/core-ui`) rendered by a web component, `<cc-webplayer>`, in a closed shadow root, and published as wrappers for React, Next, Vue, Angular, web components, vanilla JS, and a CDN script.

Humans' rules (commit format, browser support) are in [`CONTRIBUTING.md`](CONTRIBUTING.md); the user docs of the packages are in `apps/docs` (Docusaurus).

## Stack

- pnpm workspace (`apps/*`, `packages/*`) driven by turbo; Node 22.14 in CI, pnpm from `packageManager`.
- TypeScript ~6 (strict), Vite 8 with Rolldown (library builds), ng-packagr for Angular.
- React for the player, rendered with React 18+ (`createRoot`), React 16/17 (`render`), or preact through `preact/compat` aliases (web component build).
- Tailwind CSS 4, configured in CSS (`packages/core-ui/src/index.css`).
- Vitest + happy-dom (unit), Playwright (e2e, consumer apps).

## Commands

```sh
pnpm install
pnpm dev --port 4190           # core-ui playground (vite; 5173 without --port)
pnpm demo                      # every demo app, ports 4170-4179 (index: http://localhost:4170)
pnpm demo:wc                   # one demo: index, react, react-legacy, next, vanilla, script, wc, vue, angular, iframe
pnpm build                     # every package (turbo)
pnpm turbo build --filter=@car-cutter/core-ui   # one package and what it depends on
pnpm lint                      # per package: eslint and/or tsc (see gotchas.md); pnpm build also type-checks
pnpm test                      # vitest with 100% coverage thresholds, per package
pnpm --filter @car-cutter/core-wc exec vitest run src/utils.test.ts              # one file
pnpm --filter @car-cutter/demo exec vitest run src/constants.test.ts -t "away from vite"   # one test
pnpm e2e                       # Playwright on the demos (starts their dev servers)
pnpm test:consumers            # packs the npm packages, installs them in consumers/* apps, tests them
pnpm run ci                    # frozen install + syncpack lint + build + lint, as CI
```

`lint` and `test` build the workspace packages they read first (turbo `^build`). Run `pnpm build` yourself before `pnpm e2e`, `pnpm test:consumers` or a direct `exec vitest`: they read the existing `dist`.

## Repository map

| Path                                               | What                                                                                                                                     |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/core`                                    | Props, event names, defaults, tags, types shared by everything (private, source)                                                         |
| `packages/analytics`                               | Analytics ids and event subscription (private)                                                                                           |
| `packages/core-ui`                                 | The player: React components, providers, hooks, and its stylesheet `src/index.css` (private; its build is the CSS only)                  |
| `packages/core-wc`                                 | `createElementClass`: the custom elements, their attributes, the shadow root (private)                                                   |
| `packages/core-wc-react-18`, `core-wc-react-16-17` | The two React renderers of the elements (private)                                                                                        |
| `packages/webplayer-*`                             | Published wrappers: `react`, `next`, `vue`, `angular`, `wc`, `vanilla`; `script` is the CDN bundle (private, `dist/bundle-<version>.js`) |
| `packages/config-typescript`                       | Shared tsconfigs                                                                                                                         |
| `packages/demo`                                    | Shared code of the demo apps: themes, ports, event log                                                                                   |
| `apps/demo-*`                                      | One demo per wrapper, on the built packages                                                                                              |
| `apps/e2e`                                         | Playwright tests of the demos, the CDN files and the consumer apps                                                                       |
| `apps/showroom`                                    | Internal showroom app (React wrapper, its own Tailwind)                                                                                  |
| `apps/docs`                                        | User documentation (Docusaurus, GitHub Pages)                                                                                            |
| `consumers/`                                       | Minimal client apps (outside the workspace), installed from packed tarballs by `scripts/consumer-test.js`                                |

## Rules

- Change a prop or an event everywhere it is listed: the core, the element's attribute list, each wrapper, the docs, the demos. Follow [`docs/agents/workflows.md`](docs/agents/workflows.md).
- Put CSS in `packages/core-ui/src/index.css`, the only stylesheet of the player; the code of the packages imports it as a string (`?inline`), never as a CSS import.
- Check UI changes in the shadow root (playground `shadowDom` checkbox, `demo:wc`), and on an old browser when they bring newer CSS (`CONTRIBUTING.md`, "Browser support").
- Keep every `@car-cutter/*` dependency `workspace:^` and the versions consistent: `pnpm syncpack:lint`.
- Leave alone: `dist/`, `coverage/`, the package versions (bumped by hand in release commits), `apps/demo-next/AGENTS.md` (Next's), `pnpm-lock.yaml` except through pnpm.
- Start dev servers on 4190 or another free port above the consumer previews: 5173 is vite's default (other apps of the team run there), 4170-4179 are the demos', 4180 and up the consumer previews' (one per `consumers/*` app).
- Format the source files you change with Prettier (`pnpm exec prettier --write <files>`), not `pnpm-lock.yaml`; some existing files aren't formatted, leave them.
- Commits and PR titles are Conventional Commits; PRs are squashed into `develop`, so the PR title is the commit (checked by `.github/workflows/pr-title.yml`).
- Write a PR's body with every section of `.github/PULL_REQUEST_TEMPLATE.md`, filled or deleted as it says (`gh pr create --body` doesn't apply the template), and link its GitHub issue, if there is one, with `Closes #<n>`.

Before calling a change done: `pnpm run ci` and `pnpm test` pass; add `pnpm e2e` for a change of the player or the demos, and `pnpm test:consumers` for a change of a published package (its code, exports, build or dependencies).

## More

- [`docs/agents/architecture.md`](docs/agents/architecture.md): read before changing how the element, the renderers, the providers or the styles fit together.
- [`docs/agents/conventions.md`](docs/agents/conventions.md): read before writing code in `packages/*`.
- [`docs/agents/testing.md`](docs/agents/testing.md): read before writing or running tests.
- [`docs/agents/workflows.md`](docs/agents/workflows.md): recipes: a prop, an event, a UI change, a dependency.
- [`docs/agents/gotchas.md`](docs/agents/gotchas.md): read when a command, a build or a test behaves unexpectedly.
- `packages/core-ui/AGENTS.md`, `packages/webplayer-angular/AGENTS.md`: specifics of these packages.
