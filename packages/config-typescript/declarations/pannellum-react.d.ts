declare module "pannellum-react/es/elements/Pannellum" {
  import { Component, ReactNode } from "react";

  export interface PannellumProps {
    children?: ReactNode;
    id?: string;
    width?: string;
    height?: string;
    image?: string;
    panorama?: string;
    haov?: number;
    vaov?: number;
    vOffset?: number;
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
    previewTitle?: string;
    previewAuthor?: string;
    title?: string;
    author?: string;
    autoLoad?: boolean;
    orientationOnByDefault?: boolean;
    showZoomCtrl?: boolean;
    doubleClickZoom?: boolean;
    keyboardZoom?: boolean;
    mouseZoom?: boolean;
    draggable?: boolean;
    disableKeyboardCtrl?: boolean;
    showFullscreenCtrl?: boolean;
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
    hotspotDebug?: boolean;
    tooltip?: (hotSpotDiv: HTMLDivElement, args: unknown) => void;
    tooltipArg?: object;
    handleClick?: (event: unknown, args: unknown) => void;
    handleClickArg?: object;
    cssClass?: string;
    onRender?: (() => void) | null;
  }

  export interface HotspotProps {
    type: "info" | "custom";
    pitch?: number;
    yaw?: number;
    text?: string;
    URL?: string;
    cssClass?: string;
    tooltip?: (hotSpotDiv: HTMLDivElement, args: unknown) => void;
    tooltipArg?: object;
    handleClick?: (event: unknown, args: unknown) => void;
    handleClickArg?: object;
  }

  export interface PannellumViewer {
    getConfig: () => unknown;
    getContainer: () => HTMLElement;
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
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    off: (event: string, callback: (...args: unknown[]) => void) => void;
    addHotSpot: (hotspot: unknown, sceneId?: string) => void;
    removeHotSpot: (hotspotId: string, sceneId?: string) => void;
  }

  export class Pannellum extends Component<PannellumProps> {
    panorama: PannellumViewer;

    getViewer(): PannellumViewer;
    forceRender(): void;

    static Hotspot: React.FC<HotspotProps>;
  }

  const PannellumWithRef: React.ForwardRefExoticComponent<
    PannellumProps & React.RefAttributes<Pannellum>
  >;

  export default PannellumWithRef;
}
