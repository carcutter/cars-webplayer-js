# Testing

Three levels: unit tests per package (Vitest), e2e tests of the demo apps (Playwright, `apps/e2e`), and the consumer apps installing the packed packages (`pnpm test:consumers`).

## Unit (Vitest)

- Packages with tests: `demo`, `core-wc`, `core-wc-react-18`, `core-wc-react-16-17`, and every published `webplayer-*` except `script`. `core`, `analytics`, `core-ui` and `webplayer-script` have none: the player's UI is covered by the e2e tests.
- Each package has its `vitest.config.ts`: `happy-dom`, v8 coverage with `thresholds: { 100: true }`. A change that leaves a line or branch uncovered fails `pnpm test`.
- Tests sit next to their source, `src/<name>.test.ts(x)`. Name the behaviour, in the present tense:
  ```ts
  describe("appendWebPlayer", () => {
    it("appends <cc-webplayer> with the props as attributes", () => {
  ```
- Mock the workspace packages at their boundary, keeping the rest real:
  - the player's CSS: `vi.mock("@car-cutter/core-ui/style.css?inline", () => ({ default: "" }))`;
  - a function of `wc-webplayer`, with `vi.hoisted` and `importOriginal`:
    ```ts
    const ensureCustomElementsDefinition = vi.hoisted(() => vi.fn());
    vi.mock("@car-cutter/wc-webplayer", async importOriginal => ({
      ...(await importOriginal<object>()),
      ensureCustomElementsDefinition,
    }));
    ```
  - `next/dynamic`, `react-dom` (16/17 renderer): see the tests of `webplayer-next` and `core-wc-react-16-17`.
- Angular tests run through `@analogjs/vite-plugin-angular` with `src/test-setup.ts` (TestBed); Vue's config declares the `cc-webplayer*` tags as custom elements.

Run one file or one test with `exec vitest`, without `--coverage` (the package's `test` script adds it, and the 100% thresholds fail on a partial run). Build the dependencies first, `exec` skips turbo:

```sh
pnpm turbo build --filter=@car-cutter/vanilla-webplayer^...
pnpm --filter @car-cutter/vanilla-webplayer exec vitest run src/lib.test.ts -t "as attributes"
```

## E2E (`apps/e2e`)

- Projects in `playwright.config.ts`:
  - `demos` (`pnpm e2e`): every demo app, started by Playwright on its port (`packages/demo/src/ports.ts`), or reused when already running;
  - `cdn` (`pnpm e2e:cdn`, tests tagged `@cdn`): the files published on the CDN, run daily by `.github/workflows/e2e_cdn.yml`;
- The demos run on the built packages: `pnpm build` first.
- Use the fixtures of `tests/fixtures.ts`: `test` collects console errors (`consoleErrors`, expected empty) and stubs the analytics endpoint; `pageUrl(key)`, `expectPlayerStarted(page)` (waits for the load events in the demo's event log), `expectPlayerWithGallery(page)`.
- The player's shadow root is closed: assert on the demo page (its event log `.dm-events__*`, the `cc-webplayer` box), and act with mouse coordinates from `page.locator("cc-webplayer").boundingBox()`.

```sh
pnpm --filter e2e exec playwright install --with-deps chromium   # once
pnpm --filter e2e exec playwright test --project=demos tests/video.spec.ts -g "pauses"
```

## Consumers (`pnpm test:consumers`)

1. `turbo run pack:check` builds the six npm packages and runs their `pack:check` script: `pnpm pack` to `package.tgz` (the `workspace:^` versions become `^` ranges), checked with `publint` and `attw`. attw checks the `node16` profile and ignores `false-esm` (the `.d.ts` read as ESM from CommonJS), and `cjs-resolves-to-esm` for Angular, ESM only like Angular itself; the `/legacy` subpath under `moduleResolution: "node"` (node10) isn't checked.
2. `pnpm --dir consumers install --no-lockfile` installs the `consumers/*` apps (React 17/18/19, Next 16, Vue 3.3, Angular 19, wc, vanilla): a pnpm workspace of their own, outside the repo's one, whose `overrides` replace every `@car-cutter/*` package with its tarball. pnpm's strict `node_modules` makes a package fail when it imports a dependency it doesn't declare; for the frameworks (React, Vue, Next, Angular and their types) even through pnpm's hidden hoisted folder, which `hoistPattern` keeps them out of: a wrapper declares its framework in `peerDependencies`.
3. `apps/e2e/playwright.consumers.config.ts` type-checks, builds and previews each app in place (ports 4180 and up, never reused), and runs `tests/consumers.spec.ts` on it.

`CONSUMERS="react-17 vue-3.3" pnpm test:consumers` checks some apps only (all are installed).

Not isolated from the repo: `consumers/` is inside it, so Node's resolution falls back to the root `node_modules` (the root devDependencies: `typescript`, `@types/node`...), and TypeScript includes the root's `@types` in an app setting no `types`.
