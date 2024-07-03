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
  toggleGallery: () => void;
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

  const enableExtendMode = useCallback(() => {
    setExtendMode(true);
    emitEvent("extend-mode-on");
  }, [emitEvent]);

  const disableExtendMode = useCallback(() => {
    setExtendMode(false);
    emitEvent("extend-mode-off");
  }, [emitEvent]);

  const toggleGallery = useCallback(() => {
    const newValue = !showGallery;
    setShowGallery(newValue);
    emitEvent(newValue ? "gallery-open" : "gallery-close");
  }, [emitEvent, showGallery]);

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
        toggleGallery,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
