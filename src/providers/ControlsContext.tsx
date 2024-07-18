import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { MAX_ZOOM, ZOOM_STEP } from "@/const/zoom";
import { Item } from "@/types/composition";
import { clamp } from "@/utils/math";

import { useCompositionContext } from "./CompositionContext";
import { useGlobalContext } from "./GlobalContext";

type ContextType = {
  displayedCategoryId: string;
  setDisplayedCategoryId: (category: string) => void;

  displayedItems: Item[];
  slidable: boolean;
  currentItemIndex: number;
  setCurrentItemIndex: (index: number) => void;
  targetItemIndex: number;
  setTargetItemIndex: (index: number) => void;

  showHotspots: boolean;
  toggleHotspots: () => void;

  extendMode: boolean;
  enableExtendMode: () => void;
  disableExtendMode: () => void;
  toggleExtendMode: () => void;

  showGallery: boolean;
  toggleGallery: () => void;

  shownDetailImage: string | null;
  showingDetailImage: boolean;
  setShownDetailImage: (shownDetailImage: string | null) => void;

  zoom: number;
  isZoomed: boolean;
  setZoom: (zoom: number) => void;
  resetZoom: () => void;
  canZoomIn: boolean;
  zoomIn: () => void;
  canZoomOut: boolean;
  zoomOut: () => void;
};

const ControlsContext = createContext<ContextType | null>(null);

export const useControlsContext = () => {
  const ctx = useContext(ControlsContext);

  if (!ctx) {
    throw new Error(
      "useControlsContext must be used within a ControlsContextProvider"
    );
  }

  return ctx;
};

const ControlsContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { eventId, flatten } = useGlobalContext();
  const { compositionCategories } = useCompositionContext();

  const [displayedCategoryId, setDisplayedCategoryId] = useState(
    compositionCategories[0].id
  );

  const displayedItems: Item[] = useMemo(() => {
    if (flatten) {
      return compositionCategories.flatMap(({ items }) => items);
    }

    const displayedCategory = compositionCategories.find(
      ({ id }) => id === displayedCategoryId
    );
    if (!displayedCategory) {
      throw new Error(`Element ${displayedCategory} not found`);
    }

    return displayedCategory.items;
  }, [flatten, compositionCategories, displayedCategoryId]);

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [targetItemIndex, setTargetItemIndex] = useState(0);

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
  const toggleExtendMode = useCallback(() => {
    if (extendMode) {
      disableExtendMode();
    } else {
      enableExtendMode();
    }
  }, [disableExtendMode, enableExtendMode, extendMode]);

  const toggleGallery = useCallback(() => {
    const newValue = !showGallery;

    setShowGallery(newValue);
    emitEvent(`gallery-${newValue ? "on" : "off"}`);
  }, [emitEvent, showGallery]);

  const [shownDetailImage, setShownDetailImage] = useState<string | null>(null);

  const [zoom, setZoom] = useState(1);
const isZoomed = zoom !== 1;
  const canZoomIn = zoom < MAX_ZOOM;
  const canZoomOut = zoom > 1;

  const shiftZoom = useCallback((shift: number) => {
    setZoom(prev => clamp(prev + shift, 1, MAX_ZOOM));
  }, []);
  const resetZoom = useCallback(() => setZoom(1), []);
  const zoomIn = useCallback(() => shiftZoom(ZOOM_STEP), [shiftZoom]);
  const zoomOut = useCallback(() => shiftZoom(-ZOOM_STEP), [shiftZoom]);

  return (
    <ControlsContext.Provider
      value={{
        displayedCategoryId,
        setDisplayedCategoryId,

        displayedItems,
        slidable: displayedItems.length > 1,
        currentItemIndex,
        setCurrentItemIndex,
        targetItemIndex,
        setTargetItemIndex,

        showHotspots,
        toggleHotspots,

        extendMode,
        enableExtendMode,
        disableExtendMode,
        toggleExtendMode,

        showGallery,
        toggleGallery,

        shownDetailImage,
showingDetailImage: !!shownDetailImage,
        setShownDetailImage,

        zoom,
        isZoomed,
        setZoom,
        resetZoom,
        canZoomIn,
        zoomIn,
        canZoomOut,
        zoomOut,
      }}
    >
      {children}
    </ControlsContext.Provider>
  );
};

export default ControlsContextProvider;
