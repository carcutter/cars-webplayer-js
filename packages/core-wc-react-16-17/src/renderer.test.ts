import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { renderer } from "./renderer";

// React 16 / 17 APIs, removed from the React installed in the repo (19)
const reactDom = vi.hoisted(() => ({
  render: vi.fn(),
  unmountComponentAtNode: vi.fn(),
}));
vi.mock("react-dom", () => reactDom);

const Greeting = ({ name }: { name: string }) => name;

describe("renderer", () => {
  const root = document.createElement("div").attachShadow({ mode: "open" });

  it("renders the component into the container with ReactDOM.render", () => {
    renderer.render(root, Greeting, { name: "Ann" });

    expect(reactDom.render).toHaveBeenCalledWith(
      createElement(Greeting, { name: "Ann" }),
      root
    );
  });

  it("unmounts it with ReactDOM.unmountComponentAtNode", () => {
    renderer.unmount(root);

    expect(reactDom.unmountComponentAtNode).toHaveBeenCalledWith(root);
  });
});
