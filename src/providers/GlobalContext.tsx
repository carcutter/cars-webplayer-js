import { createContext, useCallback, useContext, useState } from "react";

import { WebPlayerProps } from "@/types/webPlayerProps";

type ProviderProps = Required<
  Pick<
    WebPlayerProps,
    "aspectRatio" | "reverse360" | "imageLoadStrategy" | "flatten" | "eventId"
  >
> &
  Pick<WebPlayerProps, "minImageWidth" | "maxImageWidth"> & {
    itemsShown: number;
  };

type ContextType = ProviderProps & {
  aspectRatioClass: string;

  showHotspots: boolean;
  toggleHotspots: () => void;

  extendMode: boolean;
  enableExtendMode: () => void;
  disableExtendMode: () => void;

  showGallery: boolean;
  openGallery: () => void;
  closeGallery: () => void;
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

  const emitEvent = useCallback(
    (detail: string) => {
      document.dispatchEvent(new CustomEvent(eventId, { detail }));
    },
    [eventId]
  );

  const toggleHotspots = useCallback(() => {
    const newValue = !showHotspots;
    setShowHotspots(newValue);
    emitEvent(`hotspots-${newValue ? "on" : "off"}`);
  }, [emitEvent, showHotspots]);

  const enableExtendMode = useCallback(() => {
    setExtendMode(true);
    emitEvent("extend-mode-on");
  }, [emitEvent]);
  const disableExtendMode = useCallback(() => {
    setExtendMode(false);
    emitEvent("extend-mode-off");
  }, [emitEvent]);

  const openGallery = useCallback(() => {
    setShowGallery(true);
    emitEvent("gallery-open");
  }, [emitEvent]);
  const closeGallery = useCallback(() => {
    setShowGallery(false);
    emitEvent("gallery-close");
  }, [emitEvent]);

  return (
    <GlobalContext.Provider
      value={{
        ...props,

        aspectRatioClass,

        showHotspots,
        toggleHotspots,

        extendMode,
        enableExtendMode,
        disableExtendMode,

        showGallery,
        openGallery,
        closeGallery,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
