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
  DEFAULT_HIDE_CATEGORIES,
  DEFAULT_INFINITE_CARROUSEL,
  DEFAULT_PERMANENT_GALLERY,
  DEFAULT_MEDIA_LOAD_STRATEGY,
  DEFAULT_MIN_MEDIA_WIDTH,
  DEFAULT_MAX_MEDIA_WIDTH,
  DEFAULT_PRELOAD_RANGE,
  DEFAULT_PREVENT_FULL_SCREEN,
  DEFAULT_EVENT_PREFIX,
  DEFAULT_REVERSE_360,
} from "@car-cutter/core";

import WebPlayerContainer from "./components/organisms/WebPlayerContainer";
import CustomizationContextProvider from "./providers/CustomizationContext";
import GlobalContextProvider from "./providers/GlobalContext";
import { WebPlayerProps } from "./types/WebPlayer.props";

import "./index.css";

const WebPlayer: ReactFC<ReactPropsWithChildren<WebPlayerProps>> = ({
  compositionUrl,

  hideCategories = DEFAULT_HIDE_CATEGORIES,
  infiniteCarrousel = DEFAULT_INFINITE_CARROUSEL,
  permanentGallery = DEFAULT_PERMANENT_GALLERY,

  mediaLoadStrategy = DEFAULT_MEDIA_LOAD_STRATEGY,
  minMediaWidth = DEFAULT_MIN_MEDIA_WIDTH,
  maxMediaWidth = DEFAULT_MAX_MEDIA_WIDTH,
  preloadRange = DEFAULT_PRELOAD_RANGE,

  preventFullScreen = DEFAULT_PREVENT_FULL_SCREEN,
  eventPrefix = DEFAULT_EVENT_PREFIX,
  reverse360 = DEFAULT_REVERSE_360,

  children: customizationChildren, // NOTE: use to customize the player, not to display the content
}) => {
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

  // Handle fullscreen
  useEffect(() => {
    if (preventFullScreen) {
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
  }, [preventFullScreen]);

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
        hideCategories,
        infiniteCarrousel,
        permanentGallery,
        mediaLoadStrategy,
        minMediaWidth,
        maxMediaWidth,
        preloadRange,
        preventFullScreen,
        reverse360,

        emitEvent,

        playerInViewportWidthRatio,
        isFullScreen,
        requestFullscreen,
        exitFullscreen,
      }}
    >
      <CustomizationContextProvider>
        <div
          id="cc-webplayer-wrapper"
          ref={wrapperRef}
          className="select-none text-foreground"
        >
          <WebPlayerContainer />
        </div>
        {customizationChildren}
      </CustomizationContextProvider>
    </GlobalContextProvider>
  );
};

export default WebPlayer;
