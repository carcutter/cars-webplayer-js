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
type Details = { src: string; title?: string; text?: string };

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
  isCycling: boolean;
  finishCycling: () => void;
  prevImage: () => void;
  nextImage: () => void;

  showGalleryControls: boolean;

  enableHotspotsControl: boolean;
  showHotspots: boolean;
  toggleHotspots: () => void;

  showGallery: boolean;
  toggleGallery: () => void;

  shownDetails: Details | null;
  isShowingDetails: boolean;
  setShownDetails: (shownDetails: Details | null) => void;
  resetShownDetails: () => void;

  showZoomControls: boolean;
  zoom: number;
  isZooming: boolean;
  setZoom: (zoom: number) => void;
  resetZoom: () => void;
  canZoomIn: boolean;
  zoomIn: () => void;
  canZoomOut: boolean;
  zoomOut: () => void;

  freezeCarrousel: boolean;
  resetView: () => void;

  extendMode: boolean;
  enableExtendMode: () => void;
  disableExtendMode: () => void;
  toggleExtendMode: () => void;
  extendTransition: boolean;
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
  const { categories } = useCompositionContext();

  const [displayedCategoryId, setDisplayedCategoryId] = useState(
    categories[0].id
  );

  const displayedItems: Item[] = useMemo(() => {
    if (flatten) {
      return categories.flatMap(({ items }) => items);
    }

    const displayedCategory = categories.find(
      ({ id }) => id === displayedCategoryId
    );
    if (!displayedCategory) {
      throw new Error(`Element ${displayedCategory} not found`);
    }

    return displayedCategory.items;
  }, [flatten, categories, displayedCategoryId]);

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
  const masterItemIndex = itemIndexCommand ?? carrouselItemIndex;
  const [isCycling, setIsCycling] = useState(false); // Used to handle cycling (prev/next) when reaching the end of the list
  const finishCycling = useCallback(() => setIsCycling(false), []);

  const prevImage = useCallback(() => {
    if (isCycling) {
      return;
    }

    const target = carrouselItemIndex - 1;
    // Check if we need to cycle
    if (target < 0) {
      setIsCycling(true);
      setItemIndexCommand(displayedItems.length - 1);
    } else {
      setItemIndexCommand(target);
    }
  }, [carrouselItemIndex, displayedItems.length, isCycling]);

  const nextImage = useCallback(() => {
    if (isCycling) {
      return;
    }

    const target = carrouselItemIndex + 1;
    // Check if we need to cycle
    if (target > displayedItems.length - 1) {
      setIsCycling(true);
      setItemIndexCommand(0);
    } else {
      setItemIndexCommand(target);
    }
  }, [carrouselItemIndex, displayedItems.length, isCycling]);

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

  const showGalleryControls = useMemo(() => {
    switch (currentCarrouselItem.type) {
      case "image":
      case "360":
      case "omni_directional":
        return true;
      case "video":
        return currentItemInteraction !== "running";
    }
  }, [currentCarrouselItem, currentItemInteraction]);

  const [showHotspots, setShowHotspots] = useState(true);
  const enableHotspotsControl = useMemo(() => {
    switch (currentCarrouselItem.type) {
      case "image":
        return !!currentCarrouselItem.hotspots?.length;
      case "360":
        return currentItemInteraction === "running";
      case "video":
      case "omni_directional":
        return false;
    }
  }, [currentCarrouselItem, currentItemInteraction]);

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

  const toggleGallery = useCallback(() => {
    const newValue = !showGallery;

    setShowGallery(newValue);
    emitEvent(`gallery-${newValue ? "on" : "off"}`);
  }, [emitEvent, showGallery]);

  const [shownDetails, setShownDetails] = useState<Details | null>(null);
  const resetShownDetails = useCallback(() => setShownDetails(null), []);
  const isShowingDetails = !!shownDetails;

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

  // -- Side effects
  const freezeCarrousel = useMemo(() => {
    if (shownDetails || isZooming) {
      return true;
    }
    switch (currentCarrouselItem.type) {
      case "video":
        return currentItemInteraction === "running";
    }

    return false;
  }, [
    shownDetails,
    isZooming,
    currentCarrouselItem.type,
    currentItemInteraction,
  ]);

  const resetView = useCallback(() => {
    resetZoom();
    resetShownDetails();
  }, [resetZoom, resetShownDetails]);

  // -- Extend mode

  const [extendMode, setExtendMode] = useState(false);
  const [extendTransitionTimeout, setExtendTransitionTimeout] =
    useState<NodeJS.Timeout>();

  const changeExtendMode = useCallback(
    async (newValue: boolean) => {
      resetView();
      setExtendMode(newValue);
      emitEvent(`extend-mode-${newValue ? "on" : "off"}`);
    },
    [emitEvent, resetView]
  );

  // Hack to refresh scroll position when switching from toggling full-screen
  const triggerExtendTransition = useCallback(() => {
    clearTimeout(extendTransitionTimeout);
    const timeout = setTimeout(() => {
      setExtendTransitionTimeout(undefined);
    }, 500);

    setExtendTransitionTimeout(timeout);
  }, [extendTransitionTimeout]);

  const enableExtendMode = useCallback(async () => {
    triggerExtendTransition();

    if (allowFullScreen) {
      await requestFullscreen();
    } else {
      changeExtendMode(true);
    }
  }, [
    allowFullScreen,
    changeExtendMode,
    requestFullscreen,
    triggerExtendTransition,
  ]);

  const disableExtendMode = useCallback(async () => {
    triggerExtendTransition();

    if (allowFullScreen) {
      await exitFullscreen();
    } else {
      changeExtendMode(false);
    }
  }, [
    allowFullScreen,
    changeExtendMode,
    exitFullscreen,
    triggerExtendTransition,
  ]);

  const toggleExtendMode = useCallback(() => {
    if (extendMode) {
      disableExtendMode();
    } else {
      enableExtendMode();
    }
  }, [disableExtendMode, enableExtendMode, extendMode]);

  // Listen to fullscreen changes (mandatory to get the full screen close with Echap)
  useEffect(() => {
    if (!allowFullScreen) {
      return;
    }

    // Already handled
    if (isFullScreen === extendMode) {
      return;
    }

    triggerExtendTransition();

    changeExtendMode(isFullScreen);
  }, [
    allowFullScreen,
    changeExtendMode,
    extendMode,
    isFullScreen,
    triggerExtendTransition,
  ]);

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
        masterItemIndex,
        isCycling,
        finishCycling,
        prevImage,
        nextImage,

        showGalleryControls,

        enableHotspotsControl,
        showHotspots,
        toggleHotspots,

        showGallery,
        toggleGallery,

        shownDetails,
        isShowingDetails,
        setShownDetails,
        resetShownDetails,

        showZoomControls,
        zoom,
        isZooming,
        setZoom,
        resetZoom,
        canZoomIn,
        zoomIn,
        canZoomOut,
        zoomOut,

        freezeCarrousel,
        resetView,

        extendMode,
        enableExtendMode,
        disableExtendMode,
        toggleExtendMode,
        extendTransition: !!extendTransitionTimeout,
      }}
    >
      {children}
    </ControlsContext.Provider>
  );
};

export default ControlsContextProvider;
