# Architecture

## Layers

```
core ─► analytics ─► core-ui ─► core-wc ─┬─► core-wc-react-18 ─┬─► webplayer-wc (preact) ─► vanilla, vue, angular, script
                                         │                     └─► webplayer-react (React) ─► next
                                         └─► core-wc-react-16-17 ──► webplayer-react/legacy
```

The private packages (`core`, `analytics`, `core-ui`, `core-wc*`) are never published: `react-webplayer` and `wc-webplayer` bundle their sources and roll their declarations into their own `.d.ts` (`vite-plugin-dts` `bundledPackages`), each shipping its own copy of the player. The other wrappers depend on one of them, kept external: `next` on `react-webplayer`; `vue`, `angular`, `vanilla` on `wc-webplayer`, which the `script` bundle includes. A fix in core-ui reaches them through a new version of `react-webplayer` or `wc-webplayer`. `next`, `vue` and `vanilla` still inline `@car-cutter/core` (constants, `generateCompositionUrl`): a change of core changes them too.

| Package                               | Renders the player with                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| `react-webplayer` `.`                 | `core-wc-react-18`, the host's React (external)                                |
| `react-webplayer` `./legacy`          | `core-wc-react-16-17`, the host's React 16 / 17                                |
| `next-webplayer`                      | `react-webplayer` (or `/legacy`) through `next/dynamic` with `ssr: false`      |
| `wc-webplayer`                        | `core-wc-react-18` built with `react` / `react-dom` aliased to `preact/compat` |
| `vue`, `angular`, `vanilla`, `script` | `wc-webplayer` (so preact): they render `<cc-webplayer>`                       |

## From an attribute to the player

1. `<cc-webplayer>` is defined by `createElementClass` (`packages/core-wc/src/element.ts`), for the props listed in `WEB_PLAYER_WC_PROPS` (`packages/core-wc/src/webplayer-props.ts`). Its attributes hold the state: each prop is parsed from its dash-cased attribute, and setting the property sets the attribute.
2. Attribute changes are batched into one render per microtask; disconnecting defers the unmount by a task, so that moving the element doesn't remount it.
3. The element renders, through its `Renderer`, `WebPlayerWithInjectedStyles` (`packages/core-wc/src/webplayer.tsx`): a `<style>` holding `@car-cutter/core-ui/style.css?inline`, and the `WebPlayer` of core-ui, in a **closed** shadow root.
4. `WebPlayer` (`packages/core-ui/src/WebPlayer.tsx`) applies the `DEFAULT_*` values of `packages/core/src/const/webplayer-default-props.ts`, then provides:
   - `GlobalContextProvider`: the props, `emitEvent`, `emitAnalyticsEvent`, the player's size and fullscreen state;
   - `CustomizationContextProvider`: custom icons and medias;
   - a root `div` mapping the public CSS variables (`--cc-webplayer-primary`...) to the internal ones (`--primary`...) that the Tailwind theme reads.
5. `WebPlayerContainer` loads the composition with `useComposition` (`packages/core-ui/src/hooks/useComposition.ts`, a fetch cached in a module-level `Map`), shows a spinner, an `ErrorTemplate`, or the player, under `CompositionContextProvider` and `ControlsContextProvider` (navigation, extend mode, gallery, hotspots).

## Events

- Player events (`EVENT_*` of `packages/core/src/const/webplayer-events.ts`) are `CustomEvent`s named `<eventPrefix><event>` (default `cc-webplayer:`), dispatched with `bubbles` and `composed` from the player's root, so they leave the shadow root. Most come from `ControlsContextProvider`, the composition ones from `WebPlayerContainer`.
- Analytics events (`ANALYTICS_EVENT_*`, prefix `cc-analytics:`) are dispatched the same way by `emitAnalyticsEvent`, which also posts them to `analyticsUrl` (when set) and to the monitoring service (`packages/core-ui/src/utils/monitoring.ts`, when `monitoring`; it defaults to on unless `analyticsUrl` is set). With `analyticsDryRun`, it only logs them.
- `react-webplayer` turns them into `on*` callbacks; Vue and Angular into component events.

## Customization

- Icons and custom medias are given as children: `<cc-webplayer-icon>` / `<cc-webplayer-custom-media>` elements (web component), or `WebPlayerIcon` / `WebPlayerCustomMedia` components (React wrapper).
- `CustomizationContextProvider` reads the elements' `innerHTML` and watches them with a `MutationObserver`; the React components register themselves in the context. For icons, the React entry wins over an element of the same name; custom medias of both kinds are all kept.
- Without the context, those components render a `<slot />`.
- Colors and radii are customized with the `--cc-webplayer-*` CSS variables, set on the host page; they cross the shadow root by inheritance.

## Styles

- `packages/core-ui/src/index.css` is the only stylesheet: the imports of Tailwind (scanning `src/` only) and of pannellum's styles (interior 360s), then the theme, the variants and utilities of the player, and last the overrides of pannellum's styles.
- The build of core-ui outputs only `dist/style.css` (`cssOnly` in `packages/core-ui/vite.config.ts`); the wrappers bundle core-ui's TypeScript sources and inline that CSS.
- `tailwindCompat` (same file) post-processes Tailwind's output: sets Tailwind's variables on every element (a shadow root ignores `@property`), and writes colors with an opacity as `hsl(var(--x) / N%)` instead of `color-mix()`. Browser support: `CONTRIBUTING.md`.
