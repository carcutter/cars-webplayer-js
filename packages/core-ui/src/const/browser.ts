export const RESIZE_TRANSITION_DURATION = 500;

// Breakpoint values (in px) shared between Tailwind (tailwind.config.ts) and
// runtime JS (via window.matchMedia). Single source of truth so the `small`/
// `large`/`max-small` media queries stay in sync across CSS and behavior.
export const BREAKPOINT_SMALL_PORTRAIT = 768;
export const BREAKPOINT_SMALL_LANDSCAPE = 1024;
export const BREAKPOINT_LARGE = 1280;

// Mirrors the `max-small` breakpoint defined in tailwind.config.ts.
// Used at runtime (via window.matchMedia) to keep JS behavior in sync with
// the `max-small:` Tailwind utilities. Comma acts as the "or" combinator.
export const MAX_SMALL_MEDIA_QUERY =
  `(orientation: portrait) and (max-width: ${BREAKPOINT_SMALL_PORTRAIT - 1}px), ` +
  `(orientation: landscape) and (max-width: ${BREAKPOINT_SMALL_LANDSCAPE - 1}px)`;

// Mirrors the `small` breakpoint defined in tailwind.config.ts.
export const SMALL_MEDIA_QUERY =
  `(orientation: portrait) and (min-width: ${BREAKPOINT_SMALL_PORTRAIT}px), ` +
  `(orientation: landscape) and (min-width: ${BREAKPOINT_SMALL_LANDSCAPE}px)`;

// Mirrors the `large` breakpoint defined in tailwind.config.ts.
export const LARGE_MEDIA_QUERY = `(min-width: ${BREAKPOINT_LARGE}px)`;

// Below this web-player width (px), expandable hotspots open the shared side
// details pane instead of expanding their description inline (0–479px range).
export const BREAKPOINT_HOTSPOT_SIDE_PANEL = 480;

// Width (in px) the inline hotspot detail panel grows to when expanded, per
// breakpoint. Mirrors the `w-72 small:w-80 large:w-96` classes in Hotspot.tsx
// (Tailwind spacing scale: 72 => 288, 80 => 320, 96 => 384). Used at runtime
// to decide the flip direction so the expanded panel fits within the media.
export const HOTSPOT_EXPANDED_PANEL_WIDTH = {
  base: 288,
  small: 320,
  large: 384,
} as const;
