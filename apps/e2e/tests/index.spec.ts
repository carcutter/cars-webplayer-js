import { THEMES, THEME_KEYS } from "@car-cutter/demo";

import { expect, pageUrl, test } from "./fixtures";

test("the index links to every demo", async ({ page, consoleErrors }) => {
  await page.goto(pageUrl("index"));

  await expect(page.locator(".dm-pill")).toHaveText(/^v\d+\.\d+\.\d+$/);
  const cards = page.locator(".dm-card");
  await expect(cards).toHaveCount(THEME_KEYS.length);
  for (const [i, key] of THEME_KEYS.entries()) {
    await expect(cards.nth(i)).toHaveAttribute("href", pageUrl(key));
    await expect(cards.nth(i).locator(".dm-brand__title")).toHaveText(
      THEMES[key].title
    );
  }
  expect(consoleErrors).toEqual([]);
});
