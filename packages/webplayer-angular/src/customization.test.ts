import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { describe, expect, it } from "vitest";

import { WebPlayerCustomMedia } from "./web-player-custom-media";
import { WebPlayerIcon } from "./web-player-icon";

import * as entry from "./index";

@Component({
  imports: [WebPlayerCustomMedia, WebPlayerIcon],
  template: `
    <car-cutter-webplayer-custom-media
      [index]="index()"
      [thumbnailSrc]="thumbnailSrc()"
    >
      <img alt="custom" />
    </car-cutter-webplayer-custom-media>
    <car-cutter-webplayer-icon name="UI_IMAGE"
      ><svg
    /></car-cutter-webplayer-icon>
  `,
})
class Host {
  readonly index = signal(4);
  readonly thumbnailSrc = signal<string | undefined>("t.jpg");
}

describe("<car-cutter-webplayer-custom-media> and <car-cutter-webplayer-icon>", () => {
  it("render their elements with attributes and content", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    const media = root.querySelector("cc-webplayer-custom-media")!;
    expect(media.getAttribute("index")).toBe("4");
    expect(media.getAttribute("thumbnail-src")).toBe("t.jpg");
    expect(media.querySelector("img")).not.toBeNull();

    const icon = root.querySelector("cc-webplayer-icon")!;
    expect(icon.getAttribute("name")).toBe("UI_IMAGE");
    expect(icon.querySelector("svg")).not.toBeNull();
  });

  it("follow input updates", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const media = fixture.nativeElement.querySelector(
      "cc-webplayer-custom-media"
    ) as HTMLElement;

    fixture.componentInstance.index.set(2);
    fixture.componentInstance.thumbnailSrc.set(undefined);
    fixture.detectChanges();

    expect(media.getAttribute("index")).toBe("2");
    expect(media.hasAttribute("thumbnail-src")).toBe(false);
  });
});

describe("entry", () => {
  it("exposes the components and the core constants", () => {
    expect(entry).toMatchObject({
      WebPlayer: expect.any(Function),
      WebPlayerCustomMedia: expect.any(Function),
      WebPlayerIcon: expect.any(Function),
      WEB_PLAYER_WC_TAG: "cc-webplayer",
      DEFAULT_EVENT_PREFIX: "cc-webplayer:",
      DEFAULT_ANALYTICS_EVENT_PREFIX: "cc-analytics:",
    });
  });
});
