import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import type { Renderer } from "@car-cutter/core-wc";

/** Renders the elements with React 16.8 / 17, which have no createRoot */
export const renderer: Renderer = {
  render(container, Component, props) {
    render(createElement(Component, props), container);
  },
  unmount(container) {
    unmountComponentAtNode(container);
  },
};
