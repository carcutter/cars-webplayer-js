import { COMPOSITION_URL } from "@car-cutter/demo";

import type { Page } from "@playwright/test";

import { expect, pageUrl, test } from "./fixtures";

const CUSTOM_MEDIA =
  '<cc-webplayer-custom-media index="0"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></cc-webplayer-custom-media>';

type Player = {
  compositionUrl: string;
  eventPrefix: string;
  withCustomMedia: boolean;
};

/**
 * Adds web components to the page, keeping the type of the first item each
 * one shows (its first item-change) in `window.firstItemTypes`, by event
 * prefix. Customizations are the children of the web component (light DOM)
 * and the player is in a closed shadow root: what it does with them is seen
 * through its events.
 */
const addPlayers = ({
  players,
  customMedia,
}: {
  players: Player[];
  customMedia: string;
}) => {
  const types: Record<string, string> = {};
  Object.assign(window, { firstItemTypes: types });

  for (const { compositionUrl, eventPrefix, withCustomMedia } of players) {
    document.addEventListener(`${eventPrefix}item-change`, event => {
      types[eventPrefix] ??= (event as CustomEvent).detail.item.type;
    });

    const player = document.createElement("cc-webplayer");
    player.setAttribute("composition-url", compositionUrl);
    player.setAttribute("event-prefix", eventPrefix);
    player.setAttribute("monitoring", "false");
    player.style.display = "block";
    player.style.width = "400px";
    if (withCustomMedia) player.innerHTML = customMedia;
    document.body.append(player);
  }
};

const firstItemTypes = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { firstItemTypes: Record<string, string> })
        .firstItemTypes
  );

test.describe("Customizations of the web component", () => {
  test("each player reads its own, with the same composition", async ({
    page,
    consoleErrors,
  }) => {
    await page.goto(pageUrl("wc"));
    // Two players of the composition of the page's own player: only the
    // first one has a custom media, shown first (index 0)
    await page.evaluate(addPlayers, {
      players: [
        {
          compositionUrl: COMPOSITION_URL,
          eventPrefix: "a:",
          withCustomMedia: true,
        },
        {
          compositionUrl: COMPOSITION_URL,
          eventPrefix: "b:",
          withCustomMedia: false,
        },
      ],
      customMedia: CUSTOM_MEDIA,
    });

    // Both started
    await expect
      .poll(async () => Object.keys(await firstItemTypes(page)).sort())
      .toEqual(["a:", "b:"]);
    const types = await firstItemTypes(page);
    expect(types["a:"]).toBe("custom");
    expect(types["b:"]).toEqual(expect.any(String));
    expect(types["b:"]).not.toBe("custom");
    expect(consoleErrors).toEqual([]);
  });

  test("reads a composition URL that isn't a valid selector", async ({
    page,
    consoleErrors,
  }) => {
    // The demo composition, at a URL with a quote
    await page.route(
      url =>
        url.searchParams.has("q") &&
        url.pathname === new URL(COMPOSITION_URL).pathname,
      async route =>
        route.fulfill({ response: await route.fetch({ url: COMPOSITION_URL }) })
    );
    await page.goto(pageUrl("wc"));
    await page.evaluate(addPlayers, {
      players: [
        {
          compositionUrl: `${COMPOSITION_URL}?q="`,
          eventPrefix: "c:",
          withCustomMedia: true,
        },
      ],
      customMedia: CUSTOM_MEDIA,
    });

    await expect.poll(() => firstItemTypes(page)).toEqual({ "c:": "custom" });
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Events of the web component", () => {
  test("are dispatched from its player, and reach document", async ({
    page,
    consoleErrors,
  }) => {
    await page.goto(pageUrl("wc"));
    // Two players with the same prefix: the composition-loaded events heard
    // on each element, and on document
    await page.evaluate(compositionUrl => {
      const heard: Record<string, number> = { a: 0, b: 0, document: 0 };
      Object.assign(window, { heard });
      document.addEventListener("same:composition-loaded", () => {
        heard.document++;
      });

      for (const id of ["a", "b"]) {
        const player = document.createElement("cc-webplayer");
        player.setAttribute("composition-url", compositionUrl);
        player.setAttribute("event-prefix", "same:");
        player.setAttribute("monitoring", "false");
        player.addEventListener("same:composition-loaded", () => {
          heard[id]++;
        });
        document.body.append(player);
      }
    }, COMPOSITION_URL);

    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { heard: object }).heard)
      )
      .toEqual({ a: 1, b: 1, document: 2 });
    // And not more: a player hearing the other's event would come later
    await page.waitForTimeout(1000);
    expect(
      await page.evaluate(() => (window as unknown as { heard: object }).heard)
    ).toEqual({ a: 1, b: 1, document: 2 });
    expect(consoleErrors).toEqual([]);
  });
});

test.describe("Custom media attributes", () => {
  test("are read again when they change", async ({ page, consoleErrors }) => {
    await page.goto(pageUrl("wc"));
    // A custom media after the first item, then moved first
    await page.evaluate(addPlayers, {
      players: [
        {
          compositionUrl: COMPOSITION_URL,
          eventPrefix: "m:",
          withCustomMedia: true,
        },
      ],
      customMedia: CUSTOM_MEDIA.replace('index="0"', 'index="3"'),
    });
    await expect
      .poll(() => firstItemTypes(page))
      .toEqual({
        "m:": expect.any(String),
      });
    expect((await firstItemTypes(page))["m:"]).not.toBe("custom");

    const shownTypes = await page.evaluateHandle(() => {
      const types: string[] = [];
      document.addEventListener("m:item-change", event =>
        types.push((event as CustomEvent).detail.item.type)
      );
      return types;
    });
    await page.evaluate(() =>
      document
        .querySelector(
          'cc-webplayer[event-prefix="m:"] cc-webplayer-custom-media'
        )!
        .setAttribute("index", "0")
    );

    await expect
      .poll(() => shownTypes.evaluate(types => types.at(-1)))
      .toBe("custom");
    expect(consoleErrors).toEqual([]);
  });
});
