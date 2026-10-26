import { expect, test } from "./fixtures";

/** Apps served by scripts/consumer-test.mjs */
const CONSUMERS: { name: string; url: string }[] = JSON.parse(
  process.env.CONSUMERS ?? "[]"
);

test.skip(!CONSUMERS.length, "Run through `yarn test:consumers`");

for (const { name, url } of CONSUMERS) {
  test(`${name} renders the player from the packed packages`, async ({
    page,
    consoleErrors,
  }) => {
    await page.goto(url);

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
