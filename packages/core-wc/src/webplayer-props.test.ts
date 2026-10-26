import { describe, expect, it } from "vitest";

import { WEB_PLAYER_WC_PROPS } from "./webplayer-props";

describe("WEB_PLAYER_WC_PROPS", () => {
  // The map is typed against WebPlayerProps (a missing prop fails the build);
  // this pins the props whose absence already shipped once (#235)
  it("lists the integration mode props", () => {
    expect(WEB_PLAYER_WC_PROPS).toMatchObject({
      integration: "boolean",
      maxItemsShown: "number",
    });
  });

  it("only uses types r2wc can parse from attributes", () => {
    expect(new Set(Object.values(WEB_PLAYER_WC_PROPS))).toEqual(
      new Set(["string", "number", "boolean"])
    );
  });
});
