import { createContext, useContext } from "react";

import type { WebPlayerProps } from "@car-cutter/core";

type ProviderProps = Required<
  Pick<
    WebPlayerProps,
    | "compositionUrl"
    | "hideCategoriesNav"
    | "infiniteCarrousel"
    | "permanentGallery"
    | "mediaLoadStrategy"
    | "minMediaWidth"
    | "maxMediaWidth"
    | "preloadRange"
    | "autoLoad360"
    | "autoLoadInterior360"
    | "categoriesFilter"
    | "extendBehavior"
    | "demoSpin"
    | "reverse360"
    | "integration"
  >
> & {
  maxItemsShown: number;
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
