// DOM rendering of the shared layout, for the demos without a UI framework
// (vanilla, web component, script tag, iframe and the index page).

import { demoUrl } from "./constants";
import {
  EVENT_LOG_LIMIT,
  EVENT_PREFIX,
  PLAYER_EVENTS,
  createLogEntry,
} from "./events";
import { THEMES, themeStyle, type Theme, type ThemeKey } from "./themes";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const e = escapeHtml;

/** Header with the integration's branding; the tile links back to the index */
export function headerHtml(t: Theme): string {
  return `
<header class="dm-header">
  <div class="dm-header__inner">
    <a class="dm-brand" href="${demoUrl("index")}" title="All demos">
      <span class="dm-brand__tile">${e(t.mono)}</span>
      <span class="dm-brand__text">
        <span class="dm-brand__title">${e(t.title)}</span>
        <span class="dm-brand__subtitle">CarCutter WebPlayer integration</span>
      </span>
    </a>
    <span class="dm-pill" data-slot="pkg">${e(t.pkg)}</span>
  </div>
</header>`;
}

export function demoPageHtml(t: Theme): string {
  return `${headerHtml(t)}
<main class="dm-main">
  <div class="dm-stage" data-slot="media"></div>
  <div class="dm-below" data-slot="events"></div>
</main>`;
}

/** Applies the `.dm` root class and the theme's CSS variables */
export function applyTheme(root: HTMLElement, theme?: Theme) {
  root.classList.add("dm");
  if (theme) {
    Object.entries(themeStyle(theme)).forEach(([key, value]) =>
      root.style.setProperty(key, value)
    );
  }
}

/**
 * Renders the shared demo page into `root`.
 * Returns the media slot (where the WebPlayer goes), the events slot and the
 * header pill showing the package.
 */
export function renderDemoPage(root: HTMLElement, key: ThemeKey) {
  const theme = THEMES[key];

  applyTheme(root, theme);
  root.classList.add("dm--fit");
  root.innerHTML = demoPageHtml(theme);

  return {
    mediaSlot: root.querySelector<HTMLElement>('[data-slot="media"]')!,
    eventsSlot: root.querySelector<HTMLElement>('[data-slot="events"]')!,
    pkgSlot: root.querySelector<HTMLElement>('[data-slot="pkg"]')!,
  };
}

function eventsPanelHtml(source: string, body: string) {
  return `
<details class="dm-events" open>
  <summary class="dm-events__summary">
    <span>Player events</span>
    <span class="dm-events__count" data-count>0</span>
  </summary>
  <div class="dm-events__body">
    <div class="dm-events__toolbar">
      <span>${e(source)}</span>
      ${
        body
          ? ""
          : '<button type="button" class="dm-events__clear" data-clear>Clear</button>'
      }
    </div>
    ${
      body ||
      '<p class="dm-events__empty">Waiting for events…</p><ol class="dm-events__list"></ol>'
    }
  </div>
</details>`;
}

/** Logs every `cc-webplayer:*` event dispatched on `document` into `slot` */
export function attachEventLog(slot: HTMLElement) {
  slot.innerHTML = eventsPanelHtml(
    `Listening on document · ${EVENT_PREFIX}*`,
    ""
  );

  const list = slot.querySelector<HTMLOListElement>(".dm-events__list")!;
  const empty = slot.querySelector<HTMLElement>(".dm-events__empty")!;
  const count = slot.querySelector<HTMLElement>("[data-count]")!;
  let total = 0;

  const render = () => {
    count.textContent = String(total);
    empty.hidden = list.childElementCount > 0;
  };

  slot.querySelector("[data-clear]")!.addEventListener("click", () => {
    list.replaceChildren();
    total = 0;
    render();
  });

  PLAYER_EVENTS.forEach(name => {
    document.addEventListener(EVENT_PREFIX + name, event => {
      const entry = createLogEntry(name, (event as CustomEvent).detail);
      const li = document.createElement("li");
      li.className = "dm-events__entry";
      li.innerHTML = `<span class="dm-events__time">${
        entry.time
      }</span><span class="dm-events__name">${
        entry.name
      }</span><span class="dm-events__detail">${e(entry.detail)}</span>`;
      list.prepend(li);
      while (list.childElementCount > EVENT_LOG_LIMIT)
        list.lastElementChild!.remove();
      total++;
      render();
    });
  });

  render();
}

/** Events panel that only shows a note (when events can't be observed) */
export function renderEventsNote(slot: HTMLElement, note: string) {
  slot.innerHTML = eventsPanelHtml(
    "Not available",
    `<p class="dm-events__empty">${e(note)}</p>`
  );
  slot.querySelector<HTMLElement>("[data-count]")!.textContent = "–";
}

/** Shown in the stage when a locally built bundle can't be loaded */
export function localBundleMissingHtml(pkg: string, cdnHref: string): string {
  return (
    `The local build of ${escapeHtml(pkg)} couldn't be loaded. Build it with ` +
    // `yarn build` ends with `--`: a --filter given to it would reach the
    // packages' build scripts instead of turbo
    `<code>yarn turbo build --filter=${escapeHtml(pkg)}</code> and reload, ` +
    `or <a href="${escapeHtml(cdnHref)}">use the CDN version</a>.`
  );
}

/** Replaces the stage content with a note (trusted HTML) */
export function renderStageNote(slot: HTMLElement, html: string) {
  slot.innerHTML = `<p class="dm-stage__note">${html}</p>`;
}
