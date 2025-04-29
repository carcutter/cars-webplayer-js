import {
  WEB_PLAYER_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
} from "@car-cutter/core";

/**
 * Checks if WebPlayer's custom elements are defined and usable in the DOM.
 */
export function checkCustomElementsDefinition(): boolean {
  return (
    !!customElements.get(WEB_PLAYER_WC_TAG) &&
    !!customElements.get(WEB_PLAYER_CUSTOM_MEDIA_WC_TAG) &&
    !!customElements.get(WEB_PLAYER_ICON_WC_TAG)
  );
}
