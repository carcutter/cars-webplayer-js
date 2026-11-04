import {
  WEB_PLAYER_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
} from "@car-cutter/core";
import { WebPlayerCustomMedia, WebPlayerIcon } from "@car-cutter/core-ui";

import { createElementClass, type Renderer } from "./element";
import { WebPlayerWithInjectedStyles } from "./webplayer";
import {
  WEB_PLAYER_CUSTOM_MEDIA_WC_PROPS,
  WEB_PLAYER_ICON_WC_PROPS,
  WEB_PLAYER_WC_PROPS,
} from "./webplayer-props";

const TAGS = [
  WEB_PLAYER_WC_TAG,
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
];

/**
 * Checks if WebPlayer's custom elements are defined and usable in the DOM.
 */
export function checkCustomElementsDefinition(): boolean {
  return TAGS.every(tag => customElements.get(tag));
}

/**
 * Defines WebPlayer's custom elements in the DOM, rendered with the given
 * renderer, unless they are already defined. Throws, defining none, if only
 * some of them are: they would be rendered by different copies of React.
 */
export function ensureCustomElementsDefinition(renderer: Renderer): void {
  const defined = TAGS.filter(tag => customElements.get(tag));
  if (defined.length === TAGS.length) {
    return;
  }
  if (defined.length) {
    throw new Error(
      `${defined.join(", ")} already defined, by another WebPlayer bundle`
    );
  }

  customElements.define(
    WEB_PLAYER_WC_TAG,
    createElementClass(
      WebPlayerWithInjectedStyles,
      WEB_PLAYER_WC_PROPS,
      renderer
    )
  );
  customElements.define(
    WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
    createElementClass(
      WebPlayerCustomMedia,
      WEB_PLAYER_CUSTOM_MEDIA_WC_PROPS,
      renderer
    )
  );
  customElements.define(
    WEB_PLAYER_ICON_WC_TAG,
    createElementClass(WebPlayerIcon, WEB_PLAYER_ICON_WC_PROPS, renderer)
  );
}
