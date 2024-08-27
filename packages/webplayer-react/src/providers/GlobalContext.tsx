import { createContext, useContext } from "react";

import type { WebPlayerProps } from "@car-cutter/core-webplayer";

type ProviderProps = Required<
  Pick<
    WebPlayerProps,
    | "reverse360"
    | "imageLoadStrategy"
    | "flatten"
    | "infiniteCarrousel"
    | "eventId"
    | "allowFullScreen"
    | "permanentGallery"
  >
> &
  Pick<WebPlayerProps, "minImageWidth" | "maxImageWidth"> & {
    playerInViewportWidthRatio: number;
    isFullScreen: boolean;
    requestFullscreen: () => Promise<boolean>;
    exitFullscreen: () => Promise<boolean>;
  };

type ContextType = ProviderProps;

const GlobalContext = createContext<ContextType | null>(null);

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);

  if (!ctx) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }

  return ctx;
};

const GlobalContextProvider: React.FC<
  React.PropsWithChildren<ProviderProps>
> = ({ children, ...props }) => {
  return (
    <GlobalContext.Provider value={props}>{children}</GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
