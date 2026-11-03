import { WEB_PLAYER_WC_TAG } from "@car-cutter/core";

export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

export function isSelfEvent(
  event: Pick<Event, "target" | "currentTarget">,
): boolean {
  return event.target === event.currentTarget;
}

/**
 * The document or shadow root holding the element. Not with `instanceof`,
 * which fails for a node of another window (an iframe).
 */
export function getRootNode(
  element: Element | null
): Document | ShadowRoot | null {
  const root = element?.getRootNode();

  if (root?.nodeType === Node.DOCUMENT_NODE) {
    return root as Document;
  }
  if (root?.nodeType === Node.DOCUMENT_FRAGMENT_NODE && "host" in root) {
    return root as ShadowRoot;
  }
  return null;
}

/**
 * The web component whose shadow root holds the element, if any: its
 * children are the customizations of the player. Its own one, not the first
 * one of the document.
 */
export function getWebPlayerHost(element: Element | null): Element | null {
  const root = getRootNode(element);
  const host = root && "host" in root ? root.host : null;

  return host?.localName === WEB_PLAYER_WC_TAG ? host : null;
}
