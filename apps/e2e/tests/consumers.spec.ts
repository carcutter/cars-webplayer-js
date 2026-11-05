import { CONSUMER_APPS } from "../consumers";

import { expect, test } from "./fixtures";

// Previewed by playwright.consumers.config.ts
for (const { name, port } of CONSUMER_APPS) {
  test(`${name} renders the player from the packed packages`, async ({
    page,
    consoleErrors,
  }) => {
    await page.goto(`http://localhost:${port}/`);

    await expect(page.locator("cc-webplayer")).toBeVisible();
    await expect
      .poll(() => page.locator("#events li").allTextContents())
      .toEqual(
        expect.arrayContaining([
          "composition-loading",
          "composition-loaded",
          "item-change",
        ])
      );
    // The custom media and icon reach the element
    await expect(
      page.locator('cc-webplayer-custom-media[index="4"] #custom-media')
    ).toBeAttached();
    await expect(
      page.locator('cc-webplayer-icon[name="UI_GALLERY"] #custom-icon')
    ).toBeAttached();
    expect(consoleErrors).toEqual([]);
  });
}
