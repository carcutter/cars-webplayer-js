import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import WebPlayerCustomMedia from "./WebPlayerCustomMedia.vue";
import WebPlayerIcon from "./WebPlayerIcon.vue";

import * as entry from "./index";

describe("<WebPlayerCustomMedia> and <WebPlayerIcon>", () => {
  it("render their elements with attributes and slot", () => {
    const media = mount(WebPlayerCustomMedia, {
      props: { index: 4, thumbnailSrc: "t.jpg" },
      slots: { default: '<img alt="custom" />' },
    });
    expect(media.element.getAttribute("index")).toBe("4");
    expect(media.element.getAttribute("thumbnail-src")).toBe("t.jpg");
    expect(media.element.querySelector("img")).not.toBeNull();

    const icon = mount(WebPlayerIcon, {
      props: { name: "UI_IMAGE" },
      slots: { default: "<svg />" },
    });
    expect(icon.element.getAttribute("name")).toBe("UI_IMAGE");
    expect(icon.element.querySelector("svg")).not.toBeNull();
  });
});

describe("entry", () => {
  it("exposes the components and the core constants", () => {
    expect(entry).toMatchObject({
      WebPlayer: expect.any(Object),
      WebPlayerCustomMedia: expect.any(Object),
      WebPlayerIcon: expect.any(Object),
      WEB_PLAYER_WC_TAG: "cc-webplayer",
      DEFAULT_EVENT_PREFIX: "cc-webplayer:",
    });
  });
});
