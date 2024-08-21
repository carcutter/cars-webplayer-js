import { useCallback, useEffect, useRef, useState } from "react";

import { WEB_PLAYER_WC_TAG } from "@car-cutter/core-webplayer";

import WebPlayerContainer from "./components/organisms/WebPlayerContainer";
import {
  DEFAULT_ALLOW_FULL_SCREEN,
  DEFAULT_EVENT_ID,
  DEFAULT_FLATTEN,
  DEFAULT_IMAGE_LOAD_STRATEGY,
  DEFAULT_INFINITE_CARROUSEL,
  DEFAULT_PERMANENT_GALLERY,
  DEFAULT_REVERSE_360,
} from "./const/default_props";
import CustomizationContextProvider from "./providers/CustomizationContext";
import GlobalContextProvider from "./providers/GlobalContext";
import type { WebPlayerProps } from "./types/webPlayerProps";

const WebPlayerTS: React.FC<React.PropsWithChildren<WebPlayerProps>> = ({
  compositionUrl,

  reverse360 = DEFAULT_REVERSE_360,
  imageLoadStrategy = DEFAULT_IMAGE_LOAD_STRATEGY,
  flatten = DEFAULT_FLATTEN,
  infiniteCarrousel = DEFAULT_INFINITE_CARROUSEL,
  eventId = DEFAULT_EVENT_ID,
  allowFullScreen = DEFAULT_ALLOW_FULL_SCREEN,
  permanentGallery = DEFAULT_PERMANENT_GALLERY,

  children: customizationChildren, // NOTE: use to customize the player, not to display the content

  ...props
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [playerInViewportWidthRatio, setPlayerInViewportWidthRatio] =
    useState(0.5); // TODO: Should not be hardcoded
  const [isFullScreen, setIsFullScreen] = useState(false);

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

    const onResize = () => {
      const viewportWidth = window.innerWidth;
      const playerWidth = wrapper.clientWidth;

      setPlayerInViewportWidthRatio(playerWidth / viewportWidth);
    };

    onResize();

    addEventListener("resize", onResize);

    return () => {
      removeEventListener("resize", onResize);
    };
  }, [isFullScreen]);

  // Handle fullscreen
  useEffect(() => {
    if (!allowFullScreen) {
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
  }, [allowFullScreen]);

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
        ...props,
        reverse360,
        imageLoadStrategy,
        flatten,
        infiniteCarrousel,
        eventId,
        allowFullScreen,
        permanentGallery,

        playerInViewportWidthRatio,
        isFullScreen,
        requestFullscreen,
        exitFullscreen,
      }}
    >
      <CustomizationContextProvider>
        <div id="cc-webplayer-wrapper" ref={wrapperRef}>
          <WebPlayerContainer compositionUrl={compositionUrl} />
        </div>
        {customizationChildren}
      </CustomizationContextProvider>
    </GlobalContextProvider>
  );
};

export default WebPlayerTS;
