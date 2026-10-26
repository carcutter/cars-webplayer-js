import {
  BUNDLE_VARIANTS,
  COMPOSITION_URL,
  SCRIPT_BUNDLES,
  reactUmdUrls,
  type BundleVariant,
} from "@car-cutter/demo";
import {
  attachEventLog,
  escapeHtml,
  localBundleMissingHtml,
  renderDemoPage,
  renderStageNote,
} from "@car-cutter/demo/dom";
import "@car-cutter/demo/styles.css";

// `?variant=` picks the bundle: `bundle.js` (React included) by default, or
// `bundle-react-16-17.js` / `bundle-react-18.js`, which use the React of the
// host page. `?bundle=cdn` loads the published file instead of the local build
// from packages/, to check changes before release.
const params = new URLSearchParams(location.search);
const variantParam = params.get("variant") as BundleVariant | null;
const variant: BundleVariant =
  variantParam && BUNDLE_VARIANTS.includes(variantParam)
    ? variantParam
    : "default";
const useCdn = params.get("bundle") === "cdn";
const bundle = SCRIPT_BUNDLES[variant];

/** Link to this page with other params */
function pageHref(next: { variant?: BundleVariant; cdn?: boolean }): string {
  const query = new URLSearchParams();
  const v = next.variant ?? variant;
  if (v !== "default") query.set("variant", v);
  if (next.cdn ?? useCdn) query.set("bundle", "cdn");
  const search = query.toString();
  return search ? `?${search}` : location.pathname;
}

const { mediaSlot, eventsSlot, pkgSlot } = renderDemoPage(
  document.getElementById("app")!,
  "script"
);

pkgSlot.textContent = useCdn
  ? bundle.cdnUrl.replace(/^https:\/\//, "")
  : `packages/${bundle.dir}/dist (local)`;

const note = document.createElement("p");
note.className = "dm-note";
note.innerHTML = [
  BUNDLE_VARIANTS.map(v =>
    v === variant
      ? `<strong>${SCRIPT_BUNDLES[v].name}</strong>`
      : `<a href="${pageHref({ variant: v })}">${SCRIPT_BUNDLES[v].name}</a>`
  ).join(" · "),
  useCdn
    ? `Published CDN file · <a href="${pageHref({
        cdn: false,
      })}">use the local build</a>`
    : `Local build · <a href="${pageHref({ cdn: true })}">use the CDN file</a>`,
  bundle.react ? `Host page provides React ${bundle.react} (UMD)` : "",
]
  .filter(Boolean)
  .join("<br>");
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
// the event log catches composition-loading too. The React variants need the
// React globals first, like on a site already using React.
const scripts = [
  ...(bundle.react ? reactUmdUrls(bundle.react) : []),
  useCdn ? bundle.cdnUrl : bundle.localPath,
];

scripts
  .reduce(
    (previous, src) => previous.then(() => loadScript(src)),
    Promise.resolve()
  )
  .catch((src: string) =>
    renderStageNote(
      mediaSlot,
      src === bundle.localPath
        ? localBundleMissingHtml(bundle.pkg, pageHref({ cdn: true }))
        : `<code>${escapeHtml(
            src
          )}</code> couldn't be loaded. Check the network and reload.`
    )
  );
