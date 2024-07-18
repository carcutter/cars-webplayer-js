import { createContext, useContext } from "react";

import type { WebPlayerProps } from "@/types/webPlayerProps";

type ProviderProps = Required<
  Pick<
    WebPlayerProps,
    | "aspectRatio"
    | "reverse360"
    | "imageLoadStrategy"
    | "flatten"
    | "eventId"
    | "categoryPosition"
    | "optionsPosition"
    | "nextPrevPosition"
    | "zoomPosition"
  >
> &
  Pick<
    WebPlayerProps,
    "categoriesOrder" | "minImageWidth" | "maxImageWidth"
  > & {
    playerInViewportWidthRatio: number;
  };

type ContextType = ProviderProps & {
  aspectRatioClass: string;
};

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
  const { aspectRatio } = props;

  const aspectRatioClass = aspectRatio === "4:3" ? "aspect-4/3" : "aspect-16/9";

  return (
    <GlobalContext.Provider
      value={{
        ...props,

        aspectRatioClass,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
