import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  WebPlayerWithInjectedStyles,
  webPlayerPropsToAttributes,
} from "./webplayer";
import { webPlayerCustomMediaPropsToAttributes } from "./webplayer-custom-media";
import { webPlayerIconPropsToAttributes } from "./webplayer-icon";

vi.mock("@car-cutter/core-ui", () => ({
  WebPlayer: (props: { compositionUrl: string }) => (
    <div data-testid="player" data-url={props.compositionUrl} />
  ),
}));
vi.mock("@car-cutter/core-ui/dist/style.css?inline", () => ({
  default: ".player{}",
}));

describe("WebPlayerWithInjectedStyles", () => {
  it("renders the player styles next to the player", () => {
    const { container, getByTestId } = render(
      <WebPlayerWithInjectedStyles compositionUrl="https://x/c.json" />
    );

    expect(container.querySelector("style")?.textContent).toBe(".player{}");
    expect(getByTestId("player").dataset.url).toBe("https://x/c.json");
  });
});

describe("props to attributes", () => {
  it("maps WebPlayer props", () => {
    expect(
      webPlayerPropsToAttributes({
        compositionUrl: "https://x/c.json",
        infiniteCarrousel: true,
        integration: undefined,
      })
    ).toEqual({
      "composition-url": "https://x/c.json",
      "infinite-carrousel": "true",
    });
  });

  it("maps custom media and icon props", () => {
    expect(
      webPlayerCustomMediaPropsToAttributes({ index: 4, thumbnailSrc: "t.jpg" })
    ).toEqual({ index: "4", "thumbnail-src": "t.jpg" });
    expect(webPlayerIconPropsToAttributes({ name: "UI_IMAGE" })).toEqual({
      name: "UI_IMAGE",
    });
  });
});
