import { SCRIPT_BUNDLE } from "@car-cutter/demo";

import {
  expect,
  expectPlayerStarted,
  expectPlayerWithGallery,
  pageUrl,
  test,
} from "./fixtures";

// The files published on the CDN, run on a schedule (project "cdn")
test.describe("published files", { tag: "@cdn" }, () => {
  test(`${SCRIPT_BUNDLE.name} runs on the CDN`, async ({
    page,
    consoleErrors,
  }) => {
    await page.goto(pageUrl("script", "?bundle=cdn"));

    await expect(page.locator(".dm-pill")).toHaveText(
      SCRIPT_BUNDLE.cdnUrl.replace("https://", "")
    );
    await expectPlayerWithGallery(page);
    await expectPlayerStarted(page);
    expect(consoleErrors).toEqual([]);
  });

  test("the hosted iframe renders the player", async ({ page }) => {
    await page.goto(pageUrl("iframe", "?bundle=cdn"));

    await expect(page.locator(".dm-iframe")).toHaveAttribute(
      "src",
      /^https:\/\/cdn\.car-cutter\.com\/libs\/web-player\/v3\/integrations\/iframe\//
    );
    await expect(
      page.frameLocator(".dm-iframe").locator("cc-webplayer")
    ).toBeVisible();
  });
});
