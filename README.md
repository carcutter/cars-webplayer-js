<div align="center">

<img src="./.github/assets/logo.svg" alt="CarCutter WebPlayer" width="72" height="72" />

# CarCutter WebPlayer

**One player for every vehicle's medias, in every web stack.**

Photos, 360° spins, videos and hotspots of a car, loaded from a single composition URL — and shipped for React, Next.js, Vue, Angular, Web Components, vanilla JS and a CDN script.

<p>
  <a href="https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_integration.yml"><img alt="Continuous Integration" src="https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_integration.yml/badge.svg" /></a>
  <a href="https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_delivery.yml"><img alt="Continuous Delivery" src="https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_delivery.yml/badge.svg" /></a>
  <a href="https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_deployment.yml"><img alt="Continuous Deployment" src="https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_deployment.yml/badge.svg" /></a>
  <a href="https://github.com/carcutter/cars-webplayer-js/actions/workflows/pr-title.yml"><img alt="PR Title" src="https://github.com/carcutter/cars-webplayer-js/actions/workflows/pr-title.yml/badge.svg" /></a>
</p>

<p>
  <a href="https://www.npmjs.com/package/@car-cutter/react-webplayer"><img alt="npm" src="https://img.shields.io/npm/v/@car-cutter/react-webplayer?label=npm&color=1B5DF5&logo=npm" /></a>
  <img alt="React" src="https://img.shields.io/badge/React-16.8%2B-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white" />
  <img alt="pnpm" src="https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm&logoColor=white" />
</p>

**[📖 Documentation](https://carcutter.github.io/cars-webplayer-js/)**

</div>

---

## Overview

The WebPlayer is one React app (`packages/core-ui`) rendered by a web component, `<cc-webplayer>`, in a closed shadow root, so the host page's styles never leak in. Thin wrappers publish that element for each framework, and a CDN bundle serves pages without a build step.

## Features

- **🖼️ Carrousel & gallery** — Swipe through every media, with an optional permanent gallery and infinite navigation.
- **🔄 360° spins** — Exterior, NextGen and interior 360s, with a demo spin, reversible rotation and lazy loading.
- **📍 Hotspots** — Damage and feature hotspots placed on the medias.
- **🗂️ Categories** — Category navigation (top bar or burger menu), filterable per integration.
- **⚡ Load strategies** — `quality`, `balanced` or `speed`, with configurable preload range and media widths.
- **🎨 Themable** — CSS variables and built-in themes, isolated in a shadow root.
- **📡 Events & analytics** — Prefixed DOM events for every interaction, plus optional analytics and monitoring.

## Packages

| Package                                                                                        | For                                                                      |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`@car-cutter/react-webplayer`](https://www.npmjs.com/package/@car-cutter/react-webplayer)     | React 18+ (`/legacy` for React 16.8 – 17)                                |
| [`@car-cutter/next-webplayer`](https://www.npmjs.com/package/@car-cutter/next-webplayer)       | Next.js                                                                  |
| [`@car-cutter/vue-webplayer`](https://www.npmjs.com/package/@car-cutter/vue-webplayer)         | Vue 3.3+                                                                 |
| [`@car-cutter/angular-webplayer`](https://www.npmjs.com/package/@car-cutter/angular-webplayer) | Angular 19+                                                              |
| [`@car-cutter/wc-webplayer`](https://www.npmjs.com/package/@car-cutter/wc-webplayer)           | Web Component, framework-agnostic                                        |
| [`@car-cutter/vanilla-webplayer`](https://www.npmjs.com/package/@car-cutter/vanilla-webplayer) | Vanilla JS                                                               |
| CDN script                                                                                     | `<script src="https://cdn.car-cutter.com/libs/web-player/v3/bundle.js">` |

## Quick Start

```bash
npm install @car-cutter/react-webplayer
```

```jsx
import { WebPlayer } from "@car-cutter/react-webplayer";

export const App = () => (
  <WebPlayer compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json" />
);
```

Without a bundler:

```html
<script src="https://cdn.car-cutter.com/libs/web-player/v3/bundle.js"></script>

<cc-webplayer
  composition-url="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
></cc-webplayer>
```

Every integration is described in the **[installation guides](https://carcutter.github.io/cars-webplayer-js/)**.

## Tech Stack

| Area     | Choice                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Player   | [React](https://react.dev), rendered with `createRoot` (18+), `render` (16/17) or [Preact](https://preactjs.com) (Web Component build) |
| Language | [TypeScript](https://www.typescriptlang.org) ~6, strict                                                                                |
| Build    | [Vite 8](https://vite.dev) (Rolldown) for the libraries, [ng-packagr](https://github.com/ng-packagr/ng-packagr) for Angular            |
| Styles   | [Tailwind CSS 4](https://tailwindcss.com), configured in `packages/core-ui/src/index.css`                                              |
| Monorepo | [pnpm](https://pnpm.io) workspace + [Turborepo](https://turborepo.com), [syncpack](https://github.com/JamieMason/syncpack)             |
| Tests    | [Vitest](https://vitest.dev) + happy-dom (unit), [Playwright](https://playwright.dev) (e2e, consumer apps)                             |
| Docs     | [Docusaurus](https://docusaurus.io), on GitHub Pages                                                                                   |
| Release  | [Changesets](https://github.com/changesets/changesets)                                                                                 |

## Getting Started

### Prerequisites

- **Node.js** 22.12+ (CI runs 22.14). See [how to install nvm on macOS](https://sukiphan.medium.com/how-to-install-nvm-node-version-manager-on-macos-d9fe432cc7db).
- **[pnpm](https://pnpm.io)** at the version of the `packageManager` field of `package.json`: `corepack enable` (from Node 25, corepack isn't bundled with Node anymore: install it first with `npm install -g corepack`).

### Installation

```bash
pnpm install
```

### Developing the WebPlayer

```bash
pnpm dev               # playground of packages/core-ui
pnpm dev:core-preact   # the same, on Preact like the web component
```

The playground renders the player from its sources, so a change in core-ui shows up as soon as it's saved, and lets you change:

- the props of the player (but the media widths and the deprecated analytics ones), and its children (custom medias, custom icon)
- the CSS variables
- where it's rendered: in the page, or in a shadow root with its inlined styles (as the web component renders it; the customizations stay React children)
- the width of its container. The breakpoints (`max-small`, `small`, `large`, shown in the header) follow the viewport: use the browser's device mode for them

The settings are kept in the URL, and the events the player dispatches are listed below it. The playground turns the `monitoring` prop off by default (the player's default is on): from localhost, the service refuses its events.

> **Local composition.** Vite serves the `/public` directory at `/` during development: `/public/composition_mock.json` is served at `/composition_mock.json`. Use that URL as the `compositionUrl`.

### Developing the documentation

```bash
pnpm dev:docs
```

## Scripts

| Command                       | Description                                                                 |
| ----------------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`                    | Start the core-ui playground                                                |
| `pnpm dev:docs`               | Start the documentation                                                     |
| `pnpm demo` / `pnpm demo:XX`  | Start every demo app, or one of them (see [Demos](#demos))                  |
| `pnpm build`                  | Build every package                                                         |
| `pnpm lint`                   | ESLint and/or type-check, per package                                       |
| `pnpm test`                   | Unit tests (Vitest), 100% coverage per package                              |
| `pnpm e2e` / `pnpm e2e:cdn`   | Playwright tests over the demo apps, or over the files published on the CDN |
| `pnpm test:consumers`         | Pack the npm packages and test them in the `consumers/` apps                |
| `pnpm run ci`                 | Frozen install + syncpack lint + build + lint, as CI                        |
| `pnpm analyze` (in a package) | Analyze the bundle size                                                     |

> **Bundle analysis.** The sourcemap seems to interfere with size calculation ([GitHub issue](https://github.com/KusStar/vite-bundle-visualizer/issues/8)). More info on the [vite-bundle-visualizer package page](https://www.npmjs.com/package/vite-bundle-visualizer).

## Testing

**Unit tests** — `pnpm test` runs the Vitest tests of `core-wc`, `core-wc-react-*` and the `webplayer-*` wrappers. Each package requires 100% coverage, and its report is written to its `coverage` folder. In a package, `pnpm vitest` runs them in watch mode.

**End-to-end** — `pnpm e2e` runs the Playwright tests of `apps/e2e` over every demo app, on the local builds (run `pnpm build` first, then `pnpm --filter e2e exec playwright install chromium` once). They start the demo dev servers themselves, or reuse the ones already running. `pnpm e2e:cdn` checks the files published on the CDN instead, which CI also does every night.

**Consumers** — `pnpm test:consumers` checks the published packages the way customers get them: they're built and packed with `pnpm pack`, checked with publint and attw, then installed in the apps of `consumers/` (React 19, 18 and 17, Next.js, Vue 3.3, Angular 19, vanilla, Web Component), a pnpm workspace of their own where a package importing a framework it doesn't declare fails, type-checked, built and checked in the browser. `CONSUMERS="react-17 vue-3.3" pnpm test:consumers` runs only some of them.

## Demos

Every demo renders the same listing page (from `packages/demo`) with a real WebPlayer loading the demo composition, and logs the player events. Run `pnpm demo` to start all of them, then open the index at http://localhost:4170.

| Command                  | Integration                                        | URL                   |
| ------------------------ | -------------------------------------------------- | --------------------- |
| `pnpm demo:index`        | Index of all demos                                 | http://localhost:4170 |
| `pnpm demo:react`        | `@car-cutter/react-webplayer`                      | http://localhost:4171 |
| `pnpm demo:react-legacy` | `@car-cutter/react-webplayer/legacy` (React 17)    | http://localhost:4178 |
| `pnpm demo:next`         | `@car-cutter/next-webplayer`                       | http://localhost:4172 |
| `pnpm demo:vanilla`      | `@car-cutter/vanilla-webplayer`                    | http://localhost:4173 |
| `pnpm demo:script`       | `<script>` bundle (`@car-cutter/script-webplayer`) | http://localhost:4174 |
| `pnpm demo:wc`           | `@car-cutter/wc-webplayer`                         | http://localhost:4175 |
| `pnpm demo:vue`          | `@car-cutter/vue-webplayer`                        | http://localhost:4176 |
| `pnpm demo:angular`      | `@car-cutter/angular-webplayer`                    | http://localhost:4179 |
| `pnpm demo:iframe`       | iframe integration (local copy or hosted page)     | http://localhost:4177 |

The ports are listed in `packages/demo/src/ports.ts`: the vite apps read them from there, demo-next and demo-angular set their port in their `dev` script.

The script demo loads the bundle built locally from `packages/webplayer-script`, so changes can be checked before the bundle is released. Open http://localhost:4174/?bundle=cdn to load the published `v3/bundle.js` instead. The iframe demo works the same way: by default it embeds a local copy of the hosted iframe page (`apps/demo-iframe/public/player`) that loads the local bundle; open http://localhost:4177/?bundle=cdn to embed the hosted iframe instead.

## Publication

Versioning and publication to npm are handled by the [Changesets](https://github.com/changesets/changesets) CLI, in five steps:

1. **Create a changeset** — `pnpm version:commit`, then select the affected packages and the type of change (patch, minor or major). It writes a changeset file that describes the changes.
2. **Version the packages** — once the changesets are merged into the base branch, `pnpm version:apply` updates the versions in the `package.json` files (no changelog is generated: `changelog` is off in `.changeset/config.json`) and prepares the packages for publishing.
3. **Check everything** — `pnpm run ci` runs `build` and `lint` after `pnpm install --frozen-lockfile`, to be sure the dependencies are correct. If the install fails because `pnpm-lock.yaml` is outdated, some versions have not been properly updated: run `pnpm install` and commit the updated lockfile.
4. **Publish to npm** — `pnpm publish:packages` publishes the public packages changed since the last release; the private ones (the core packages, the CDN script) and the ones ignored in `.changeset/config.json` (the demos, e2e) are not published. Make sure you are logged in to npm with the correct credentials; the packages are published with the access level of `.changeset/config.json`.
5. **Publish the documentation** — `pnpm publish:docs`.

## Project Structure

```
cars-webplayer-js/
├── apps/
│   ├── demo-*/            # One demo per integration, on the built packages
│   ├── docs/              # User documentation (Docusaurus, GitHub Pages)
│   ├── e2e/               # Playwright tests of the demos, the CDN files and the consumer apps
│   └── showroom/          # Internal showroom app
├── packages/
│   ├── core/              # Props, events, defaults and types shared by everything
│   ├── analytics/         # Analytics ids and event subscription
│   ├── core-ui/           # The player: carrousel, 360, hotspots… and its stylesheet
│   ├── core-wc/           # The custom elements, their attributes, the shadow root
│   ├── core-wc-react-*/   # The React 18+ and React 16/17 renderers of the elements
│   ├── demo/              # Layout, themes and helpers shared by the demo apps
│   └── webplayer-*/       # Published wrappers: react, next, vue, angular, wc, vanilla, script (CDN)
└── consumers/             # Minimal client apps, installed from packed tarballs by test:consumers
```

## Using the WebPlayer

### Properties

| Prop                          | Type                               | Default           | Description                                                                                                                                      |
| ----------------------------- | ---------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `compositionUrl`              | `string`                           | ❌ Required       | URL to the composition data                                                                                                                      |
| `hideCategoriesNav`           | `boolean`                          | `false`           | Hide the category-based navigation. Categories include `360`, `next360` (NextGen 360), `interior-360`, and custom ids.                           |
| `forceTopNav`                 | `boolean`                          | `false`           | Always show the top category navigation (never the burger menu), scrolling horizontally when it doesn't fit.                                     |
| `infiniteCarrousel`           | `boolean`                          | `false`           | Allow to navigate from 1st to last media (and vice versa)                                                                                        |
| `permanentGallery`            | `boolean`                          | `false`           | Display gallery under the carrousel                                                                                                              |
| `mediaLoadStrategy`           | `"quality"`/`"balanced"`/`"speed"` | `"quality"`       | Strategy for loading medias.                                                                                                                     |
| `minMediaWidth`               | `number`                           | `0`               | Force minimum media width (in pixels)                                                                                                            |
| `maxMediaWidth`               | `number`                           | `Infinity`        | Force maximum media width (in pixels)                                                                                                            |
| `preloadRange`                | `number`                           | `1`               | Number of items to preload before and after the viewport                                                                                         |
| `autoLoad360`                 | `boolean`                          | `false`           | Load 360 images without having to click                                                                                                          |
| `autoLoadInterior360`         | `boolean`                          | `false`           | Load interior 360 images without having to click                                                                                                 |
| `categoriesFilter`            | `string`                           | `*`               | Only display certain categories                                                                                                                  |
| `extendBehavior`              | `"full_screen"`/`"event"`/`"none"` | `"full_screen"`   | Handle extend mode                                                                                                                               |
| `eventPrefix`                 | `string`                           | `"cc-webplayer:"` | Prefix of cc-player events                                                                                                                       |
| `demoSpin`                    | `boolean`                          | `true`            | Run a spin once the 360 images has been loaded                                                                                                   |
| `reverse360`                  | `boolean`                          | `false`           | Reverse the 360-degree rotation                                                                                                                  |
| `spinCursor`                  | `string`                           | `"ew-resize"`     | CSS cursor value used while interacting with 360 and NextGen 360 media                                                                           |
| `themeConfig`                 | `"autonation"`                     | ``                | Apply a built-in theme configuration                                                                                                             |
| `integration`                 | `boolean`                          | `false`           | Allows to use maxItemsShown and disables permanentGallery with infiniteCarrousel, enables hideCategoriesNav                                      |
| `maxItemsShown`               | `number`                           | `1`               | Maximum number of items to display in the gallery                                                                                                |
| `analyticsEventPrefix`        | `string`                           | `"cc-analytics:"` | Prefix of cc-analytics events                                                                                                                    |
| `analyticsUrl`                | `string`                           | ``                | A URL to send simple tracking / analytic events                                                                                                  |
| `analyticsBearer`             | `string`                           | ``                | A Bearer token to authenticate when sending requests to `analyticsUrl`                                                                           |
| `analyticsSimpleRequestsOnly` | `boolean`                          | `false`           | A flag if only Simple-Requests should be sent. Will disable `analyticsBearer`. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS |
| `analyticsDryRun`             | `boolean`                          | `false`           | A flag if the tracking / analytic events should be just output to the console instead of actually send to the `analyticsUrl`                     |
| `analyticsDebug`              | `boolean`                          | `false`           | A flag if the tracking / analytic events should output debug information to the console                                                          |
| `monitoring`                  | `boolean`                          | `true`            | Enable monitoring mode to send activity events to the monitoring service instead of the analytics URL                                            |

> **Web Component attributes.** Used directly, the Web Component takes the props as HTML attributes, in dashed-case and with `string` values: `themeConfig` becomes `theme-config`.

### CSS Variables

| CSS Variable                           | Description                        | Default Value               |
| -------------------------------------- | ---------------------------------- | --------------------------- |
| `--cc-webplayer-background`            | Background color (contrast texts)  | `0 0% 100%`                 |
| `--cc-webplayer-foreground`            | Foreground color (text color)      | `240 10% 3.9%`              |
| `--cc-webplayer-primary`               | Primary color (buttons)            | `216 100% 52%`              |
| `--cc-webplayer-primary-foreground`    | Foreground color for primary items | `--cc-webplayer-background` |
| `--cc-webplayer-primary-light`         | Alternative to primary if too dark | `--cc-webplayer-primary`    |
| `--cc-webplayer-neutral`               | Neutral color                      | `0 0% 39%`                  |
| `--cc-webplayer-neutral-foreground`    | Foreground color for neutral items | `--cc-webplayer-foreground` |
| `--cc-webplayer-hotspot-damage-color`  | Color for damage hotspots          | `37 89% 52%`                |
| `--cc-webplayer-hotspot-feature-color` | Color for feature hotspots         | `--cc-primary`              |
| `--cc-webplayer-radius-ui`             | UI element Border radius (buttons) | `16px`                      |
| `--cc-webplayer-radius-carrousel`      | Carrousel border radius            | `0`                         |
| `--cc-webplayer-radius-gallery`        | Gallery medias border radius       | `0`                         |

For events, custom medias, icons and more, see the **[online documentation](https://carcutter.github.io/cars-webplayer-js/)**.

## Contributing

Commit format, browser support and contribution rules are in [`CONTRIBUTING.md`](./CONTRIBUTING.md); guidance for AI agents is in [`AGENTS.md`](./AGENTS.md).

---

<div align="center">
<sub>🇦🇹 Built by the CarCutter team. 🇫🇷</sub>
</div>
