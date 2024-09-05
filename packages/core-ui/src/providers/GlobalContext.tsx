import { createContext, useContext } from "react";

import type { WebPlayerProps } from "../types/WebPlayer.props";

type ProviderProps = Required<
  Pick<
    WebPlayerProps,
    | "flatten"
    | "infiniteCarrousel"
    | "permanentGallery"
    | "imageLoadStrategy"
    | "preventFullScreen"
    | "reverse360"
  >
> &
  Pick<WebPlayerProps, "minImageWidth" | "maxImageWidth"> & {
    emitEvent: (name: string, detail?: unknown) => void;

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
