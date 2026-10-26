import { test as base, expect, type Page } from "@playwright/test";

import { DEMO_PORTS, type DemoKey } from "@car-cutter/demo";

export { expect };

export const test = base.extend<{ consoleErrors: string[] }>({
  // Collected for every test, which then expects none
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", message => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", error => errors.push(error.message));
      await use(errors);
    },
    { auto: true },
  ],
  page: async ({ page }, use) => {
    // Nothing is sent to the analytics / monitoring service from the tests
    await page.route("**://analytics.eu.car-cutter.com/**", route =>
      route.fulfill({ status: 204 })
    );
    await use(page);
  },
});

export const pageUrl = (key: DemoKey, query = "") =>
  `http://localhost:${DEMO_PORTS[key]}/${query}`;

/** Names of the logged events, oldest first */
export const loggedEvents = (page: Page) =>
  page
    .locator(".dm-events__name")
    .allTextContents()
    .then(names => names.reverse());

/** Waits for the three events logged when the player starts */
export async function expectPlayerStarted(page: Page) {
  await expect
    .poll(() => loggedEvents(page))
    .toEqual(
      expect.arrayContaining([
        "composition-loading",
        "composition-loaded",
        "item-change",
      ])
    );
  await expect(
    page
      .locator(".dm-events__entry", { hasText: "composition-loaded" })
      .locator(".dm-events__detail")
  ).toHaveText(/^[1-9]\d* categories · [1-9]\d* items$/);
}

/** Height of the player beyond its 4:3 media: the permanent gallery */
export async function galleryHeight(page: Page) {
  const box = (await page.locator("cc-webplayer").boundingBox())!;
  return Math.round(box.height - (box.width * 3) / 4);
}

/** The player shows its 4:3 media plus the permanent gallery (about 50px) */
export async function expectPlayerWithGallery(page: Page) {
  await expect(page.locator("cc-webplayer")).toBeVisible();
  await expect.poll(() => galleryHeight(page)).toBeGreaterThan(30);
}
