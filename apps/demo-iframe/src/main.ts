import { IFRAME_QUERY, IFRAME_URL, SCRIPT_BUNDLES } from "@car-cutter/demo";
import {
  localBundleMissingHtml,
  renderDemoPage,
  renderEventsNote,
  renderStageNote,
} from "@car-cutter/demo/dom";
import "@car-cutter/demo/styles.css";

// `?bundle=cdn` embeds the hosted iframe page; by default the page embeds its
// local copy (public/player), which loads the bundle built from
// packages/webplayer-script, to check changes before release.
const useCdn = new URLSearchParams(location.search).get("bundle") === "cdn";

const { mediaSlot, eventsSlot, pkgSlot } = renderDemoPage(
  document.getElementById("app")!,
  "iframe"
);

if (useCdn) {
  pkgSlot.textContent = IFRAME_URL.replace(/^https:\/\/|\/index\.html.*$/g, "");
}

const note = document.createElement("p");
note.className = "dm-note";
note.innerHTML = useCdn
  ? `Hosted iframe page on the CDN · <a href="?">use the local build</a>`
  : `Local copy of the iframe page with the local bundle · <a href="?bundle=cdn">use the hosted iframe</a>`;
renderEventsNote(
  eventsSlot,
  "The WebPlayer runs inside the iframe, so its cc-webplayer:* events are dispatched on the iframe's document and can't be observed from this page."
);
eventsSlot.prepend(note);

const iframe = document.createElement("iframe");
iframe.className = "dm-iframe";
iframe.src = useCdn ? IFRAME_URL : `/player/index.html${IFRAME_QUERY}`;
iframe.title = "Car WebPlayer";
iframe.allow = "fullscreen";
iframe.allowFullscreen = true;

if (useCdn) {
  mediaSlot.append(iframe);
} else {
  // The local iframe page loads the local bundle: check it's there, otherwise
  // the iframe would just stay blank
  fetch(SCRIPT_BUNDLES.default.localPath, { method: "HEAD" }).then(
    res =>
      res.ok
        ? mediaSlot.append(iframe)
        : renderStageNote(
            mediaSlot,
            localBundleMissingHtml(SCRIPT_BUNDLES.default.pkg, "?bundle=cdn")
          ),
    () =>
      renderStageNote(
        mediaSlot,
        "Couldn't reach the dev server to check the local bundle. Reload the page."
      )
  );
}
