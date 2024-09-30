import type {
  WebPlayerProps,
  WebPlayerCustomMediaProps,
} from "@car-cutter/core-ui";
import {
  WEB_PLAYER_WC_TAG,
  ensureCustomElementsDefinition,
  webPlayerPropsToAttributes,
  webPlayerCustomMediaPropsToAttributes,
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
} from "@car-cutter/wc-webplayer";

export function appendWebPlayer(
  parentElement: HTMLElement,
  webPlayerProps: WebPlayerProps,
  customisation?: {
    customMedias?: (WebPlayerCustomMediaProps & { element: HTMLElement })[];
  }
) {
  const setAttributes = (
    elmt: HTMLElement,
    attributes: Record<string, string>
  ) => {
    Object.entries(attributes).forEach(([key, value]) =>
      elmt.setAttribute(key, value)
    );
  };

  ensureCustomElementsDefinition();

  // - Create WebPlayer
  const webPlayerElmt = document.createElement(WEB_PLAYER_WC_TAG);
  const webPlayerAttributes = webPlayerPropsToAttributes(webPlayerProps);
  setAttributes(webPlayerElmt, webPlayerAttributes);

  // - Customisation
  customisation?.customMedias?.forEach(customMedia => {
    const customMediaElmt = document.createElement(
      WEB_PLAYER_CUSTOM_MEDIA_WC_TAG
    );

    const { element, ...props } = customMedia;

    customMediaElmt.appendChild(element);

    const mediaAttributes = webPlayerCustomMediaPropsToAttributes(props);
    setAttributes(customMediaElmt, mediaAttributes);
    webPlayerElmt.appendChild(customMediaElmt);
  });

  // - Append Element to Dom
  parentElement.appendChild(webPlayerElmt);
}
