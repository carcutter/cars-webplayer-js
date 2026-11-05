import { describe, expect, it } from "vitest";

import { propsToAttributes } from "./utils";

describe("propsToAttributes", () => {
  it("dash-cases keys, stringifies values and skips null and undefined ones", () => {
    expect(
      propsToAttributes({
        compositionUrl: "https://x/c.json",
        permanentGallery: false,
        maxItemsShown: 2,
        autoLoad360: true,
        eventPrefix: undefined,
        analyticsUrl: null,
      })
    ).toEqual({
      "composition-url": "https://x/c.json",
      "permanent-gallery": "false",
      "max-items-shown": "2",
      "auto-load360": "true",
    });
  });
});
