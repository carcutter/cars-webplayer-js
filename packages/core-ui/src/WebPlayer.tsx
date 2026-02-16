import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC as ReactFC,
  type PropsWithChildren as ReactPropsWithChildren,
} from "react";

import {
  WEB_PLAYER_WC_TAG,
  DEFAULT_HIDE_CATEGORIES_NAV,
  DEFAULT_INFINITE_CARROUSEL,
  DEFAULT_PERMANENT_GALLERY,
  DEFAULT_INTEGRATION,
  DEFAULT_MAX_ITEMS_SHOWN,
  DEFAULT_MEDIA_LOAD_STRATEGY,
  DEFAULT_MIN_MEDIA_WIDTH,
  DEFAULT_MAX_MEDIA_WIDTH,
  DEFAULT_PRELOAD_RANGE,
  DEFAULT_AUTO_LOAD_360,
  DEFAULT_AUTO_LOAD_INTERIOR_360,
  DEFAULT_CATEGORY_FILTER,
  DEFAULT_EXTEND_BEHAVIOR,
  DEFAULT_EVENT_PREFIX,
  DEFAULT_DEMO_SPIN,
  DEFAULT_REVERSE_360,
  DEFAULT_ANALYTICS_EVENT_PREFIX,
  DEFAULT_ANALYTICS_URL,
  DEFAULT_ANALYTICS_BEARER,
  DEFAULT_ANALYTICS_SIMPLE_REQUESTS_ONLY,
  DEFAULT_ANALYTICS_DRY_RUN,
  DEFAULT_ANALYTICS_DEBUG,
  DEFAULT_MONITORING,
  type WebPlayerProps,
  type AnalyticsEvent,
  type AnalyticsEventProps,
  type AnalyticsLoadEventProps,
  type WebplayerInstance,
} from "@car-cutter/core";

import WebPlayerContainer from "./components/organisms/WebPlayerContainer";
import {
  integrationConfig,
  validMaxItemsShownValues,
} from "./const/integration";
import {
  useAnalyticsBrowserId,
  useAnalyticsInstanceId,
  useAnalyticsSessionId,
} from "./hooks/analytics.hooks";
import CustomizationContextProvider from "./providers/CustomizationContext";
import GlobalContextProvider from "./providers/GlobalContext";
import { findClosestValidNumberInRange } from "./utils/math";
import { emitMonitoringActivityEvent } from "./utils/monitoring";
const WebPlayer: ReactFC<ReactPropsWithChildren<WebPlayerProps>> = ({
  compositionUrl,
  integration = DEFAULT_INTEGRATION,
  maxItemsShown = DEFAULT_MAX_ITEMS_SHOWN,
  hideCategoriesNav = DEFAULT_HIDE_CATEGORIES_NAV,
  infiniteCarrousel = DEFAULT_INFINITE_CARROUSEL,
  permanentGallery = DEFAULT_PERMANENT_GALLERY,
  mediaLoadStrategy = DEFAULT_MEDIA_LOAD_STRATEGY,
  minMediaWidth = DEFAULT_MIN_MEDIA_WIDTH,
  maxMediaWidth = DEFAULT_MAX_MEDIA_WIDTH,
  preloadRange = DEFAULT_PRELOAD_RANGE,
  autoLoad360 = DEFAULT_AUTO_LOAD_360,
  autoLoadInterior360 = DEFAULT_AUTO_LOAD_INTERIOR_360,
  categoriesFilter = DEFAULT_CATEGORY_FILTER,
  extendBehavior = DEFAULT_EXTEND_BEHAVIOR,
  eventPrefix = DEFAULT_EVENT_PREFIX,
  demoSpin = DEFAULT_DEMO_SPIN,
  reverse360 = DEFAULT_REVERSE_360,
  analyticsEventPrefix = DEFAULT_ANALYTICS_EVENT_PREFIX,
  analyticsUrl = DEFAULT_ANALYTICS_URL,
  analyticsBearer = DEFAULT_ANALYTICS_BEARER,
  analyticsSimpleRequestsOnly = DEFAULT_ANALYTICS_SIMPLE_REQUESTS_ONLY,
  analyticsDryRun = DEFAULT_ANALYTICS_DRY_RUN,
  analyticsDebug = DEFAULT_ANALYTICS_DEBUG,
  monitoring = DEFAULT_MONITORING,
  children: customizationChildren, // NOTE: use to customize the player, not to display the content
}) => {
  //maxItemsShown validation and substitution if not valid
  maxItemsShown = findClosestValidNumberInRange(
    maxItemsShown,
    validMaxItemsShownValues
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [playerInViewportWidthRatio, setPlayerInViewportWidthRatio] =
    useState(0.5); // NOTE: Hardcoded for typing convenience, but will be updated in the useEffect
  const [isFullScreen, setIsFullScreen] = useState(false);

  const emitEvent = useCallback(
    (eventId: string, detail?: unknown) => {
      const eventName = eventPrefix + eventId;
      const event = new CustomEvent(eventName, { detail });

      document.dispatchEvent(event);
    },
    [eventPrefix]
  );

  // Analytics
  const analyticsBrowserId = useAnalyticsBrowserId();
  const analyticsSessionId = useAnalyticsSessionId();
  const analyticsInstanceId = useAnalyticsInstanceId();
  const emitAnalyticsEvent = useCallback(
    async (event: AnalyticsEventProps) => {
      try {
        // Build enriched event with instance + timestamp
        const instance: WebplayerInstance = {
          instance_id: analyticsInstanceId,
          browser_id: analyticsBrowserId,
          session_id: analyticsSessionId,
          from_url: window.location.href,
        };
        const payload: AnalyticsEvent = {
          ...event,
          timestamp: new Date().toISOString(),
          instance,
        } as AnalyticsEvent;

        // Dry run
        if (analyticsDryRun) {
          // eslint-disable-next-line no-console
          console.log("[DRY RUN] AnalyticsEvent:", payload);
          return;
        }

        // Dispatch event
        const analyticsEventName = analyticsEventPrefix + event.type;
        const dispatchEvent = new CustomEvent(analyticsEventName, {
          detail: payload,
        });
        document.dispatchEvent(dispatchEvent);

        // Send event to `analyticsUrl or to monitoring service`
        if (analyticsUrl || monitoring) {
          // Prepare request
          const method = "POST" as const;
          const headers: HeadersInit = new Headers();
          if (!analyticsSimpleRequestsOnly) {
            headers.append("Content-Type", "application/json");
            headers.append("Cache-Control", "no-cache");
            if (analyticsBearer) {
              headers.append("Authorization", `Bearer ${analyticsBearer}`);
            }
          }
          const body = JSON.stringify(payload);
          // Send event
          if (!monitoring) {
            await fetch(analyticsUrl, { method, headers, body });
          } else {
            await emitMonitoringActivityEvent({ payload, compositionUrl });
          }
        }
      } catch (error) {
        // Debug mode
        if (!analyticsDebug) return;
        // eslint-disable-next-line no-console
        console.error("Error while sending analytics event:", error);
      }
    },
    [
      analyticsEventPrefix,
      analyticsUrl,
      analyticsBearer,
      analyticsSimpleRequestsOnly,
      analyticsDryRun,
      analyticsDebug,
      analyticsInstanceId,
      analyticsBrowserId,
      analyticsSessionId,
      compositionUrl,
      monitoring,
    ]
  );

  // Analytics - Load
  const [loadEvent] = useState<AnalyticsLoadEventProps>({
    type: "load" as const,
    config: {
      composition_url: compositionUrl,
      integration,
      max_items_shown: maxItemsShown,
      hide_categories_nav: hideCategoriesNav,
      infinite_carrousel: infiniteCarrousel,
      permanent_gallery: permanentGallery,
      media_load_strategy: mediaLoadStrategy,
      min_media_width: minMediaWidth,
      preload_range: preloadRange,
      auto_load_360: autoLoad360,
      auto_load_interior_360: autoLoadInterior360,
      categories_filter: categoriesFilter,
      extend_behavior: extendBehavior,
      event_prefix: eventPrefix,
      demo_spin: demoSpin,
      reverse_360: reverse360,
    },
  });
  useEffect(() => {
    const timeout = setTimeout(() => emitAnalyticsEvent(loadEvent), 0);
    return () => clearTimeout(timeout);
  }, [emitAnalyticsEvent, loadEvent]);

  // Compute player width ratio in viewport (to handle imgs' srcSet)
  useEffect(() => {
    if (isFullScreen) {
      setPlayerInViewportWidthRatio(1);
      return;
    }

    if (!wrapperRef.current) {
      return;
    }

    const wrapper = wrapperRef.current;

    const update = () => {
      const viewportWidth = window.innerWidth;
      const playerWrapperWidth = wrapper.clientWidth;

      setPlayerInViewportWidthRatio(playerWrapperWidth / viewportWidth);
    };

    update();

    addEventListener("resize", update);

    return () => {
      removeEventListener("resize", update);
    };
  }, [isFullScreen]);

  // Handle fullscreenchange event
  useEffect(() => {
    if (extendBehavior !== "full_screen") {
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) {
      throw new Error("Wrapper not found");
    }

    const onFullscreenChange = () => {
      const { fullscreenElement } = document;

      setIsFullScreen(
        fullscreenElement === wrapper ||
          // NOTE: For custom element, the web browser is making the whole custom element full-screen and not only the wrapper
          fullscreenElement?.localName === WEB_PLAYER_WC_TAG
      );
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [extendBehavior]);

  const requestFullscreen = useCallback(async () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      throw new Error("Wrapper not found");
    }

    // Will throw error mainly for Safari iOS as it does not support requestFullscreen
    try {
      await wrapper.requestFullscreen();
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    // Will throw error if no element is in full-screen (e.g. We are on Safari iOS)
    try {
      await document.exitFullscreen();
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  return (
    <GlobalContextProvider
      {...{
        compositionUrl,
        integration,
        hideCategoriesNav,
        infiniteCarrousel,
        permanentGallery,
        maxItemsShown,
        mediaLoadStrategy,
        minMediaWidth,
        maxMediaWidth,
        preloadRange,
        categoriesFilter,
        autoLoad360,
        autoLoadInterior360,
        extendBehavior,
        demoSpin,
        reverse360,

        emitEvent,
        emitAnalyticsEvent,

        playerInViewportWidthRatio,
        isFullScreen,
        requestFullscreen,
        exitFullscreen,
        ...(integration ? integrationConfig : {}),
      }}
    >
      <CustomizationContextProvider>
        <div
          ref={wrapperRef}
          className="select-none text-foreground"
          style={
            {
              "--background": "var(--cc-webplayer-background, 0 0% 100%)",
              "--foreground": "var(--cc-webplayer-foreground, 240 10% 3.9%)",
              "--primary": "var(--cc-webplayer-primary, 216 100% 52%)",
              "--primary-foreground":
                "var(--cc-webplayer-primary-foreground, var(--background))",
              "--primary-light":
                "var(--cc-webplayer-primary-light, var(--primary))",
              "--neutral": "var(--cc-webplayer-neutral, 0 0% 39%)",
              "--neutral-foreground":
                "var(--cc-webplayer-neutral-foreground, var(--foreground))",
              "--radius-ui": "var(--cc-webplayer-radius-ui, 16px)",
              "--radius-carrousel": "var(--cc-webplayer-radius-carrousel, 0)",
              "--radius-gallery": "var(--cc-webplayer-radius-gallery, 0)",
              "--hotspot-damage-color":
                "hsl(var(--cc-webplayer-hotspot-damage-color, 37 89% 52%))",
              "--hotspot-feature-color":
                "hsl(var(--cc-webplayer-hotspot-feature-color, var(--primary)))",
            } as React.CSSProperties
          }
        >
          <WebPlayerContainer />
        </div>
        {customizationChildren}
      </CustomizationContextProvider>
    </GlobalContextProvider>
  );
};

export default WebPlayer;
