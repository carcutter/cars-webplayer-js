import type {
  WebPlayerProps,
  WebPlayerCustomMediaProps,
  WebPlayerIconProps,
} from "@car-cutter/core";
import {
  ensureCustomElementsDefinition,
  webPlayerPropsToAttributes,
  WEB_PLAYER_WC_TAG,
  webPlayerCustomMediaPropsToAttributes,
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  webPlayerIconPropsToAttributes,
  WEB_PLAYER_ICON_WC_TAG,
} from "@car-cutter/wc-webplayer";

export function appendWebPlayer(
  parentElement: HTMLElement,
  webPlayerProps: WebPlayerProps,
  customization?: {
    customMedias?: (WebPlayerCustomMediaProps & { element: HTMLElement })[];
    icons?: (WebPlayerIconProps & { element: HTMLElement })[];
  }
) {
  const setAttributes = (
    element: HTMLElement,
    attributes: Record<string, string>
  ) => {
    Object.entries(attributes).forEach(([key, value]) =>
      element.setAttribute(key, value)
    );
  };

  ensureCustomElementsDefinition();

  // - Create WebPlayer
  const webPlayerElement = document.createElement(WEB_PLAYER_WC_TAG);
  const webPlayerAttributes = webPlayerPropsToAttributes(webPlayerProps);
  setAttributes(webPlayerElement, webPlayerAttributes);

  // - Customization
  // Custom medias
  customization?.customMedias?.forEach(customMedia => {
    const customMediaElement = document.createElement(
      WEB_PLAYER_CUSTOM_MEDIA_WC_TAG
    );

    const { element, ...props } = customMedia;

    customMediaElement.appendChild(element);

    const mediaAttributes = webPlayerCustomMediaPropsToAttributes(props);
    setAttributes(customMediaElement, mediaAttributes);
    webPlayerElement.appendChild(customMediaElement);
  });
  // Custom icons
  customization?.icons?.forEach(icon => {
    const iconElement = document.createElement(WEB_PLAYER_ICON_WC_TAG);

    const { element, ...props } = icon;

    iconElement.appendChild(element);

    const iconAttributes = webPlayerIconPropsToAttributes(props);
    setAttributes(iconElement, iconAttributes);
    webPlayerElement.appendChild(iconElement);
  });

  // - Append Element to Dom
  parentElement.appendChild(webPlayerElement);
}
