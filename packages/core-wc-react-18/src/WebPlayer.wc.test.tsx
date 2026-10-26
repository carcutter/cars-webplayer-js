import { act } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import WebPlayerWebComponent from "./WebPlayer.wc";

// The real element (r2wc v2 + patchWebComponentProps) around a stub player
// recording the props it gets
const received = vi.hoisted(() => ({ props: {} as Record<string, unknown> }));
vi.mock("@car-cutter/core-ui", () => ({
  WebPlayer: (props: Record<string, unknown>) => {
    received.props = props;
    return null;
  },
}));
vi.mock("@car-cutter/core-ui/dist/style.css?inline", () => ({ default: "" }));

type Element = HTMLElement & Record<string, unknown>;

beforeAll(() => customElements.define("x-webplayer", WebPlayerWebComponent));

async function mount(attributes: Record<string, string> = {}) {
  const el = document.createElement("x-webplayer") as Element;
  Object.entries(attributes).forEach(([key, value]) =>
    el.setAttribute(key, value)
  );
  await act(async () => document.body.append(el));
  return el;
}

describe("<cc-webplayer> props", () => {
  it("passes parsed attributes to the player", async () => {
    await mount({
      "composition-url": "https://x/c.json",
      "permanent-gallery": "true",
      "max-items-shown": "2",
      integration: "false",
    });

    expect(received.props).toMatchObject({
      compositionUrl: "https://x/c.json",
      permanentGallery: true,
      maxItemsShown: 2,
      integration: false,
    });
  });

  it('reads a "false" string set as a property as false (#229)', async () => {
    const el = await mount({ "composition-url": "https://x/c.json" });

    await act(async () => {
      el.integration = "false";
      el.monitoring = "false";
    });

    expect(received.props).toMatchObject({
      integration: false,
      monitoring: false,
    });
  });

  it("resets a prop when its attribute is removed (#235)", async () => {
    const el = await mount({ "permanent-gallery": "true" });
    expect(received.props.permanentGallery).toBe(true);

    await act(async () => el.removeAttribute("permanent-gallery"));

    expect(received.props.permanentGallery).toBeUndefined();
  });
});
