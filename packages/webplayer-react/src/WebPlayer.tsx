import { useEffect } from "react";

import {
  ensureCustomElementsDefinition,
  webPlayerPropsToAttributes,
  type WebPlayerProps as WebPlayerPropsWC,
  // - Events
  DEFAULT_EVENT_PREFIX,
  EVENT_COMPOSITION_LOADING,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_EXTEND_MODE_ON,
  EVENT_EXTEND_MODE_OFF,
  EVENT_HOTSPOTS_ON,
  EVENT_HOTSPOTS_OFF,
  EVENT_GALLERY_OPEN,
  EVENT_GALLERY_CLOSE,
} from "@car-cutter/core-wc";

ensureCustomElementsDefinition();

export type WebPlayerProps = WebPlayerPropsWC & {
  onCompositionLoading?: () => void;
  onCompositionLoaded?: () => void;
  onCompositionLoadError?: () => void;
  onExtendModeOn?: () => void;
  onExtendModeOff?: () => void;
  onHotspotsOn?: () => void;
  onHotspotsOff?: () => void;
  onGalleryOpen?: () => void;
  onGalleryClose?: () => void;
};

const WebPlayer: React.FC<WebPlayerProps> = ({
  onCompositionLoading,
  onCompositionLoaded,
  onCompositionLoadError,
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

    const eventListenerMap = new Map([
      [EVENT_COMPOSITION_LOADING, onCompositionLoading],
      [EVENT_COMPOSITION_LOADED, onCompositionLoaded],
      [EVENT_COMPOSITION_LOAD_ERROR, onCompositionLoadError],
      [EVENT_EXTEND_MODE_ON, onExtendModeOn],
      [EVENT_EXTEND_MODE_OFF, onExtendModeOff],
      [EVENT_HOTSPOTS_ON, onHotspotsOn],
      [EVENT_HOTSPOTS_OFF, onHotspotsOff],
      [EVENT_GALLERY_OPEN, onGalleryOpen],
      [EVENT_GALLERY_CLOSE, onGalleryClose],
    ]);

    eventListenerMap.forEach((listener, event) => {
      if (listener) {
        const eventName = generateEventName(event);
        document.addEventListener(eventName, listener);
      }
    });

    return () => {
      eventListenerMap.forEach((listener, event) => {
        if (listener) {
          const eventName = generateEventName(event);
          document.removeEventListener(eventName, listener);
        }
      });
    };
  }, [
    props.eventPrefix,

    onCompositionLoading,
    onCompositionLoaded,
    onCompositionLoadError,
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
