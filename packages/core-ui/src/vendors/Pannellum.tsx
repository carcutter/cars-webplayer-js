import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import "pannellum/build/pannellum.css";
import "pannellum/build/pannellum.js";

type PannellumEvent =
  | "load"
  | "scenechange"
  | "scenechangefadedone"
  | "error"
  | "errorcleared"
  | "mousedown"
  | "mouseup"
  | "touchstart"
  | "touchend";

export interface PannellumViewer {
  destroy: () => void;
  loadScene: (
    sceneId?: string,
    pitch?: number,
    yaw?: number,
    hfov?: number
  ) => void;
  setYaw: (yaw: number) => void;
  setPitch: (pitch: number) => void;
  setHfov: (hfov: number) => void;
  getHfov: () => number;
  setYawBounds: (bounds: [number, number]) => void;
  setPitchBounds: (bounds: [number, number]) => void;
  setHfovBounds: (bounds: [number, number]) => void;
  on: (event: PannellumEvent, callback: (event: Event) => void) => void;
}

interface WindowWithPannellum extends Window {
  pannellum?: {
    viewer: (
      element: HTMLElement | string,
      config: Record<string, unknown>
    ) => PannellumViewer;
  };
}

export interface PannellumProps {
  id?: string;
  width?: string;
  height?: string;
  image?: string;
  panorama?: string;
  yaw?: number;
  pitch?: number;
  hfov?: number;
  minHfov?: number;
  maxHfov?: number;
  minPitch?: number;
  maxPitch?: number;
  minYaw?: number;
  maxYaw?: number;
  autoRotate?: number;
  compass?: boolean;
  preview?: string;
  autoLoad?: boolean;
  keyboardZoom?: boolean;
  showControls?: boolean;
  onLoad?: () => void;
  onScenechange?: () => void;
  onScenechangefadedone?: () => void;
  onError?: () => void;
  onErrorcleared?: () => void;
  onMousedown?: (event: Event) => void;
  onMouseup?: (event: Event) => void;
  onTouchstart?: (event: Event) => void;
  onTouchend?: (event: Event) => void;
}

export interface PannellumHandle {
  getViewer: () => PannellumViewer | null;
  forceRender: () => void;
}

const Pannellum = forwardRef<PannellumHandle, PannellumProps>((props, ref) => {
  const {
    id,
    width = "100%",
    height = "400px",
    image,
    panorama,
    yaw,
    pitch,
    hfov,
    minHfov,
    maxHfov,
    minPitch,
    maxPitch,
    minYaw,
    maxYaw,
    autoRotate,
    compass,
    preview,
    autoLoad,
    keyboardZoom,
    showControls,
  } = props;

  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [renderRevision, setRenderRevision] = useState(0);

  const handlersRef = useRef({
    onLoad: props.onLoad,
    onScenechange: props.onScenechange,
    onScenechangefadedone: props.onScenechangefadedone,
    onError: props.onError,
    onErrorcleared: props.onErrorcleared,
    onMousedown: props.onMousedown,
    onMouseup: props.onMouseup,
    onTouchstart: props.onTouchstart,
    onTouchend: props.onTouchend,
  });

  handlersRef.current = {
    onLoad: props.onLoad,
    onScenechange: props.onScenechange,
    onScenechangefadedone: props.onScenechangefadedone,
    onError: props.onError,
    onErrorcleared: props.onErrorcleared,
    onMousedown: props.onMousedown,
    onMouseup: props.onMouseup,
    onTouchstart: props.onTouchstart,
    onTouchend: props.onTouchend,
  };

  const elementId = useMemo(
    () => id ?? `pannellum-${Math.random().toString(36).slice(2, 11)}`,
    [id]
  );

  useImperativeHandle(
    ref,
    () => ({
      getViewer: () => viewerRef.current,
      forceRender: () => {
        setRenderRevision(previousRevision => previousRevision + 1);
      },
    }),
    []
  );

  useEffect(() => {
    const container = hostRef.current;
    const pannellumRuntime = (window as WindowWithPannellum).pannellum;

    if (!container || !pannellumRuntime?.viewer) {
      return;
    }

    const currentViewer = viewerRef.current;
    if (currentViewer) {
      currentViewer.destroy();
      viewerRef.current = null;
    }

    const nextViewer = pannellumRuntime.viewer(container, {
      type: "equirectangular",
      panorama: image ?? panorama,
      yaw,
      pitch,
      hfov,
      minHfov,
      maxHfov,
      minPitch,
      maxPitch,
      minYaw,
      maxYaw,
      autoRotate,
      compass,
      preview,
      autoLoad,
      keyboardZoom,
      showControls,
    });

    const bind = (event: PannellumEvent, callback: (event: Event) => void) => {
      nextViewer.on(event, callback);
    };

    bind("load", () => handlersRef.current.onLoad?.());
    bind("scenechange", () => handlersRef.current.onScenechange?.());
    bind("scenechangefadedone", () =>
      handlersRef.current.onScenechangefadedone?.()
    );
    bind("error", () => handlersRef.current.onError?.());
    bind("errorcleared", () => handlersRef.current.onErrorcleared?.());
    bind("mousedown", event => handlersRef.current.onMousedown?.(event));
    bind("mouseup", event => handlersRef.current.onMouseup?.(event));
    bind("touchstart", event => handlersRef.current.onTouchstart?.(event));
    bind("touchend", event => handlersRef.current.onTouchend?.(event));

    viewerRef.current = nextViewer;

    return () => {
      nextViewer.destroy();
      viewerRef.current = null;
    };
  }, [
    image,
    panorama,
    preview,
    autoLoad,
    autoRotate,
    compass,
    keyboardZoom,
    showControls,
    minHfov,
    maxHfov,
    minPitch,
    maxPitch,
    minYaw,
    maxYaw,
    renderRevision,
  ]);

  useEffect(() => {
    if (yaw === undefined) {
      return;
    }

    viewerRef.current?.setYaw(yaw);
  }, [yaw]);

  useEffect(() => {
    if (pitch === undefined) {
      return;
    }

    viewerRef.current?.setPitch(pitch);
  }, [pitch]);

  useEffect(() => {
    if (hfov === undefined) {
      return;
    }

    viewerRef.current?.setHfov(hfov);
  }, [hfov]);

  useEffect(() => {
    if (minYaw === undefined || maxYaw === undefined) {
      return;
    }

    viewerRef.current?.setYawBounds([minYaw, maxYaw]);
  }, [minYaw, maxYaw]);

  useEffect(() => {
    if (minPitch === undefined || maxPitch === undefined) {
      return;
    }

    viewerRef.current?.setPitchBounds([minPitch, maxPitch]);
  }, [minPitch, maxPitch]);

  useEffect(() => {
    if (minHfov === undefined || maxHfov === undefined) {
      return;
    }

    viewerRef.current?.setHfovBounds([minHfov, maxHfov]);
  }, [minHfov, maxHfov]);

  return <div id={elementId} ref={hostRef} style={{ width, height }} />;
});

Pannellum.displayName = "Pannellum";

export default Pannellum;
