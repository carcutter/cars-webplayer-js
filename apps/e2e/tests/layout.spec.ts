import type { Page } from "@playwright/test";

import { THEME_KEYS, type DemoKey } from "@car-cutter/demo";

import { expect, pageUrl, test } from "./fixtures";

// Desktop, laptop, phone portrait and two phones in landscape
const SIZES = [
  [1440, 820],
  [1024, 640],
  [390, 844],
  [844, 390],
  [667, 375],
] as const;

const PAGES: DemoKey[] = ["index", ...THEME_KEYS];

/** Overflow of the page, and of the player / log bottom past the viewport */
const overflow = (page: Page) =>
  page.evaluate(() => {
    const { scrollHeight, scrollWidth } = document.scrollingElement!;
    const bottom = (selector: string) =>
      document.querySelector(selector)?.getBoundingClientRect().bottom ?? 0;
    return {
      vertical: Math.max(0, scrollHeight - innerHeight),
      horizontal: Math.max(0, scrollWidth - innerWidth),
      player: Math.max(0, bottom(".dm-stage > *") - innerHeight),
      log: Math.max(0, bottom(".dm-events") - innerHeight),
    };
  });

/**
 * Whether the player uses the stage: about as wide as it, or as tall (a
 * player squeezed to fit would pass the overflow checks). Not exact: the
 * gallery height under the 4:3 media varies a little with the width
 */
const playerFillsStage = (page: Page) =>
  page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>(".dm-stage")!;
    const player = stage.firstElementChild!.getBoundingClientRect();
    const style = getComputedStyle(stage);
    const width =
      stage.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight);
    const height =
      stage.clientHeight -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom);
    return player.width >= width * 0.95 || player.height >= height * 0.95;
  });

for (const [width, height] of SIZES) {
  test.describe(`${width}×${height}`, () => {
    test.use({ viewport: { width, height } });

    for (const key of PAGES) {
      test(`${key} fits without scrolling`, async ({ page }) => {
        await page.goto(pageUrl(key));
        await expect(
          page.locator(key === "index" ? ".dm-card" : ".dm-stage > *").first()
        ).toBeVisible();

        await expect
          .poll(() => overflow(page))
          .toEqual({ vertical: 0, horizontal: 0, player: 0, log: 0 });
        if (key !== "index") {
          await expect.poll(() => playerFillsStage(page)).toBe(true);
        }
      });
    }
  });
}
