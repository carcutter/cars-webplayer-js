import {
  DEMO_PORTS,
  DOCS_URL,
  REPO_URL,
  THEMES,
  THEME_KEYS,
  demoUrl,
  themeStyle,
} from "@car-cutter/demo";
import { applyTheme, escapeHtml as e } from "@car-cutter/demo/dom";
import "@car-cutter/demo/styles.css";

declare const __WEBPLAYER_VERSION__: string;

const root = document.getElementById("app")!;
applyTheme(root);

const cards = THEME_KEYS.map(key => {
  const theme = THEMES[key];
  const style = Object.entries(themeStyle(theme))
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");

  return `
<a class="dm-card" href="${demoUrl(key)}" style="${style}">
  <div class="dm-header">
    <div class="dm-header__inner">
      <span class="dm-brand">
        <span class="dm-brand__tile">${e(theme.mono)}</span>
        <span class="dm-brand__text">
          <span class="dm-brand__title">${e(theme.title)}</span>
          <span class="dm-brand__subtitle">yarn demo:${key}</span>
        </span>
      </span>
    </div>
  </div>
  <div class="dm-card__body">
    <span class="dm-card__pkg">${e(theme.pkg)}</span>
    <span class="dm-card__port">:${DEMO_PORTS[key]}</span>
  </div>
</a>`;
}).join("");

root.innerHTML = `
<header class="dm-header">
  <div class="dm-header__inner">
    <span class="dm-brand">
      <span class="dm-brand__tile">CC</span>
      <span class="dm-brand__text">
        <span class="dm-brand__title">CarCutter WebPlayer</span>
        <span class="dm-brand__subtitle">Integration demos</span>
      </span>
    </span>
    <span class="dm-pill">v${__WEBPLAYER_VERSION__}</span>
  </div>
</header>

<main class="dm-main">
  <div class="dm-grid">${cards}</div>
  <p class="dm-note">Every demo mounts the same composition with its own integration. The layout lives in <code>packages/demo</code>. <a href="${DOCS_URL}">Docs</a> · <a href="${REPO_URL}">GitHub</a></p>
</main>`;
