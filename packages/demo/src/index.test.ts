import { describe, expect, it } from "vitest";

import * as bundles from "./bundles";
import * as constants from "./constants";
import * as events from "./events";
import * as demo from "./index";
import * as themes from "./themes";

describe("index", () => {
  it("re-exports the shared modules", () => {
    expect(demo).toMatchObject({
      ...bundles,
      ...constants,
      ...events,
      ...themes,
    });
  });
});
