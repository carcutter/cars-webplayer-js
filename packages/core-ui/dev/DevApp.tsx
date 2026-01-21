import { useCallback, useEffect, useMemo } from "react";

import {
  AnalyticsIdentifyEvent,
  AnalyticsPageEvent,
  AnalyticsTrackEvent,
  subscribeToAnalyticsEvents,
} from "@car-cutter/core";

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
  const onAnalyticsIdentifyEvent = useCallback(
    (event: AnalyticsIdentifyEvent) => {
      // eslint-disable-next-line no-console
      console.log("AnalyticsIdentifyEvent", event);
    },
    []
  );
  useEffect(() => {
    subscribeToAnalyticsEvents(
      "identify",
      onAnalyticsIdentifyEvent,
      analyticsEventPrefix
    );
  }, [analyticsEventPrefix, onAnalyticsIdentifyEvent]);

  const onAnalyticsPageEvent = useCallback((event: AnalyticsPageEvent) => {
    // eslint-disable-next-line no-console
  }, []);

  useEffect(() => {
    subscribeToAnalyticsEvents(
      "page",
      onAnalyticsPageEvent,
      analyticsEventPrefix
    );
  }, [analyticsEventPrefix, onAnalyticsPageEvent]);

  const onAnalyticsTrackEvent = useCallback((event: AnalyticsTrackEvent) => {
    // eslint-disable-next-line no-console
    // console.log("AnalyticsTrackEvent", event);
  }, []);

  useEffect(() => {
    subscribeToAnalyticsEvents(
      "track",
      onAnalyticsTrackEvent,
      analyticsEventPrefix
    );
  }, [analyticsEventPrefix, onAnalyticsTrackEvent]);

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
          // compositionUrl="/composition_mock_1.json"
          compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/next-360.json" // compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/interior-360.json"
          // compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
          // compositionUrl="https://cdn.car-cutter.com/gallery/7de693a6dd8379eb743f6093499bdd13fe76876f135ae9a08b7d9ecbfb7f8664/WAUZZZF34N1097219/composition_v3.json"
          // hideCategoriesNav
          infiniteCarrousel
          // permanentGallery
          // mediaLoadStrategy="speed"
          // minMediaWidth={300}
          // maxMediaWidth={1000}
          // preloadRange={3}
          // autoLoad360
          // autoLoadInterior360
          // categoriesFilter="*rior|detail"
          // extendBehavior="event"
          // eventPrefix="cc-event:"
          demoSpin
          // reverse360
          analyticsEventPrefix={analyticsEventPrefix}
          // analyticsUrl="https://webhook.site/62a6ddb1-a038-4207-85ff-fe961fafe904"
          // analyticsBearer="1234567890"
          // analyticsSimpleRequestsOnly=f{false}
          // analyticsDryRun={false}
          // analyticsDebug={true}
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
          {/* <WebPlayerCustomMedia index={-3}>
            <img src="https://prod.pictures.autoscout24.net/listing-images/4ac589e2-40e3-47b8-a211-579d2e07125e_b277b9ec-63d5-4900-9003-77dd029364dc.jpg/720x540.webp" />
          </WebPlayerCustomMedia> */}

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
      <script></script>
    </div>
  );
};

export default DevApp;
