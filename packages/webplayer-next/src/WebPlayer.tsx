"use client";

import { useEffect, useState, type FC as ReactFC } from "react";

import {
  DEFAULT_EVENT_PREFIX,
  EVENT_COMPOSITION_LOADING,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_ITEM_CHANGE,
  EVENT_EXTEND_MODE_ON,
  EVENT_EXTEND_MODE_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_HOTSPOTS_OFF,
  EVENT_GALLERY_OPEN,
  EVENT_GALLERY_CLOSE,
  type Item,
  type Composition,
} from "@car-cutter/core";
import type { WebPlayerProps as WebPlayerPropsWC } from "@car-cutter/core-ui";
import type { WebPlayerAttributes } from "@car-cutter/core-wc";

export type WebPlayerProps = WebPlayerPropsWC & {
  onCompositionLoading?: (url: string) => void;
  onCompositionLoaded?: (composition: Composition) => void;
  onCompositionLoadError?: (error: unknown) => void;
  onItemChange?: (props: { index: number; item: Item }) => void;
  onExtendModeOn?: () => void;
  onExtendModeOff?: () => void;
  onHotspotsOn?: () => void;
  onHotspotsOff?: () => void;
  onGalleryOpen?: () => void;
  onGalleryClose?: () => void;
} & Pick<React.HTMLAttributes<HTMLElement>, "className" | "style">;

const WebPlayer: ReactFC<WebPlayerProps> = ({
  onCompositionLoading,
  onCompositionLoaded,
  onCompositionLoadError,
  onItemChange,
  onExtendModeOn,
  onExtendModeOff,
  onHotspotsOn,
  onHotspotsOff,
  onGalleryOpen,
  onGalleryClose,
  className,
  style = {},
  ...props
}) => {
  const [attributes, setAttributes] = useState<WebPlayerAttributes>();

  // Add custom elements to the DOM & set attributes
  useEffect(() => {
    (async () => {
      const { ensureCustomElementsDefinition, webPlayerPropsToAttributes } =
        await import("@car-cutter/core-wc");

      ensureCustomElementsDefinition();

      // NOTE: Cannot be used in the top level of a module because of the dynamic import
      const wcAttributes = webPlayerPropsToAttributes(props);
      if (className) {
        Object.assign(wcAttributes, { class: className });
      }
      setAttributes(wcAttributes);
    })();
  }, [className, props]);

  // Listen to WebPlayer events
  useEffect(() => {
    const eventPrefix = props.eventPrefix ?? DEFAULT_EVENT_PREFIX;

    const generateEventName = (event: string) => `${eventPrefix}${event}`;

    const eventListenerMap = {
      [EVENT_COMPOSITION_LOADING]: onCompositionLoading,
      [EVENT_COMPOSITION_LOADED]: onCompositionLoaded,
      [EVENT_COMPOSITION_LOAD_ERROR]: onCompositionLoadError,
      [EVENT_ITEM_CHANGE]: onItemChange,
      [EVENT_EXTEND_MODE_ON]: onExtendModeOn,
      [EVENT_EXTEND_MODE_OFF]: onExtendModeOff,
      [EVENT_HOTSPOTS_ON]: onHotspotsOn,
      [EVENT_HOTSPOTS_OFF]: onHotspotsOff,
      [EVENT_GALLERY_OPEN]: onGalleryOpen,
      [EVENT_GALLERY_CLOSE]: onGalleryClose,
    };

    const eventCbMap = new Map<string, EventListener>();

    Object.entries(eventListenerMap).forEach(([event, listener]) => {
      if (!listener) {
        return;
      }

      const eventName = generateEventName(event);
      const eventListener = (event: Event) =>
        listener((event as CustomEvent).detail);

      eventCbMap.set(eventName, eventListener);

      document.addEventListener(eventName, eventListener);
    });

    return () => {
      eventCbMap.forEach((eventListener, eventName) => {
        document.removeEventListener(eventName, eventListener);
      });
    };
  }, [
    props.eventPrefix,

    onCompositionLoading,
    onCompositionLoaded,
    onCompositionLoadError,
    onItemChange,
    onExtendModeOn,
    onExtendModeOff,
    onHotspotsOn,
    onHotspotsOff,
    onGalleryOpen,
    onGalleryClose,
  ]);

  if (!attributes) {
    return null;
  }

  // NOTE: Custom element are "display: inline" by default + Style is there so that React can do its thing
  return (
    <cc-webplayer style={{ display: "block", ...style }} {...attributes} />
  );
};

export default WebPlayer;
