import { afterEach, describe, expect, it, vi } from "vitest";

import * as entry from "../index";

import { appendWebPlayer } from "./lib";

const ensureCustomElementsDefinition = vi.hoisted(() => vi.fn());
vi.mock("@car-cutter/wc-webplayer", async importOriginal => ({
  ...(await importOriginal<object>()),
  ensureCustomElementsDefinition,
}));

afterEach(() => document.body.replaceChildren());

describe("appendWebPlayer", () => {
  it("appends <cc-webplayer> with the props as attributes", () => {
    appendWebPlayer(document.body, {
      compositionUrl: "https://x/c.json",
      permanentGallery: true,
      integration: undefined,
    });

    const el = document.body.querySelector("cc-webplayer")!;
    expect(ensureCustomElementsDefinition).toHaveBeenCalled();
    expect(el.getAttribute("composition-url")).toBe("https://x/c.json");
    expect(el.getAttribute("permanent-gallery")).toBe("true");
    expect(el.hasAttribute("integration")).toBe(false);
    expect(el.children).toHaveLength(0);
  });

  it("adds the custom medias and icons inside it", () => {
    const image = document.createElement("img");
    const svg = document.createElement("svg");

    appendWebPlayer(
      document.body,
      { compositionUrl: "https://x/c.json" },
      {
        customMedias: [{ index: 4, thumbnailSrc: "t.jpg", element: image }],
        icons: [{ name: "UI_IMAGE", element: svg }],
      }
    );

    const el = document.body.querySelector("cc-webplayer")!;
    const media = el.querySelector("cc-webplayer-custom-media")!;
    expect(media.getAttribute("index")).toBe("4");
    expect(media.getAttribute("thumbnail-src")).toBe("t.jpg");
    expect(media.firstChild).toBe(image);

    const icon = el.querySelector("cc-webplayer-icon")!;
    expect(icon.getAttribute("name")).toBe("UI_IMAGE");
    expect(icon.firstChild).toBe(svg);
  });

  it("is exposed with the core constants", () => {
    expect(entry).toMatchObject({
      appendWebPlayer,
      WEB_PLAYER_WC_TAG: "cc-webplayer",
      DEFAULT_EVENT_PREFIX: "cc-webplayer:",
    });
  });
});
