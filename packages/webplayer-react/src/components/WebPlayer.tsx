import {
  useMemo,
  useEffect,
  type FC as ReactFC,
  type PropsWithChildren as ReactPropsWithChildren,
} from "react";

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
  DEFAULT_ANALYTICS_EVENT_PREFIX,
  ANALYTICS_EVENT_LOAD,
  ANALYTICS_EVENT_DISPLAY,
  ANALYTICS_EVENT_INTERACTION,
  ANALYTICS_EVENT_ERROR,
  type Item,
  type Composition,
  AnalyticsLoadEvent,
  AnalyticsDisplayEvent,
  AnalyticsInteractionEvent,
  AnalyticsErrorEvent,
} from "@car-cutter/core";
import { type WebPlayerProps as WebPlayerCoreProps } from "@car-cutter/core";
import { webPlayerPropsToAttributes } from "@car-cutter/core-wc";

type WebPlayerProps = ReactPropsWithChildren<WebPlayerCoreProps> & {
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
  onAnalyticsLoad?: (event: AnalyticsLoadEvent) => void;
  onAnalyticsDisplay?: (event: AnalyticsDisplayEvent) => void;
  onAnalyticsInteraction?: (event: AnalyticsInteractionEvent) => void;
  onAnalyticsError?: (event: AnalyticsErrorEvent) => void;
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
  onAnalyticsLoad,
  onAnalyticsDisplay,
  onAnalyticsInteraction,
  onAnalyticsError,
  className,
  style = {},
  children,
  ...props
}) => {
  const attributes = useMemo(() => {
    const wcAttributes = webPlayerPropsToAttributes(props);

    // Add "class" as r2wc does not support camelCase props
    if (className) {
      Object.assign(wcAttributes, { class: className });
    }

    return wcAttributes;
  }, [className, props]);

  useEffect(() => {
    const eventPrefix = props.eventPrefix ?? DEFAULT_EVENT_PREFIX;
    const analyticsEventPrefix =
      props.analyticsEventPrefix ?? DEFAULT_ANALYTICS_EVENT_PREFIX;

    const generateEventName = (event: string) => `${eventPrefix}${event}`;
    const generateAnalyticsEventName = (event: string) =>
      `${analyticsEventPrefix}${event}`;

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
    const analyticsEventListenerMap = {
      [ANALYTICS_EVENT_LOAD]: onAnalyticsLoad,
      [ANALYTICS_EVENT_DISPLAY]: onAnalyticsDisplay,
      [ANALYTICS_EVENT_INTERACTION]: onAnalyticsInteraction,
      [ANALYTICS_EVENT_ERROR]: onAnalyticsError,
    };

    const eventCbMap = new Map<string, EventListener>();
    const analyticsEventCbMap = new Map<string, EventListener>();

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

    Object.entries(analyticsEventListenerMap).forEach(([event, listener]) => {
      if (!listener) {
        return;
      }

      const eventName = generateAnalyticsEventName(event);
      const eventListener = (event: Event) =>
        listener((event as CustomEvent).detail);

      analyticsEventCbMap.set(eventName, eventListener);

      document.addEventListener(eventName, eventListener);
    });

    return () => {
      eventCbMap.forEach((eventListener, eventName) => {
        document.removeEventListener(eventName, eventListener);
      });
      analyticsEventCbMap.forEach((eventListener, eventName) => {
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
    props.analyticsEventPrefix,
    onAnalyticsLoad,
    onAnalyticsDisplay,
    onAnalyticsInteraction,
    onAnalyticsError,
  ]);

  // NOTE: Custom element are "display: inline" by default + Style is there so that React can do its thing
  return (
    <cc-webplayer style={{ display: "block", ...style }} {...attributes}>
      {children}
    </cc-webplayer>
  );
};

export { WebPlayer, type WebPlayerProps };
