import { DestroyRef, effect, inject, untracked } from "@angular/core";

/**
 * Applies a value read from the inputs in an effect, and also on a microtask
 * queued at creation. The web component renders on a microtask once it's
 * connected: when the change detection doesn't run in the same task as the
 * creation (a component created with createComponent outside of it), the
 * effect would only run after that first render. `apply` must do nothing when
 * the value is the one it applied last.
 */
export function syncEarly<T>(read: () => T, apply: (value: T) => void) {
  let destroyed = false;
  inject(DestroyRef).onDestroy(() => (destroyed = true));

  effect(() => apply(read()));

  queueMicrotask(() => {
    if (destroyed) {
      return;
    }

    let value: T;
    try {
      value = untracked(read);
    } catch (error) {
      // A required input isn't set yet (NG0950): the effect applies it once
      // it is
      if (String(error).includes("NG0950")) {
        return;
      }
      throw error;
    }
    apply(value);
  });
}
