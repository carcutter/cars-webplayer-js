import { createContext, useContext } from "react";

import type { WebPlayerProps } from "@/types/webPlayerProps";

type ProviderProps = Required<
  Pick<
    WebPlayerProps,
    | "reverse360"
    | "imageLoadStrategy"
    | "flatten"
    | "eventId"
    | "allowFullScreen"
    | "permanentGallery"
  >
> &
  Pick<
    WebPlayerProps,
    "categoriesOrder" | "minImageWidth" | "maxImageWidth"
  > & {
    playerInViewportWidthRatio: number;
    isFullScreen: boolean;
    requestFullscreen: () => Promise<void>;
    exitFullscreen: () => Promise<void>;
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
