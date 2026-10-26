import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  applyTheme,
  attachEventLog,
  escapeHtml,
  localBundleMissingHtml,
  renderDemoPage,
  renderEventsNote,
  renderStageNote,
} from "./dom";
import { EVENT_LOG_LIMIT } from "./events";
import { THEMES } from "./themes";

let root: HTMLElement;
beforeEach(() => {
  root = document.createElement("div");
  document.body.append(root);
});
afterEach(() => document.body.replaceChildren());

const dispatch = (name: string, detail?: unknown) =>
  document.dispatchEvent(new CustomEvent(`cc-webplayer:${name}`, { detail }));

describe("renderDemoPage", () => {
  it("renders the themed page and returns its slots", () => {
    const { mediaSlot, eventsSlot, pkgSlot } = renderDemoPage(root, "script");

    expect(root.classList.contains("dm")).toBe(true);
    expect(root.classList.contains("dm--fit")).toBe(true);
    expect(root.style.getPropertyValue("--dm-header-bg")).toBe(
      THEMES.script.headerBg
    );
    expect(root.querySelector(".dm-brand__title")!.textContent).toBe(
      THEMES.script.title
    );
    expect(root.querySelector<HTMLAnchorElement>(".dm-brand")!.href).toMatch(
      /:4170\/$/
    );
    expect(pkgSlot.textContent).toBe(THEMES.script.pkg);
    expect(mediaSlot.classList.contains("dm-stage")).toBe(true);
    expect(eventsSlot.classList.contains("dm-below")).toBe(true);
  });

  it("escapes the theme texts", () => {
    renderDemoPage(root, "script");

    expect(root.querySelector(".dm-brand__title")!.innerHTML).toBe(
      "&lt;script&gt; tag"
    );
  });
});

describe("applyTheme", () => {
  it("only adds the root class without a theme", () => {
    applyTheme(root);

    expect(root.className).toBe("dm");
    expect(root.getAttribute("style")).toBeNull();
  });
});

describe("attachEventLog", () => {
  it("logs player events, newest first, with a count", () => {
    attachEventLog(root);
    const count = () => root.querySelector("[data-count]")!.textContent;
    const names = () =>
      [...root.querySelectorAll(".dm-events__name")].map(n => n.textContent);

    expect(count()).toBe("0");
    expect(root.querySelector<HTMLElement>(".dm-events__empty")!.hidden).toBe(
      false
    );

    dispatch("composition-loading", "https://x/c.json");
    dispatch("item-change", { index: 1, item: { type: "<image>" } });

    expect(names()).toEqual(["item-change", "composition-loading"]);
    expect(count()).toBe("2");
    expect(root.querySelector<HTMLElement>(".dm-events__empty")!.hidden).toBe(
      true
    );
    expect(root.querySelector(".dm-events__detail")!.innerHTML).toBe(
      "#1 · &lt;image&gt;"
    );
  });

  it(`keeps the last ${EVENT_LOG_LIMIT} entries but counts them all`, () => {
    attachEventLog(root);

    for (let i = 0; i < EVENT_LOG_LIMIT + 5; i++) dispatch("gallery-open");

    expect(root.querySelectorAll(".dm-events__entry")).toHaveLength(
      EVENT_LOG_LIMIT
    );
    expect(root.querySelector("[data-count]")!.textContent).toBe(
      String(EVENT_LOG_LIMIT + 5)
    );
  });

  it("clears the log", () => {
    attachEventLog(root);
    dispatch("gallery-close");

    root.querySelector<HTMLButtonElement>("[data-clear]")!.click();

    expect(root.querySelectorAll(".dm-events__entry")).toHaveLength(0);
    expect(root.querySelector("[data-count]")!.textContent).toBe("0");
  });
});

describe("notes", () => {
  it("shows an escaped note instead of the log", () => {
    renderEventsNote(root, "Events <stay> in the iframe");

    expect(root.querySelector("[data-clear]")).toBeNull();
    expect(root.querySelector("[data-count]")!.textContent).toBe("–");
    expect(root.querySelector(".dm-events__empty")!.innerHTML).toBe(
      "Events &lt;stay&gt; in the iframe"
    );
  });

  it("tells how to build a missing local bundle", () => {
    renderStageNote(root, localBundleMissingHtml("@car-cutter/x", "?a=1&b=2"));

    const note = root.querySelector(".dm-stage__note")!;
    expect(note.querySelector("code")!.textContent).toBe(
      "yarn turbo build --filter=@car-cutter/x"
    );
    expect(note.querySelector("a")!.getAttribute("href")).toBe("?a=1&b=2");
  });

  it("escapes HTML", () => {
    expect(escapeHtml(`<a href="x">&</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;"
    );
  });
});
