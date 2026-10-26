import { COMPOSITION_URL } from "@car-cutter/demo";
import { attachEventLog, renderDemoPage } from "@car-cutter/demo/dom";
import { appendWebPlayer } from "@car-cutter/vanilla-webplayer";
import "@car-cutter/demo/styles.css";

const { mediaSlot, eventsSlot } = renderDemoPage(
  document.getElementById("app")!,
  "vanilla"
);

attachEventLog(eventsSlot);

appendWebPlayer(mediaSlot, {
  compositionUrl: COMPOSITION_URL,
  infiniteCarrousel: true,
  permanentGallery: true,
});
