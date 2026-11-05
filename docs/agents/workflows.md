# Workflows

Each recipe ends on a check; it is done when that check passes.

## Add or change a prop

A prop is listed in many places, some of them unchecked by TypeScript. Start from an existing prop of the same type and mirror every hit:

```sh
git grep -n -i -e permanentGallery -e PERMANENT_GALLERY -e permanent-gallery
```

1. `packages/core/src/types/web-player/webplayer-props.ts` (`WebPlayerProps`, with its JSDoc) and its `DEFAULT_*` in `packages/core/src/const/webplayer-default-props.ts`, exported from `packages/core/index.ts`.
2. `packages/core-ui`: read it in `WebPlayer.tsx` with its default, pass it through `GlobalContext`, use it.
3. `WEB_PLAYER_WC_PROPS` in `packages/core-wc/src/webplayer-props.ts`, with the attribute's type (`string`, `number`, `boolean`).
4. Wrappers: Angular's input in `packages/webplayer-angular/src/web-player.ts` (booleans through `boolean-input.ts`), Vue's `booleanPropsDefaults` (`packages/webplayer-vue/src/boolean-props.ts`) for a boolean. TypeScript fails on these until they are added.
5. Docs, none type-checked for completeness: a row in `apps/docs/docs/_components/WebPlayerPropertiesTable.tsx`, the props table of `README.md`, `apps/docs/docs/properties.mdx` when it describes the prop, the showroom's customization (`apps/showroom/src/AppContext.tsx`, `components/molecules/CustomizationDrawer.tsx`, `const/webplayer.ts`) when users should try it there.
6. The core-ui playground (`packages/core-ui/dev/settings.ts`, `Controls.tsx`) when the prop is worth trying there.
7. The `load` analytics event's config: `packages/analytics/src/types/analytics-event-props/analytics-load-event-props.ts` and its payload in `WebPlayer.tsx` (snake_case; not type-checked for completeness).
8. The demo apps and `consumers/*` apps that set the prop's neighbours, and the tests listing props (the hits of the grep above).

Done: `pnpm run ci`, `pnpm test`, `pnpm e2e`, `pnpm test:consumers` pass, and the prop works in `pnpm dev --port 4190` and `pnpm demo:wc`.

## Add an event

Mirror an existing one: `git grep -n -i -e EVENT_GALLERY_OPEN -e gallery-open -e galleryOpen`.

1. The constant in `packages/core/src/const/webplayer-events.ts`, exported by `packages/core/index.ts` and re-exported by each wrapper's entry (`packages/webplayer-wc/index.ts`, `packages/webplayer-vanilla/index.ts`, the `src/shared-exports.ts` of react, next, vue, angular).
2. Emit it in core-ui with `emitEvent` (from `useGlobalContext`).
3. The wrappers' events: `on*` callback in `packages/webplayer-react/src/components/WebPlayer.tsx`, the Vue `WebPlayer.vue` emits, the Angular `web-player.ts` output.
4. The event logs: of the demos (`packages/demo/src/events.ts`, `packages/demo/src/react/usePlayerEventHandlers.ts`, the bindings in `apps/demo-angular/src/app/app.ts` and `apps/demo-vue/src/App.vue`) and of the playground (`packages/core-ui/dev/EventLog.tsx`); the docs' `WebPlayerEventsTable.tsx`.
5. The tests listing every event: `packages/demo/src/react/react.test.tsx` (calls each handler), `packages/webplayer-react/src/components/WebPlayer.test.tsx`, the Vue `WebPlayer.test.ts` and Angular `web-player.test.ts` (hits of the grep above).

Done: same checks as a prop; the event shows in the event log of `pnpm demo`.

## Change the player's UI or styles

1. `pnpm dev --port 4190` (the playground), check `shadowDom`: the styles are injected there as in the web component.
2. Classes and CSS follow [`conventions.md`](conventions.md); new CSS goes in `packages/core-ui/src/index.css`.
3. If it brings CSS newer than the supported browsers, check an old browser (`CONTRIBUTING.md`, "Browser support").

Done: `pnpm run ci`, `pnpm test`, `pnpm e2e` pass; the change looks right in `pnpm demo:wc` and `pnpm demo:react`, on a desktop and a phone viewport.

## Update a dependency

1. Change it in every package using it; `pnpm syncpack:lint` lists the mismatches, `pnpm syncpack:fix` aligns them (ignored groups: `.syncpackrc`).
2. `pnpm install`, commit `pnpm-lock.yaml`.
3. For a dependency of a published package or of its build, run the consumer apps.

Done: `pnpm run ci`, `pnpm test`, `pnpm e2e`, `pnpm test:consumers` pass.

## Release

The versions of all the packages are bumped together in a release commit (e.g. `build: 🔖 Release 3.2.17`); merging `develop` into `main` publishes them (`.github/workflows/continuous_deployment.yml`, then `continuous_delivery.yml`: npm, the CDN script, the docs). `README.md` ("Publication") describes a changesets flow (`pnpm version:commit`, `pnpm version:apply`), but the recent releases bumped the versions by hand; npm publishing runs `changeset publish` (`pnpm publish:packages`). TODO: confirm the release steps with the team before doing one.
