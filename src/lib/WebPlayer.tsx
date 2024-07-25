import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import withZodSchema from "@/components/hoc/withZodSchema";
import WebPlayerContainer from "@/components/organisms/WebPlayerContainer";
import {
  DEFAULT_ALLOW_FULL_SCREEN,
  DEFAULT_CATEGORY_POSITION,
  DEFAULT_EVENT_ID,
  DEFAULT_FLATTEN,
  DEFAULT_IMAGE_LOAD_STRATEGY,
  DEFAULT_NEXT_PREV_POSITION,
  DEFAULT_OPTIONS_POSITION,
  DEFAULT_REVERSE_360,
  DEFAULT_ZOOM_POSITION,
} from "@/const/default";
import CustomizationContextProvider from "@/providers/CustomizationContext";
import GlobalContextProvider from "@/providers/GlobalContext";
import type { WebPlayerProps } from "@/types/webPlayerProps";
import { WebPlayerPropsSchema } from "@/types/zod/webPlayerProps";

const queryClient = new QueryClient();

const WebPlayerTS: React.FC<React.PropsWithChildren<WebPlayerProps>> = ({
  compositionUrl,

  reverse360 = DEFAULT_REVERSE_360,
  imageLoadStrategy = DEFAULT_IMAGE_LOAD_STRATEGY,
  flatten = DEFAULT_FLATTEN,
  eventId = DEFAULT_EVENT_ID,
  allowFullScreen = DEFAULT_ALLOW_FULL_SCREEN,
  categoryPosition = DEFAULT_CATEGORY_POSITION,
  optionsPosition = DEFAULT_OPTIONS_POSITION,
  nextPrevPosition = DEFAULT_NEXT_PREV_POSITION,
  zoomPosition = DEFAULT_ZOOM_POSITION,

  children: customizationChildren, // NOTE: use to customize the player, not to display the content

  ...props
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [playerInViewportWidthRatio, setPlayerInViewportWidthRatio] =
    useState(0.5); // TODO: Should not be hardcoded
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Handle resizing
  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const wrapper = wrapperRef.current;

    const refresh = () => {
      const viewportWidth = window.innerWidth;
      const playerWidth = wrapper.clientWidth;

      setPlayerInViewportWidthRatio(playerWidth / viewportWidth);

      setIsFullScreen(document.fullscreenElement === wrapper);
    };

    refresh();

    addEventListener("resize", refresh);

    return () => {
      removeEventListener("resize", refresh);
    };
  }, []);

  const requestFullscreen = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      throw new Error("Wrapper not found");
    }

    return wrapper.requestFullscreen();
  }, []);

  const exitFullscreen = useCallback(() => {
    return document.exitFullscreen();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider
        {...{
          ...props,
          reverse360,
          imageLoadStrategy,
          flatten,
          eventId,
          allowFullScreen,
          categoryPosition,
          optionsPosition,
          nextPrevPosition,
          zoomPosition,

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

const WebPlayer = withZodSchema(WebPlayerTS, WebPlayerPropsSchema);

export default WebPlayer;
