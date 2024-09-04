import {
  WEB_PLAYER_WC_TAG,
  ensureCustomElementsDefinition,
  webPlayerPropsToAttributes,
  type WebPlayerProps,
} from "@car-cutter/wc-webplayer";

export function appendWebPlayerElement(
  parentElement: HTMLElement,
  props: WebPlayerProps
) {
  const attributes = webPlayerPropsToAttributes(props);

  ensureCustomElementsDefinition();

  // -- Append Element to Dom
  // Create
  const elmt = document.createElement(WEB_PLAYER_WC_TAG);
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) =>
    elmt.setAttribute(key, value)
  );
  // Append
  parentElement.appendChild(elmt);
}
