import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Fragment, jsx, jsxs } from "./jsx-runtime";

describe("jsx-runtime shim", () => {
  it("creates elements with the React it imports", () => {
    const createElement = vi.spyOn(React, "createElement");

    const element = jsx("div", { id: "a" });

    expect(createElement).toHaveBeenCalledWith("div", { id: "a" });
    expect(element).toMatchObject({
      type: "div",
      props: { id: "a" },
      key: null,
    });
  });

  it("passes the key along with the props", () => {
    expect(jsx("li", { children: "x" }, "k1")).toMatchObject({
      type: "li",
      key: "k1",
      props: { children: "x" },
    });
  });

  it("uses the same function for static children and React's Fragment", () => {
    expect(jsxs).toBe(jsx);
    expect(Fragment).toBe(React.Fragment);
  });
});
