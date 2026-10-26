import { THEMES, THEME_KEYS, type ThemeKey } from "@car-cutter/demo";

import {
  expect,
  expectPlayerStarted,
  expectPlayerWithGallery,
  galleryHeight,
  loggedEvents,
  pageUrl,
  test,
} from "./fixtures";

/** Header pill set by the page itself, instead of the theme's */
const PILL: Partial<Record<ThemeKey, string>> = {
  script: "packages/webplayer-script/dist (local)",
};

for (const key of THEME_KEYS.filter(key => key !== "iframe")) {
  test.describe(THEMES[key].title, () => {
    test("renders the page and starts the player", async ({
      page,
      consoleErrors,
    }) => {
      await page.goto(pageUrl(key));

      await expect(page.locator(".dm-brand__title")).toHaveText(
        THEMES[key].title
      );
      await expect(page.locator(".dm-pill")).toHaveText(
        PILL[key] ?? THEMES[key].pkg
      );
      await expect(page.locator(".dm-brand")).toHaveAttribute(
        "href",
        pageUrl("index")
      );
      await expectPlayerWithGallery(page);
      await expectPlayerStarted(page);
      expect(consoleErrors).toEqual([]);
    });

    test("logs item-change when going to the next media", async ({ page }) => {
      await page.goto(pageUrl(key));
      await expectPlayerStarted(page);
      const box = (await page.locator("cc-webplayer").boundingBox())!;
      const mediaHeight = box.height - (await galleryHeight(page));

      // Right arrow of the carrousel: the element's shadow root is closed,
      // but mouse clicks reach it
      await page.mouse.click(box.x + box.width - 30, box.y + mediaHeight / 2);

      await expect
        .poll(async () => (await loggedEvents(page)).at(-1))
        .toBe("item-change");
      await expect(page.locator(".dm-events__detail").first()).toHaveText(
        /^#1 · /
      );
    });
  });
}

test.describe(THEMES.iframe.title, () => {
  test("embeds the local iframe page, which renders the player", async ({
    page,
    consoleErrors,
  }) => {
    await page.goto(pageUrl("iframe"));

    await expect(page.locator(".dm-pill")).toHaveText(THEMES.iframe.pkg);
    await expect(page.locator(".dm-iframe")).toHaveAttribute(
      "src",
      /^\/player\/index\.html\?composition-url=/
    );
    await expect(
      page.frameLocator(".dm-iframe").locator("cc-webplayer")
    ).toBeVisible();
    await expect(page.locator(".dm-events__empty")).toContainText(
      "can't be observed from this page"
    );
    expect(consoleErrors).toEqual([]);
  });
});
