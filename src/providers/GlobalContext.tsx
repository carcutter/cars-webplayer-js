import { createContext, useCallback, useContext, useState } from "react";

import { WebPlayerProps } from "@/types/props";

type ProviderProps = Required<
  Pick<WebPlayerProps, "aspectRatio" | "flatten" | "imageWidths" | "eventId">
> & {
  itemsShown: number;
};

type ContextType = ProviderProps & {
  aspectRatioClass: string;

  showHotspots: boolean;
  setShowHotspots: React.Dispatch<React.SetStateAction<boolean>>;

  extendMode: boolean;
  enableExtendMode: () => void;
  disableExtendMode: () => void;

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
  const { aspectRatio, eventId } = props;

  const aspectRatioClass = aspectRatio === "4:3" ? "aspect-4/3" : "aspect-16/9";

  const [showHotspots, setShowHotspots] = useState(true);
  const [extendMode, setExtendMode] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const enableExtendMode = useCallback(() => {
    setExtendMode(true);
    // Dispath an event
    document.dispatchEvent(
      new CustomEvent(eventId, { detail: "extendmode-on" })
    );
  }, [eventId]);

  const disableExtendMode = useCallback(() => {
    setExtendMode(false);
    // Dispath an event
    new CustomEvent(eventId, { detail: "extendmode-off" });
  }, [eventId]);

  return (
    <GlobalContext.Provider
      value={{
        ...props,

        aspectRatioClass,

        showHotspots,
        setShowHotspots,

        extendMode,
        enableExtendMode,
        disableExtendMode,

        showGallery,
        setShowGallery,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
