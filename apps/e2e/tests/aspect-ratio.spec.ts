import type { Page } from "@playwright/test";

import { COMPOSITION_URL } from "@car-cutter/demo";

import { expect, pageUrl, test } from "./fixtures";

/**
 * Adds a player of the demo composition made 16:9 (it is 4:3), whose first
 * item is `item`, or the first one of the category `categoryId` (given the
 * type `type`)
 */
async function addPlayer(
  page: Page,
  {
    categoryId,
    type,
    item,
  }: { categoryId?: string; type?: string; item?: object }
) {
  // The player's shadow root is closed: opened here to measure its media
  await page.addInitScript(() => {
    const { attachShadow } = Element.prototype;
    Element.prototype.attachShadow = function (init) {
      return attachShadow.call(this, { ...init, mode: "open" });
    };
  });
  await page.goto(pageUrl("wc"));
  await page.evaluate(
    async ({ compositionUrl, categoryId, type, item }) => {
      const composition = await (await fetch(compositionUrl)).json();
      composition.aspectRatio = "16:9";
      const items = item
        ? [item]
        : composition.categories
            .find(({ id }: { id: string }) => id === categoryId)
            .items.map((item: object) => (type ? { ...item, type } : item));
      composition.categories.unshift({ id: "test", title: "Test", items });

      const player = document.createElement("cc-webplayer");
      player.id = "ratio-test";
      player.setAttribute(
        "composition-url",
        `data:application/json,${encodeURIComponent(JSON.stringify(composition))}`
      );
      player.setAttribute("monitoring", "false");
      player.style.display = "block";
      player.style.width = "640px";
      document.body.prepend(player);
    },
    { compositionUrl: COMPOSITION_URL, categoryId, type, item }
  );
}

/** Sizes of the first carousel item and of the media box shown in it */
const firstItemBoxes = (page: Page) =>
  page.evaluate(() => {
    const root = document.getElementById("ratio-test")?.shadowRoot;
    const slot = root?.querySelector(".h-full.bg-foreground\\/35");
    // The box of the media (4:3 before it followed the composition)
    const media = slot?.querySelector(".relative.w-full");
    if (!slot || !media) return null;
    const size = (element: Element) => {
      const { width, height } = element.getBoundingClientRect();
      return { width: Math.round(width), height: Math.round(height) };
    };
    return { slot: size(slot), media: size(media) };
  });

test.describe("A 16:9 composition", () => {
  for (const [name, options] of [
    ["NextGen 360 placeholder", { categoryId: "next360" }],
    ["360 placeholder", { categoryId: "next360", type: "360" }],
    ["interior 360", { categoryId: "interior-360" }],
    ["video", { item: { type: "video", src: "data:video/webm," } }],
  ] as const) {
    test(`shows its ${name} at 16:9, as its carousel item`, async ({
      page,
      consoleErrors,
    }) => {
      await addPlayer(page, options);

      const box = { width: 640, height: 360 };
      await expect
        .poll(() => firstItemBoxes(page))
        .toEqual({ slot: box, media: box });
      expect(consoleErrors).toEqual([]);
    });
  }
});
