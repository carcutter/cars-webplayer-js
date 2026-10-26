import { COMPOSITION_URL } from "@car-cutter/demo";
import { attachEventLog, renderDemoPage } from "@car-cutter/demo/dom";
import {
  ensureCustomElementsDefinition,
  WEB_PLAYER_WC_TAG,
} from "@car-cutter/wc-webplayer";
import "@car-cutter/demo/styles.css";

ensureCustomElementsDefinition();

const { mediaSlot, eventsSlot } = renderDemoPage(
  document.getElementById("app")!,
  "wc"
);

attachEventLog(eventsSlot);

// <cc-webplayer composition-url="…" infinite-carrousel="true" permanent-gallery="true">
const webPlayer = document.createElement(WEB_PLAYER_WC_TAG);
webPlayer.className = "dm-player";
webPlayer.setAttribute("composition-url", COMPOSITION_URL);
webPlayer.setAttribute("infinite-carrousel", "true");
webPlayer.setAttribute("permanent-gallery", "true");
mediaSlot.append(webPlayer);
