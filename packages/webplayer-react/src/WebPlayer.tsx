import { useEffect, type FC as ReactFC } from "react";

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
import { type WebPlayerProps as WebPlayerPropsWC } from "@car-cutter/core-ui";
import {
  ensureCustomElementsDefinition,
  webPlayerPropsToAttributes,
} from "@car-cutter/core-wc";

ensureCustomElementsDefinition();

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
};

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
  ...props
}) => {
  const attributes = webPlayerPropsToAttributes(props);

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

  // @ts-expect-error: [TODO] Should define into JSX.IntrinsicElements
  return <cc-webplayer {...attributes} />;
};

export default WebPlayer;
