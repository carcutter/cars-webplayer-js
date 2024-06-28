import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import withZodSchema from "@/components/hoc/withZodSchema";
import GlobalContextProvider from "@/providers/GlobalContext";
import { WebPlayerProps, WebPlayerPropsSchema } from "@/types/props";

import styles from "../index.css?inline";

import WebPlayerContainer from "./WebPlayerContainer";

const queryClient = new QueryClient();

const WebPlayer: React.FC<React.PropsWithChildren<WebPlayerProps>> = ({
  aspectRatio = "4:3",
  flatten = false,
  maxItemsShown = 1,
  breakpoint = 768,

  children,
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
            aspectRatio,
            flatten,
            maxItemsShown,
            breakpoint,

            itemsShown,
          }}
        >
          <div ref={wrapper} className="relative size-full overflow-hidden">
            <WebPlayerContainer>{children}</WebPlayerContainer>
          </div>
        </GlobalContextProvider>
      </QueryClientProvider>
    </>
  );
};

export default withZodSchema(WebPlayer, WebPlayerPropsSchema);
