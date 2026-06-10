export const RESIZE_TRANSITION_DURATION = 500;

// Mirrors the `max-small` breakpoint defined in tailwind.config.ts
// (BREAKPOINT_SMALL_PORTRAIT = 768, BREAKPOINT_SMALL_LANDSCAPE = 1024).
// Used at runtime (via window.matchMedia) to keep JS behavior in sync with
// the `max-small:` Tailwind utilities. Comma acts as the "or" combinator.
export const MAX_SMALL_MEDIA_QUERY =
  "(orientation: portrait) and (max-width: 767px), (orientation: landscape) and (max-width: 1023px)";
