import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import withZodSchema from "@/components/hoc/withZodSchema";
import WebPlayerContainer from "@/components/organisms/WebPlayerContainer";
import {
  DEFAULT_ALLOW_FULL_SCREEN,
  DEFAULT_EVENT_ID,
  DEFAULT_FLATTEN,
  DEFAULT_IMAGE_LOAD_STRATEGY,
  DEFAULT_INFINITE_CARROUSEL,
  DEFAULT_PERMANENT_GALLERY,
  DEFAULT_REVERSE_360,
} from "@/const/default";
import CustomizationContextProvider from "@/providers/CustomizationContext";
import GlobalContextProvider from "@/providers/GlobalContext";
import type { WebPlayerProps } from "@/types/webPlayerProps";
import { WebPlayerPropsSchema } from "@/types/zod/webPlayerProps";
import { WEB_PLAYER_CUSTOM_ELEMENTS_NAME } from "@car-cutter/core-webplayer";

const queryClient = new QueryClient();

const WebPlayerUnsafe: React.FC<React.PropsWithChildren<WebPlayerProps>> = ({
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
          fullscreenElement?.localName === WEB_PLAYER_CUSTOM_ELEMENTS_NAME
      );
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [allowFullScreen]);

  const requestFullscreen = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      throw new Error("Wrapper not found");
    }

    return wrapper.requestFullscreen();
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      await document.exitFullscreen();
    } catch (error) {
      // Will throw error if, for some reason no element is in full-screen
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

const WebPlayerTS = withZodSchema(WebPlayerUnsafe, WebPlayerPropsSchema);

export default WebPlayerTS;
