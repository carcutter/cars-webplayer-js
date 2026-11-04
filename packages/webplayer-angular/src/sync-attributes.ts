import { ElementRef, inject, Renderer2 } from "@angular/core";

import { syncEarly } from "./sync-early";

/**
 * Keeps the attributes of the web component rendered by the calling component
 * (the root element of its template) in sync with the given ones: sets the
 * changed ones and removes the ones that are gone, so that the element uses
 * its default again. Only attributes, never properties (#228).
 *
 * The element is taken from the host, not from a viewChild: the effect first
 * runs before the queries of the view are resolved.
 */
export function syncAttributes(
  attributes: () => Partial<Record<string, string>>
) {
  const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  const renderer = inject(Renderer2);
  let previous: Partial<Record<string, string>> = {};

  syncEarly(attributes, next => {
    const element = host.firstElementChild!;

    Object.keys(previous)
      .filter(name => next[name] === undefined)
      .forEach(name => renderer.removeAttribute(element, name));
    Object.entries(next)
      .filter(([name, value]) => value !== previous[name])
      .forEach(([name, value]) => renderer.setAttribute(element, name, value!));

    previous = next;
  });
}
