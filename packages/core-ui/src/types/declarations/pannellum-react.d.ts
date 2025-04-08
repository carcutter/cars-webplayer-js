declare module "pannellum-react/es/elements/Pannellum" {
  import { Component, ReactNode } from "react";

  export interface PannellumProps {
    id?: string;
    width?: string;
    height?: string;
    image?: string;
    panorama?: string;
    preview?: string;
    pitch?: number;
    yaw?: number;
    hfov?: number;
    maxHfov?: number;
    minHfov?: number;
    autoLoad?: boolean;
    compass?: boolean;
    showZoomCtrl?: boolean;
    showFullscreenCtrl?: boolean;
    showControls?: boolean;
    onLoad?: () => void;
    onError?: () => void;
    onMousedown?: (e: Event) => void;
    onMouseup?: (e: Event) => void;
    onTouchstart?: (e: Event) => void;
    onTouchend?: (e: Event) => void;
    children?: ReactNode;
  }

  export interface PannellumViewer {
    loadScene: () => void;
    on?: (eventName: string, callback: (progress: number) => void) => void;
    off?: (eventName: string, callback: (progress: number) => void) => void;
  }

  export class Pannellum extends Component<PannellumProps> {
    getViewer(): PannellumViewer;

    static Controls: React.FC<{ children: ReactNode }>;
  }
}
