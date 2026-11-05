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
    expect(media.attributes("index")).toBe("4");
    expect(media.attributes("thumbnail-src")).toBe("t.jpg");
    expect(media.find("img").exists()).toBe(true);

    const icon = mount(WebPlayerIcon, {
      props: { name: "UI_IMAGE" },
      slots: { default: "<svg />" },
    });
    expect(icon.attributes("name")).toBe("UI_IMAGE");
    expect(icon.find("svg").exists()).toBe(true);
  });
});

describe("entry", () => {
  it("exposes the components and the core constants", () => {
    // expect.any() is typed any
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    expect(entry).toMatchObject({
      WebPlayer: expect.any(Object),
      WebPlayerCustomMedia: expect.any(Object),
      WebPlayerIcon: expect.any(Object),
      WEB_PLAYER_WC_TAG: "cc-webplayer",
      DEFAULT_EVENT_PREFIX: "cc-webplayer:",
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  });
});
