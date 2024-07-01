import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import withZodSchema from "@/components/hoc/withZodSchema";
import WebPlayerContainer from "@/components/organisms/WebPlayerContainer";
import CustomizationContextProvider from "@/providers/CustomizationContext";
import GlobalContextProvider from "@/providers/GlobalContext";
import { WebPlayerProps, WebPlayerPropsSchema } from "@/types/props";

import styles from "../index.css?inline";

const queryClient = new QueryClient();

const WebPlayerTS: React.FC<React.PropsWithChildren<WebPlayerProps>> = ({
  compositionUrl,

  aspectRatio = "4:3",
  flatten = false,
  maxItemsShown = 1,
  breakpoint = 768,

  children: customizationChildren, // NOTE: use to customize the player, not to display the content
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
      setItemsShown(playerWidth < breakpoint ? 1 : maxItemsShown);
    };

    updateShownItems();

    addEventListener("resize", updateShownItems);

    return () => {
      removeEventListener("resize", updateShownItems);
    };
  }, [breakpoint, maxItemsShown]);

  return (
    <>
      <style>{styles}</style>

      <QueryClientProvider client={queryClient}>
        <GlobalContextProvider
          {...{
            compositionUrl,

            aspectRatio,
            flatten,
            maxItemsShown,
            breakpoint,

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
