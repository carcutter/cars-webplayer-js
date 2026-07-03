import { useCallback, useEffect, useMemo } from "react";

import {
  AnalyticsLoadEvent,
  AnalyticsDisplayEvent,
  AnalyticsInteractionEvent,
  AnalyticsErrorEvent,
  subscribeToAnalyticsEvents,
} from "@car-cutter/analytics";

import WebPlayer from "../src/WebPlayer";
import WebPlayerCustomMedia from "../src/WebPlayerCustomMedia";
import WebPlayerIcon from "../src/WebPlayerIcon";

import "../src/index.css";

const useAnalytics = () => {
  const useCustomAnalyticsEventPrefix = false;
  const analyticsEventPrefix: string | undefined = useMemo(
    () => (useCustomAnalyticsEventPrefix ? "cc-analytics-yolo:" : undefined),
    [useCustomAnalyticsEventPrefix]
  );
  const onAnalyticsLoadEvent = useCallback((event: AnalyticsLoadEvent) => {
    // eslint-disable-next-line no-console
    console.log("AnalyticsLoadEvent", event);
  }, []);
  useEffect(() => {
    subscribeToAnalyticsEvents(
      "load",
      onAnalyticsLoadEvent,
      analyticsEventPrefix
    );
  }, [analyticsEventPrefix, onAnalyticsLoadEvent]);

  const onAnalyticsDisplayEvent = useCallback(
    (event: AnalyticsDisplayEvent) => {
      // eslint-disable-next-line no-console
      console.log("AnalyticsDisplayEvent", event);
    },
    []
  );

  useEffect(() => {
    subscribeToAnalyticsEvents(
      "display",
      onAnalyticsDisplayEvent,
      analyticsEventPrefix
    );
  }, [analyticsEventPrefix, onAnalyticsDisplayEvent]);

  const onAnalyticsInteractionEvent = useCallback(
    (event: AnalyticsInteractionEvent) => {
      // eslint-disable-next-line no-console
      console.log("AnalyticsInteractionEvent", event);
    },
    []
  );

  useEffect(() => {
    subscribeToAnalyticsEvents(
      "interaction",
      onAnalyticsInteractionEvent,
      analyticsEventPrefix
    );
  }, [analyticsEventPrefix, onAnalyticsInteractionEvent]);

  const onAnalyticsErrorEvent = useCallback((event: AnalyticsErrorEvent) => {
    // eslint-disable-next-line no-console
    console.log("AnalyticsErrorEvent", event);
  }, []);

  useEffect(() => {
    subscribeToAnalyticsEvents(
      "error",
      onAnalyticsErrorEvent,
      analyticsEventPrefix
    );
  }, [analyticsEventPrefix, onAnalyticsErrorEvent]);

  return {
    analyticsEventPrefix,
  };
};

const DevApp: React.FC = () => {
  // Analytics
  const { analyticsEventPrefix } = useAnalytics();

  return (
    <div>
      {/* FUTURE: Add some stuff to make it appear like a real app */}

      <div
        style={{
          padding: "1rem",
          marginBottom: "1rem",
          borderBottom: "1px solid #000",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
          }}
        >
          CarCutter Demo React
        </h2>
      </div>

      <div
        style={{
          maxWidth: "800px",
          marginInline: "auto",
        }}
      >
        <WebPlayer
          compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition_v3.json"
          infiniteCarrousel
          demoSpin
          analyticsEventPrefix={analyticsEventPrefix}
        >
          <WebPlayerCustomMedia
            index={4}
            thumbnailSrc="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_thumbnail_audi.png"
          >
            <img src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_image_1.jpg" />
          </WebPlayerCustomMedia>
          <WebPlayerCustomMedia index={-2}>
            <img src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_image_2.jpg" />
          </WebPlayerCustomMedia>
          <WebPlayerIcon name="UI_360_PLAY">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"
              />
            </svg>
          </WebPlayerIcon>
        </WebPlayer>
      </div>
    </div>
  );
};

export default DevApp;
