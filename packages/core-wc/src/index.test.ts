import { describe, expect, it, vi } from "vitest";

import * as coreWc from "../index";

vi.mock("@car-cutter/core-ui", () => ({
  WebPlayer: () => null,
  WebPlayerCustomMedia: () => null,
  WebPlayerIcon: () => null,
}));
vi.mock("@car-cutter/core-ui/style.css?inline", () => ({ default: "" }));

describe("@car-cutter/core-wc", () => {
  it("exposes its API", () => {
    expect(Object.keys(coreWc).sort()).toEqual([
      "WEB_PLAYER_WC_PROPS",
      "WebPlayerWithInjectedStyles",
      "checkCustomElementsDefinition",
      "ensureCustomElementsDefinition",
      "webPlayerCustomMediaPropsToAttributes",
      "webPlayerIconPropsToAttributes",
      "webPlayerPropsToAttributes",
    ]);
  });
});
