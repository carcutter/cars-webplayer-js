import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";

import type { Renderer } from "@car-cutter/core-wc";

const roots = new WeakMap<ShadowRoot, Root>();

/** Renders the elements with React 18+ (or preact, through its aliases) */
export const renderer: Renderer = {
  render(container, Component, props) {
    let root = roots.get(container);
    if (!root) {
      root = createRoot(container);
      roots.set(container, root);
    }
    root.render(createElement(Component, props));
  },
  unmount(container) {
    roots.get(container)?.unmount();
    roots.delete(container);
  },
};
