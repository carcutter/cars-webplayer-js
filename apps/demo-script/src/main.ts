import {
  COMPOSITION_URL,
  SCRIPT_BUNDLE,
  SCRIPT_DIST,
  SCRIPT_PKG,
} from "@car-cutter/demo";
import {
  attachEventLog,
  escapeHtml,
  localBundleMissingHtml,
  renderDemoPage,
  renderStageNote,
} from "@car-cutter/demo/dom";
import "@car-cutter/demo/styles.css";

// `?bundle=cdn` loads the published file instead of the local build from
// packages/, to check changes before release.
const useCdn = new URLSearchParams(location.search).get("bundle") === "cdn";

/** Link to this page, loading the CDN file or the local build */
function pageHref(cdn: boolean): string {
  return cdn ? "?bundle=cdn" : location.pathname;
}

const { mediaSlot, eventsSlot, pkgSlot } = renderDemoPage(
  document.getElementById("app")!,
  "script"
);

pkgSlot.textContent = useCdn
  ? SCRIPT_BUNDLE.cdnUrl.replace(/^https:\/\//, "")
  : `${SCRIPT_DIST} (local)`;

const note = document.createElement("p");
note.className = "dm-note";
note.innerHTML = useCdn
  ? `Published CDN file · <a href="${pageHref(false)}">use the local build</a>`
  : `Local build · <a href="${pageHref(true)}">use the CDN file</a>`;
attachEventLog(eventsSlot);
eventsSlot.prepend(note);

mediaSlot.innerHTML = `
  <cc-webplayer
    class="dm-player"
    composition-url="${COMPOSITION_URL}"
    infinite-carrousel="true"
    permanent-gallery="true"
  ></cc-webplayer>`;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    // Rejects with the source, so the page can tell what failed
    script.onerror = () => reject(src);
    document.head.append(script);
  });
}

// The bundle defines <cc-webplayer>: no npm package is involved, exactly like
// on a customer website. It is added after the listeners and the element, so
// the event log catches composition-loading too.
loadScript(useCdn ? SCRIPT_BUNDLE.cdnUrl : SCRIPT_BUNDLE.localPath).catch(
  (src: string) =>
    renderStageNote(
      mediaSlot,
      src === SCRIPT_BUNDLE.localPath
        ? localBundleMissingHtml(SCRIPT_PKG, pageHref(true))
        : `<code>${escapeHtml(
            src
          )}</code> couldn't be loaded. Check the network and reload.`
    )
);
