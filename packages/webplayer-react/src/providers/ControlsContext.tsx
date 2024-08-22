import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Item } from "@car-cutter/core-webplayer";

import { RESIZE_TRANSITION_DURATION } from "../const/browser";
import { MAX_ZOOM, ZOOM_STEP } from "../const/zoom";
import { clamp } from "../utils/math";

import { useCompositionContext } from "./CompositionContext";
import { useGlobalContext } from "./GlobalContext";

// TODO: Rework items interaction logic
type ItemInteraction = null | "running" | number; // Index of the image in the carrousel
type Details = { src: string; title?: string; text?: string };

type ContextType = {
  displayedCategoryId: string;
  changeCategory: (categoryId: string) => void;

  displayedItems: Item[];
  getItemInteraction: (index: number) => ItemInteraction;
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

  resetView: () => void;

  extendMode: boolean;
  enableExtendMode: () => void;
  disableExtendMode: () => void;
  toggleExtendMode: () => void;
  extendTransition: boolean;
  fakeFullScreen: boolean;
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
  const getItemInteraction = useCallback(
    (index: number) => itemInteractionList[index],
    [itemInteractionList]
  );
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
    // Command still running
    if (isCycling || itemIndexCommand !== null) {
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
  }, [carrouselItemIndex, displayedItems.length, isCycling, itemIndexCommand]);

  const nextImage = useCallback(() => {
    // Command still running
    if (isCycling || itemIndexCommand !== null) {
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
  }, [carrouselItemIndex, displayedItems.length, isCycling, itemIndexCommand]);

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
        return currentItemInteraction !== null;
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
      case "360":
        return currentItemInteraction !== null;
      case "video":
      case "omni_directional":
        return false;
    }
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

  const resetView = useCallback(() => {
    resetZoom();
    resetShownDetails();
  }, [resetZoom, resetShownDetails]);

  // -- Extend mode

  const [extendMode, setExtendMode] = useState(false);
  const [extendTransitionTimeout, setExtendTransitionTimeout] =
    useState<NodeJS.Timeout>();
  const [fakeFullScreen, setFakeFullScreen] = useState(false);

  const changeExtendMode = useCallback(
    async (newValue: boolean) => {
      resetView();
      setExtendMode(newValue);
      emitEvent(`extend-mode-${newValue ? "on" : "off"}`);
    },
    [emitEvent, resetView]
  );

  // The extend transition allows to freeze the UI while resizing to avoid layer shifts & flickering
  const triggerExtendTransition = useCallback(() => {
    clearTimeout(extendTransitionTimeout);
    const timeout = setTimeout(() => {
      setExtendTransitionTimeout(undefined);
    }, RESIZE_TRANSITION_DURATION);

    setExtendTransitionTimeout(timeout);
  }, [extendTransitionTimeout]);

  const enableExtendMode = useCallback(async () => {
    triggerExtendTransition();

    if (allowFullScreen) {
      const requestSucceed = await requestFullscreen();

      setFakeFullScreen(!requestSucceed);

      if (requestSucceed) {
        return;
      }
    }

    // We reach this point:
    // - If user disabled fullscreen through props
    // - if fullscreen request failed (mainly Safari iOS)
    changeExtendMode(true);
  }, [
    allowFullScreen,
    changeExtendMode,
    requestFullscreen,
    triggerExtendTransition,
  ]);

  const disableExtendMode = useCallback(async () => {
    triggerExtendTransition();

    if (allowFullScreen) {
      setFakeFullScreen(false);

      const exitSucceed = await exitFullscreen();

      if (exitSucceed) {
        return;
      }
    }

    // We reach this point:
    // - If user disabled fullscreen through props
    // - If fullscreen exit request failed (mainly Safari iOS)
    changeExtendMode(false);
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

    // In case of Safari iOS, we cannot rely on the fullscreenchange event
    if (fakeFullScreen && extendMode) {
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
    fakeFullScreen,
    isFullScreen,
    triggerExtendTransition,
  ]);

  return (
    <ControlsContext.Provider
      value={{
        displayedCategoryId,
        changeCategory,

        displayedItems,
        getItemInteraction,
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

        resetView,

        extendMode,
        enableExtendMode,
        disableExtendMode,
        toggleExtendMode,
        extendTransition: !!extendTransitionTimeout,
        fakeFullScreen,
      }}
    >
      {children}
    </ControlsContext.Provider>
  );
};

export default ControlsContextProvider;
