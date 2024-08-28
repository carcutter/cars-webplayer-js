import { WEB_PLAYER_WC_TAG, camelToDashedCase } from "@car-cutter/core";
import {
  ensureCustomElementsDefinition,
  type WebPlayerProps,
} from "@car-cutter/wc-webplayer";

export function appendWebPlayerElement(
  parentElement: HTMLElement,
  config: WebPlayerProps
) {
  ensureCustomElementsDefinition();

  const elmt = document.createElement(WEB_PLAYER_WC_TAG);

  // Set attributes (HTML attributes are using dashed-case)
  Object.entries(config).forEach(([key, value]) => {
    elmt.setAttribute(camelToDashedCase(key), value.toString());
  });

  parentElement.appendChild(elmt);
}
