import { SCRIPT_BUNDLE, SCRIPT_DIST } from "@car-cutter/demo";

import {
  expect,
  expectPlayerStarted,
  expectPlayerWithGallery,
  pageUrl,
  test,
} from "./fixtures";

test.describe("Script demo", () => {
  test(`runs the local build of ${SCRIPT_BUNDLE.name}`, async ({
    page,
    consoleErrors,
  }) => {
    await page.goto(pageUrl("script"));

    await expect(page.locator(".dm-pill")).toHaveText(`${SCRIPT_DIST} (local)`);
    await expectPlayerWithGallery(page);
    await expectPlayerStarted(page);
    expect(consoleErrors).toEqual([]);
  });

  test("tells how to build a missing local bundle", async ({ page }) => {
    await page.route(`**${SCRIPT_BUNDLE.localPath}`, route =>
      route.fulfill({ status: 404 })
    );
    await page.goto(pageUrl("script"));

    const note = page.locator(".dm-stage__note");
    await expect(note.locator("code")).toHaveText(
      "pnpm turbo build --filter=@car-cutter/script-webplayer"
    );
    await expect(note.locator("a")).toHaveAttribute("href", "?bundle=cdn");
  });

  test("names the file that couldn't be loaded", async ({ page }) => {
    await page.route(SCRIPT_BUNDLE.cdnUrl, route => route.abort());
    await page.goto(pageUrl("script", "?bundle=cdn"));

    await expect(page.locator(".dm-stage__note")).toContainText(
      `${SCRIPT_BUNDLE.cdnUrl} couldn't be loaded`
    );
  });
});

test.describe("iframe demo", () => {
  test("tells how to build a missing local bundle", async ({ page }) => {
    await page.route(`**${SCRIPT_BUNDLE.localPath}`, route =>
      route.fulfill({ status: 404 })
    );
    await page.goto(pageUrl("iframe"));

    await expect(page.locator(".dm-stage__note code")).toHaveText(
      "pnpm turbo build --filter=@car-cutter/script-webplayer"
    );
    await expect(page.locator(".dm-iframe")).toHaveCount(0);
  });
});
