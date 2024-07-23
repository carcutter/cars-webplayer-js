import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { MAX_ZOOM, ZOOM_STEP } from "@/const/zoom";
import { Item } from "@/types/composition";
import { clamp } from "@/utils/math";

import { useCompositionContext } from "./CompositionContext";
import { useGlobalContext } from "./GlobalContext";

type ItemInteraction = null | "pending" | "running";

type ContextType = {
  displayedCategoryId: string;
  changeCategory: (categoryId: string) => void;

  displayedItems: Item[];
  setItemInteraction: (index: number, value: ItemInteraction) => void;
  slidable: boolean;
  carrouselItemIndex: number;
  setCarrouselItemIndex: (index: number) => void;
  itemIndexCommand: number | null;
  setItemIndexCommand: (index: number | null) => void;
  masterItemIndex: number;

  enableHotspotsControl: boolean;
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

  showZoomControls: boolean;
  zoom: number;
  isZooming: boolean;
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
  const {
    eventId,
    flatten,

    isFullScreen,
    allowFullScreen,
    requestFullscreen,
    exitFullscreen,
  } = useGlobalContext();
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

  const initItemInteractionList = useCallback(() => {
    return displayedItems.map(() => null);
  }, [displayedItems]);

  const [itemInteractionList, setItemInteractionList] = useState<
    ItemInteraction[]
  >(initItemInteractionList);
  const setItemInteraction = useCallback(
    (index: number, value: ItemInteraction) => {
      setItemInteractionList(prev =>
        prev.map((prevValue, i) => (i === index ? value : prevValue))
      );
    },
    []
  );
  const [carrouselItemIndex, setCarrouselItemIndex] = useState(0);
  const currentCarrouselItem = displayedItems[carrouselItemIndex];
  const currentItemInteraction = itemInteractionList[carrouselItemIndex];
  const [itemIndexCommand, setItemIndexCommand] = useState<number | null>(null);

  const changeCategory = useCallback(
    (categoryId: string) => {
      // Reset everything
      setCarrouselItemIndex(0);
      setItemIndexCommand(null);
      setItemInteractionList(initItemInteractionList());

      // Change category
      setDisplayedCategoryId(categoryId);
    },
    [initItemInteractionList]
  );

  const [showHotspots, setShowHotspots] = useState(true);
  const enableHotspotsControl = useMemo(() => {
    switch (currentCarrouselItem.type) {
      case "image":
        return true;
      case "video":
      case "omni_directional":
        return false;
    }

    return currentItemInteraction === "running";
  }, [currentCarrouselItem.type, currentItemInteraction]);

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

    if (allowFullScreen) {
      requestFullscreen();
    }
  }, [allowFullScreen, emitEvent, requestFullscreen]);

  const disableExtendMode = useCallback(() => {
    setExtendMode(false);
    emitEvent("extend-mode-off");

    if (allowFullScreen) {
      exitFullscreen();
    }
  }, [allowFullScreen, emitEvent, exitFullscreen]);

  const toggleExtendMode = useCallback(() => {
    if (extendMode) {
      disableExtendMode();
    } else {
      enableExtendMode();
    }
  }, [disableExtendMode, enableExtendMode, extendMode]);

  // Listen to fullscreen changes
  useEffect(() => {
    if (!allowFullScreen) {
      return;
    }

    setExtendMode(isFullScreen);
  }, [allowFullScreen, isFullScreen]);

  const toggleGallery = useCallback(() => {
    const newValue = !showGallery;

    setShowGallery(newValue);
    emitEvent(`gallery-${newValue ? "on" : "off"}`);
  }, [emitEvent, showGallery]);

  const [shownDetailImage, setShownDetailImage] = useState<string | null>(null);

  const showZoomControls = useMemo(() => {
    switch (currentCarrouselItem.type) {
      case "image":
        return true;
      case "video":
      case "omni_directional":
        return false;
    }

    return currentItemInteraction === "running";
  }, [currentCarrouselItem.type, currentItemInteraction]);
  const [zoom, setZoom] = useState(1);
  const isZooming = zoom !== 1;
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
        changeCategory,

        displayedItems,
        setItemInteraction,
        slidable: displayedItems.length > 1,
        carrouselItemIndex,
        setCarrouselItemIndex,
        itemIndexCommand,
        setItemIndexCommand,
        masterItemIndex: itemIndexCommand ?? carrouselItemIndex,

        enableHotspotsControl,
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

        showZoomControls,
        zoom,
        isZooming,
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
