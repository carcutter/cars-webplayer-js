import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WebPlayerCustomMedia } from "./WebPlayerCustomMedia";
import { WebPlayerIcon } from "./WebPlayerIcon";

describe("<WebPlayerCustomMedia> and <WebPlayerIcon>", () => {
  it("render their elements with attributes and children", () => {
    const { container } = render(
      <>
        <WebPlayerCustomMedia index={4} thumbnailSrc="t.jpg">
          <img alt="custom" />
        </WebPlayerCustomMedia>
        <WebPlayerIcon name="UI_IMAGE">
          <svg />
        </WebPlayerIcon>
      </>
    );

    const media = container.querySelector("cc-webplayer-custom-media")!;
    expect(media.getAttribute("index")).toBe("4");
    expect(media.getAttribute("thumbnail-src")).toBe("t.jpg");
    expect(media.querySelector("img")).not.toBeNull();

    const icon = container.querySelector("cc-webplayer-icon")!;
    expect(icon.getAttribute("name")).toBe("UI_IMAGE");
    expect(icon.querySelector("svg")).not.toBeNull();
  });
});
