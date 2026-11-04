import { act } from "react";
import { describe, expect, it } from "vitest";

import { renderer } from "./renderer";

const Greeting = ({ name }: { name: string }) => <p>Hello {name}</p>;

function container() {
  return document.createElement("div").attachShadow({ mode: "open" });
}

describe("renderer", () => {
  it("renders the component into the container, then again with new props", async () => {
    const root = container();

    await act(async () => renderer.render(root, Greeting, { name: "Ann" }));
    expect(root.innerHTML).toBe("<p>Hello Ann</p>");

    await act(async () => renderer.render(root, Greeting, { name: "Bob" }));
    expect(root.innerHTML).toBe("<p>Hello Bob</p>");
  });

  it("unmounts the component, and can render it again after", async () => {
    const root = container();
    await act(async () => renderer.render(root, Greeting, { name: "Ann" }));

    await act(async () => renderer.unmount(root));
    expect(root.innerHTML).toBe("");

    await act(async () => renderer.render(root, Greeting, { name: "Bob" }));
    expect(root.innerHTML).toBe("<p>Hello Bob</p>");
  });

  it("ignores the unmount of a container it didn't render", () => {
    expect(() => renderer.unmount(container())).not.toThrow();
  });
});
