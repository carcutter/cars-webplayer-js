import { useMemo } from "react";

import type { Composition, MediaItem } from "@car-cutter/core";

import type { PlayerEventName } from "../events";

/** `on…` props of the React / Next.js `<WebPlayer>`, one per logged event */
export type PlayerEventHandlers = {
  onCompositionLoading: (url: string) => void;
  onCompositionLoaded: (composition: Composition) => void;
  onCompositionLoadError: (error: unknown) => void;
  onItemChange: (props: { index: number; item: MediaItem }) => void;
  onExtendModeOn: () => void;
  onExtendModeOff: () => void;
  onHotspotsOn: () => void;
  onHotspotsOff: () => void;
  onGalleryOpen: () => void;
  onGalleryClose: () => void;
};

/**
 * Event handlers to spread on `<WebPlayer>`, logging each event. Created once:
 * new handlers on each render would make `<WebPlayer>` re-register its
 * document listeners after every logged event.
 */
export function usePlayerEventHandlers(
  log: (name: PlayerEventName, detail?: unknown) => void
): PlayerEventHandlers {
  return useMemo(
    () => ({
      onCompositionLoading: url => log("composition-loading", url),
      onCompositionLoaded: composition =>
        log("composition-loaded", composition),
      onCompositionLoadError: error => log("composition-load-error", error),
      onItemChange: detail => log("item-change", detail),
      onExtendModeOn: () => log("extend-mode-on"),
      onExtendModeOff: () => log("extend-mode-off"),
      onHotspotsOn: () => log("hotspots-on"),
      onHotspotsOff: () => log("hotspots-off"),
      onGalleryOpen: () => log("gallery-open"),
      onGalleryClose: () => log("gallery-close"),
    }),
    [log]
  );
}
