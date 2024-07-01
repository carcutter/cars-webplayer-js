import { createContext, useContext, useState } from "react";

import { WebPlayerProps } from "@/types/props";

type ProviderProps = Required<
  Pick<WebPlayerProps, "aspectRatio" | "flatten" | "maxItemsShown">
> & {
  itemsShown: number;
};

type ContextType = ProviderProps & {
  aspectRatioClass: string;

  showHotspots: boolean;
  setShowHotspots: React.Dispatch<React.SetStateAction<boolean>>;

  fullScreen: boolean;
  setFullScreen: React.Dispatch<React.SetStateAction<boolean>>;

  showGallery: boolean;
  setShowGallery: React.Dispatch<React.SetStateAction<boolean>>;
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
  const aspectRatioClass =
    props.aspectRatio === "4:3" ? "aspect-4/3" : "aspect-16/9";

  const [showHotspots, setShowHotspots] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        ...props,

        aspectRatioClass,

        showHotspots,
        setShowHotspots,

        fullScreen,
        setFullScreen,

        showGallery,
        setShowGallery,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
