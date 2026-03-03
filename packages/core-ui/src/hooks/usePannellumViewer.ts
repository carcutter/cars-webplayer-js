import { useEffect, useRef } from "react";
import "pannellum-react/es/pannellum/css/pannellum.css";
import "pannellum-react/es/pannellum/css/style-textInfo.css";
import "pannellum-react/es/pannellum/js/libpannellum.js";
import "pannellum-react/es/pannellum/js/pannellum.js";
import "pannellum-react/es/pannellum/js/RequestAnimationFrame";

import { HFOV, MAX_HFOV, MIN_HFOV, PITCH, YAW } from "../const/pannellum";

type PannellumViewer = {
  getHfov: () => number;
  setHfov: (hfov: number) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  destroy: () => void;
};

type PannellumViewerConfig = {
  image: string;
  preview?: string;
  autoLoad: boolean;
};

type PannellumViewerCallbacks = {
  onLoad?: () => void;
  onError?: () => void;
  onMousedown?: (event: Event) => void;
  onMouseup?: (event: Event) => void;
  onTouchstart?: (event: Event) => void;
  onTouchend?: (event: Event) => void;
};

export function usePannellumViewer(
  containerRef: React.RefObject<HTMLDivElement | null>,
  config: PannellumViewerConfig,
  callbacks: PannellumViewerCallbacks
): React.RefObject<PannellumViewer | null> {
  const viewerRef = useRef<PannellumViewer | null>(null);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pannellumGlobal = (
      window as Window & {
        pannellum?: {
          viewer: (
            node: HTMLElement,
            config: Record<string, unknown>
          ) => PannellumViewer;
        };
      }
    ).pannellum;

    if (!pannellumGlobal) {
      // eslint-disable-next-line no-console
      console.error("[InteriorThreeSixty] pannellum global not available");
      callbacksRef.current.onError?.();
      return;
    }

    const viewer = pannellumGlobal.viewer(container, {
      type: "equirectangular",
      panorama: config.image,
      preview: config.preview,
      pitch: PITCH,
      yaw: YAW,
      hfov: HFOV,
      maxHfov: MAX_HFOV,
      minHfov: MIN_HFOV,
      compass: false,
      showControls: false,
      keyboardZoom: false,
      autoLoad: config.autoLoad,
    });

    viewerRef.current = viewer;

    viewer.on("load", () => callbacksRef.current.onLoad?.());
    viewer.on("error", () => callbacksRef.current.onError?.());
    viewer.on("mousedown", (...args: unknown[]) =>
      callbacksRef.current.onMousedown?.(args[0] as Event)
    );
    viewer.on("mouseup", (...args: unknown[]) =>
      callbacksRef.current.onMouseup?.(args[0] as Event)
    );
    viewer.on("touchstart", (...args: unknown[]) =>
      callbacksRef.current.onTouchstart?.(args[0] as Event)
    );
    viewer.on("touchend", (...args: unknown[]) =>
      callbacksRef.current.onTouchend?.(args[0] as Event)
    );

    return () => {
      viewerRef.current = null;
      viewer.destroy();
    };
    // Only recreate viewer when the source image or autoLoad changes.
    // Other config values are constants. Callbacks are synced via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.image, config.preview, config.autoLoad]);

  return viewerRef;
}
