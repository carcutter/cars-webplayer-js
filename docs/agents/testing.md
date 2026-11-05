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
  - `consumers`: run by `pnpm test:consumers` only.
- The demos run on the built packages: `pnpm build` first.
- Use the fixtures of `tests/fixtures.ts`: `test` collects console errors (`consoleErrors`, expected empty) and stubs the analytics endpoint; `pageUrl(key)`, `expectPlayerStarted(page)` (waits for the load events in the demo's event log), `expectPlayerWithGallery(page)`.
- The player's shadow root is closed: assert on the demo page (its event log `.dm-events__*`, the `cc-webplayer` box), and act with mouse coordinates from `page.locator("cc-webplayer").boundingBox()`.

```sh
pnpm --filter e2e exec playwright install --with-deps chromium   # once
pnpm --filter e2e exec playwright test --project=demos tests/video.spec.ts -g "pauses"
```

## Consumers (`pnpm test:consumers`)

`scripts/consumer-test.js`, after `pnpm build`: packs the six npm packages, checks them with `publint` and `attw`, installs them with npm in a copy of each `consumers/*` app (React 17/18/19, Next 16, Vue 3.3, Angular 19, wc, vanilla), type-checks and builds it, serves it from port 4180 up, and runs `apps/e2e/tests/consumers.spec.ts` on it. `pnpm test:consumers react-17 vue-3.3` runs some apps only; `KEEP=1` keeps the temporary folder.
