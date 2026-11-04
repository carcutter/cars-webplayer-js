import { act } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { WEB_PLAYER_WC_TAG } from "@car-cutter/core";

import { ensureCustomElementsDefinition } from "../index";

// The real <cc-webplayer>, rendered with React, around a stub player
// recording the props it gets and whether it is mounted
const received = vi.hoisted(() => ({
  props: undefined as Record<string, unknown> | undefined,
  mounted: 0,
}));
vi.mock("@car-cutter/core-ui", async () => {
  const { useEffect } = await import("react");
  return {
    WebPlayer: (props: Record<string, unknown>) => {
      received.props = props;
      useEffect(() => {
        received.mounted++;
        return () => {
          received.mounted--;
        };
      }, []);
      return null;
    },
    WebPlayerCustomMedia: () => null,
    WebPlayerIcon: () => null,
  };
});
vi.mock("@car-cutter/core-ui/style.css?inline", () => ({ default: "" }));

type Element = HTMLElement & Record<string, unknown>;

beforeAll(ensureCustomElementsDefinition);

async function mount(attributes: Record<string, string> = {}) {
  const el = document.createElement(WEB_PLAYER_WC_TAG) as Element;
  Object.entries(attributes).forEach(([key, value]) =>
    el.setAttribute(key, value)
  );
  await act(async () => document.body.append(el));
  return el;
}

describe("<cc-webplayer>", () => {
  it("passes the parsed attributes to the player", async () => {
    await mount({
      "composition-url": "https://x/c.json",
      "permanent-gallery": "true",
      "max-items-shown": "2",
      integration: "false",
    });

    expect(received.props).toEqual({
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
    expect(received.props?.permanentGallery).toBe(true);

    await act(async () => el.removeAttribute("permanent-gallery"));

    expect(received.props).not.toHaveProperty("permanentGallery");
  });

  it("unmounts the player once removed, but not when moved", async () => {
    document.body.replaceChildren();
    await act(async () => vi.waitFor(() => expect(received.mounted).toBe(0)));
    const el = await mount();
    const other = document.createElement("div");
    document.body.append(other);

    await act(async () => {
      other.append(el);
      await new Promise(resolve => setTimeout(resolve));
    });
    expect(received.mounted).toBe(1);

    await act(async () => {
      el.remove();
      await new Promise(resolve => setTimeout(resolve));
    });
    expect(received.mounted).toBe(0);
  });
});
