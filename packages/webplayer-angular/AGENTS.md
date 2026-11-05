# @car-cutter/angular-webplayer

Standalone Angular components (`car-cutter-webplayer`, `-custom-media`, `-icon`) rendering the elements of `@car-cutter/wc-webplayer`.

- Built and tested with the lowest Angular it supports (peer `>=19`): Angular ~19.2 and its TypeScript ~5.8, pinned here only (ignored by `.syncpackrc`). Keep them when upgrading the rest of the repo; `apps/demo-angular` and `consumers/angular-19` cover newer and the lowest Angular.
- Build: `ng-packagr`, then `api-extractor` rolls the declarations into `dist/index.d.ts` (the other `.d.ts` are deleted). `pnpm turbo build --filter=@car-cutter/angular-webplayer`.
- `apps/demo-angular` uses an injected copy of the package, updated only when this build script runs: the build isn't cached by turbo (`turbo.json`).
- Set the element's state through `syncAttributes` (`src/sync-attributes.ts`): attributes only, never properties, so that an input going back to `undefined` removes the attribute and the element uses its default.
- `WebPlayerInputs` (`src/web-player.ts`) maps every prop of `WebPlayerProps`: a prop added to the core fails this build until its input is added (booleans through `src/boolean-input.ts`).
- Tests: Vitest through `@analogjs/vite-plugin-angular`, with TestBed set up in `src/test-setup.ts`.
