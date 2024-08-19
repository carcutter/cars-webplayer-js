import { WEB_PLAYER_CUSTOM_ELEMENTS_NAME } from "@car-cutter/core-webplayer";
import { WebPlayerProps } from "@car-cutter/react-webplayer";
import { ensureCustomElementsDefinition } from "@car-cutter/wc-webplayer";

function camelToKebabCase(str: string) {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

export function appendWebPlayerElement(
  parentElement: HTMLElement,
  config: WebPlayerProps
) {
  ensureCustomElementsDefinition();

  const elmt = document.createElement(WEB_PLAYER_CUSTOM_ELEMENTS_NAME);

  Object.entries(config).forEach(([key, value]) => {
    elmt.setAttribute(camelToKebabCase(key), value.toString());
  });

  parentElement.appendChild(elmt);
}
