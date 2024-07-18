import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import withZodSchema from "@/components/hoc/withZodSchema";
import WebPlayerContainer from "@/components/organisms/WebPlayerContainer";
import {
  DEFAULT_ASPECT_RATIO,
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

  aspectRatio = DEFAULT_ASPECT_RATIO,
  reverse360 = DEFAULT_REVERSE_360,
  imageLoadStrategy = DEFAULT_IMAGE_LOAD_STRATEGY,
  flatten = DEFAULT_FLATTEN,
  eventId = DEFAULT_EVENT_ID,
  categoryPosition = DEFAULT_CATEGORY_POSITION,
  optionsPosition = DEFAULT_OPTIONS_POSITION,
  nextPrevPosition = DEFAULT_NEXT_PREV_POSITION,
  zoomPosition = DEFAULT_ZOOM_POSITION,

  children: customizationChildren, // NOTE: use to customize the player, not to display the content

  ...props
}) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [playerInViewportWidthRatio, setPlayerInViewportWidthRatio] =
    useState(0.5); // TODO: Should not be hardcoded

  // Handle resizing
  useEffect(() => {
    if (!wrapper.current) {
      return;
    }

    const wrapperRef = wrapper.current;

    const updateWidthRatio = () => {
      const viewportWidth = window.innerWidth;
      const playerWidth = wrapperRef.clientWidth;

      setPlayerInViewportWidthRatio(playerWidth / viewportWidth);
    };

    updateWidthRatio();

    addEventListener("resize", updateWidthRatio);

    return () => {
      removeEventListener("resize", updateWidthRatio);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider
        {...{
          ...props,
          aspectRatio,
          reverse360,
          imageLoadStrategy,
          flatten,
          eventId,
          categoryPosition,
          optionsPosition,
          nextPrevPosition,
          zoomPosition,

          playerInViewportWidthRatio,
        }}
      >
        <CustomizationContextProvider>
          <div
            id="cc-webplayer-wrapper"
            ref={wrapper}
            className="relative size-full overflow-hidden"
          >
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
