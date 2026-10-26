import { BUNDLE_VARIANTS, SCRIPT_BUNDLES } from "@car-cutter/demo";

import {
  expect,
  expectPlayerStarted,
  expectPlayerWithGallery,
  pageUrl,
  test,
} from "./fixtures";

test.describe("Script demo", () => {
  for (const variant of BUNDLE_VARIANTS) {
    const bundle = SCRIPT_BUNDLES[variant];

    test(`runs the local build of ${bundle.name}`, async ({
      page,
      consoleErrors,
    }) => {
      await page.goto(
        pageUrl("script", variant === "default" ? "" : `?variant=${variant}`)
      );

      await expect(page.locator(".dm-pill")).toHaveText(
        `packages/${bundle.dir}/dist (local)`
      );
      await expectPlayerWithGallery(page);
      await expectPlayerStarted(page);
      // The React variants run on the React of the page
      expect(
        await page.evaluate(
          () => (window as { React?: { version: string } }).React?.version
        )
      ).toBe(bundle.react);
      expect(consoleErrors).toEqual([]);
    });
  }

  test("tells how to build a missing local bundle", async ({ page }) => {
    await page.route(`**${SCRIPT_BUNDLES.default.localPath}`, route =>
      route.fulfill({ status: 404 })
    );
    await page.goto(pageUrl("script"));

    const note = page.locator(".dm-stage__note");
    await expect(note.locator("code")).toHaveText(
      "yarn turbo build --filter=@car-cutter/script-webplayer"
    );
    await expect(note.locator("a")).toHaveAttribute("href", "?bundle=cdn");
  });

  test("names the file that couldn't be loaded", async ({ page }) => {
    await page.route("**://unpkg.com/**", route => route.abort());
    await page.goto(pageUrl("script", "?variant=react-18"));

    await expect(page.locator(".dm-stage__note")).toContainText(
      "https://unpkg.com/react@18.3.1/umd/react.production.min.js couldn't be loaded"
    );
  });
});

test.describe("iframe demo", () => {
  test("tells how to build a missing local bundle", async ({ page }) => {
    await page.route(`**${SCRIPT_BUNDLES.default.localPath}`, route =>
      route.fulfill({ status: 404 })
    );
    await page.goto(pageUrl("iframe"));

    await expect(page.locator(".dm-stage__note code")).toHaveText(
      "yarn turbo build --filter=@car-cutter/script-webplayer"
    );
    await expect(page.locator(".dm-iframe")).toHaveCount(0);
  });
});
