import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import withZodSchema from "@/components/hoc/withZodSchema";
import WebPlayerContainer from "@/components/organisms/WebPlayerContainer";
import CustomizationContextProvider from "@/providers/CustomizationContext";
import GlobalContextProvider from "@/providers/GlobalContext";
import {
  DEFAULT_ASPECT_RATIO,
  DEFAULT_EVENT_ID,
  DEFAULT_FLATTEN,
  DEFAULT_ITEMS_SHOWN_BREAKPOINT,
  DEFAULT_MAX_ITEMS_SHOWN,
  WebPlayerProps,
  WebPlayerPropsSchema,
} from "@/types/webPlayerProps";

import styles from "../index.css?inline";

const queryClient = new QueryClient();

const WebPlayerTS: React.FC<React.PropsWithChildren<WebPlayerProps>> = ({
  compositionUrl,

  aspectRatio = DEFAULT_ASPECT_RATIO,
  flatten = DEFAULT_FLATTEN,
  maxItemsShown = DEFAULT_MAX_ITEMS_SHOWN,
  itemsShownBreakpoint = DEFAULT_ITEMS_SHOWN_BREAKPOINT,
  eventId = DEFAULT_EVENT_ID,

  children: customizationChildren, // NOTE: use to customize the player, not to display the content

  ...props
}) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const [itemsShown, setItemsShown] = useState(maxItemsShown);

  // Handle resizing
  useEffect(() => {
    if (maxItemsShown === 1) {
      return;
    }

    if (!wrapper.current) {
      return;
    }

    const wrapperRef = wrapper.current;

    const updateShownItems = () => {
      const playerWidth = wrapperRef.clientWidth;
      setItemsShown(playerWidth < itemsShownBreakpoint ? 1 : maxItemsShown);
    };

    updateShownItems();

    addEventListener("resize", updateShownItems);

    return () => {
      removeEventListener("resize", updateShownItems);
    };
  }, [itemsShownBreakpoint, maxItemsShown]);

  return (
    <>
      <style>{styles}</style>

      <QueryClientProvider client={queryClient}>
        <GlobalContextProvider
          {...{
            ...props,
            aspectRatio,
            flatten,
            eventId,

            itemsShown,
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
    </>
  );
};

// NOTE: if it keeps blocking HMR, just embed the schema directly in the component logic
const WebPlayer = withZodSchema(WebPlayerTS, WebPlayerPropsSchema);

export default WebPlayer;
