import { BUNDLE_VARIANTS, SCRIPT_BUNDLES } from "@car-cutter/demo";

import {
  expect,
  expectPlayerStarted,
  expectPlayerWithGallery,
  pageUrl,
  test,
} from "./fixtures";

// The files published on the CDN, run on a schedule (project "cdn")
test.describe("published files", { tag: "@cdn" }, () => {
  for (const variant of BUNDLE_VARIANTS) {
    test(`${SCRIPT_BUNDLES[variant].name} runs on the CDN`, async ({
      page,
      consoleErrors,
    }) => {
      // Fixed in packages, not released yet: remove once it's on the CDN
      test.fail(
        variant !== "default",
        "React bundles broken on the CDN until the release with the fix of PR 230"
      );

      const query =
        variant === "default"
          ? "?bundle=cdn"
          : `?variant=${variant}&bundle=cdn`;
      await page.goto(pageUrl("script", query));

      await expect(page.locator(".dm-pill")).toHaveText(
        SCRIPT_BUNDLES[variant].cdnUrl.replace("https://", "")
      );
      await expectPlayerWithGallery(page);
      await expectPlayerStarted(page);
      expect(consoleErrors).toEqual([]);
    });
  }

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
