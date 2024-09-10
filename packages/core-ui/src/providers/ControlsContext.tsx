import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  EVENT_EXTEND_MODE_OFF,
  EVENT_EXTEND_MODE_ON,
  EVENT_GALLERY_CLOSE,
  EVENT_GALLERY_OPEN,
  EVENT_HOTSPOTS_OFF,
  EVENT_HOTSPOTS_ON,
} from "@car-cutter/core";

import { RESIZE_TRANSITION_DURATION } from "../const/browser";
import { MAX_ZOOM, ZOOM_STEP } from "../const/zoom";
import { clamp } from "../utils/math";

import { useCompositionContext } from "./CompositionContext";
import { useGlobalContext } from "./GlobalContext";

type ItemInteraction = null | "ready" | "running";

type SpecialCommand = "instant" | "first_to_last" | "last_to_first";

type Details = { src: string; title?: string; text?: string };

type ContextType = {
  setItemInteraction: (index: number, value: ItemInteraction) => void;
  slidable: boolean;

  carrouselItemIndex: number;
  setCarrouselItemIndex: (index: number) => void;
  itemIndexCommand: number | null;
  setItemIndexCommand: (index: number | null) => void;
  masterItemIndex: number;
  specialCommand: SpecialCommand | null;
  isRunningSpecialCommand: boolean;
  finishSpecialCommand: () => void;
  prevItem: () => void;
  nextItem: () => void;
  scrollToItemIndex: (index: number) => void;

  displayedCategoryId: string;
  changeCategory: (categoryId: string) => void;

  enableHotspotsControl: boolean;
  showHotspots: boolean;
  toggleHotspots: () => void;

  showGalleryControls: boolean;
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
    infiniteCarrousel,
    preventFullScreen,

    emitEvent,
    isFullScreen,
    requestFullscreen,
    exitFullscreen,
  } = useGlobalContext();
  const { categories, items } = useCompositionContext();

  const [itemInteractionList, setItemInteractionList] = useState<
    ItemInteraction[]
  >(items.map(() => null));

  const setItemInteraction = useCallback(
    (index: number, value: ItemInteraction) => {
      setItemInteractionList(prev =>
        prev.map((prevValue, i) => (i === index ? value : prevValue))
      );
    },
    []
  );

  const [carrouselItemIndex, setCarrouselItemIndex] = useState(0);
  const [itemIndexCommand, setItemIndexCommand] = useState<number | null>(null);
  const masterItemIndex = itemIndexCommand ?? carrouselItemIndex;
  const currentItem = items[masterItemIndex];
  const currentItemInteraction = itemInteractionList[masterItemIndex];

  const [specialCommand, setSpecialCommand] = useState<SpecialCommand | null>(
    null
  );
  const isRunningSpecialCommand = !!specialCommand;
  const finishSpecialCommand = useCallback(() => setSpecialCommand(null), []);

  const prevItem = useCallback(() => {
    // Command still running
    if (isRunningSpecialCommand || itemIndexCommand !== null) {
      return;
    }

    const target = carrouselItemIndex - 1;
    // Check if we not need to cycle
    if (target >= 0) {
      setItemIndexCommand(target);
    } else if (infiniteCarrousel) {
      setSpecialCommand("first_to_last");
      setItemIndexCommand(items.length - 1);
    }
  }, [
    isRunningSpecialCommand,
    itemIndexCommand,
    carrouselItemIndex,
    infiniteCarrousel,
    items.length,
  ]);

  const nextItem = useCallback(() => {
    // Command still running
    if (isRunningSpecialCommand || itemIndexCommand !== null) {
      return;
    }

    const target = carrouselItemIndex + 1;
    // Check if we not need to cycle
    if (target < items.length) {
      setItemIndexCommand(target);
    } else if (infiniteCarrousel) {
      setSpecialCommand("last_to_first");
      setItemIndexCommand(0);
    }
  }, [
    isRunningSpecialCommand,
    itemIndexCommand,
    carrouselItemIndex,
    items.length,
    infiniteCarrousel,
  ]);

  const scrollToItemIndex = useCallback(
    (index: number) => {
      // Check if everything is ready between carrousel and command
      const min = Math.min(carrouselItemIndex, index);
      const max = Math.max(carrouselItemIndex, index);

      // We allow 2 not ready items
      const shouldBeInstant =
        itemInteractionList.slice(min, max + 1).filter(value => value === null)
          .length > 2;

      if (shouldBeInstant) {
        setSpecialCommand("instant");
      }

      setItemIndexCommand(index);
    },
    [carrouselItemIndex, itemInteractionList]
  );

  // -- Categories
  const displayedCategoryId = useMemo(() => {
    for (const category of categories) {
      if (category.items.includes(currentItem)) {
        return category.id;
      }
    }

    throw new Error("Current item not found in any category");
  }, [categories, currentItem]);

  const changeCategory = useCallback(
    (categoryId: string) => {
      const target = categories.find(({ id }) => id === categoryId)?.items[0];

      if (target === undefined) {
        throw new Error("Failed to find target category");
      }

      const targetIndex = items.findIndex(item => item === target);

      scrollToItemIndex(targetIndex);
    },
    [categories, items, scrollToItemIndex]
  );

  // -- Hotspots
  const enableHotspotsControl = useMemo(() => {
    switch (currentItem.type) {
      case "image":
        return !!currentItem.hotspots?.length;
      case "360":
        return currentItemInteraction === "running";
      case "video":
        return false;
    }
  }, [currentItem, currentItemInteraction]);

  const [showHotspots, setShowHotspots] = useState(true);
  const toggleHotspots = useCallback(() => {
    const newValue = !showHotspots;
    setShowHotspots(newValue);
    emitEvent(newValue ? EVENT_HOTSPOTS_ON : EVENT_HOTSPOTS_OFF);
  }, [emitEvent, showHotspots]);

  // -- Gallery
  const showGalleryControls = useMemo(() => {
    switch (currentItem.type) {
      case "image":
      case "360":
        return true;
      case "video":
        return currentItemInteraction !== "running";
    }
  }, [currentItem, currentItemInteraction]);

  const [showGallery, setShowGallery] = useState(false);
  const toggleGallery = useCallback(() => {
    const newValue = !showGallery;

    setShowGallery(newValue);
    emitEvent(newValue ? EVENT_GALLERY_OPEN : EVENT_GALLERY_CLOSE);
  }, [emitEvent, showGallery]);

  const [shownDetails, setShownDetails] = useState<Details | null>(null);
  const resetShownDetails = useCallback(() => setShownDetails(null), []);
  const isShowingDetails = !!shownDetails;

  const showZoomControls = useMemo(() => {
    switch (currentItem.type) {
      case "image":
        return true;
      case "360":
        return currentItemInteraction === "running";
      case "video":
        return false;
    }
  }, [currentItem.type, currentItemInteraction]);
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
      emitEvent(newValue ? EVENT_EXTEND_MODE_ON : EVENT_EXTEND_MODE_OFF);
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

    if (!preventFullScreen) {
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
    preventFullScreen,
    changeExtendMode,
    requestFullscreen,
    triggerExtendTransition,
  ]);

  const disableExtendMode = useCallback(async () => {
    triggerExtendTransition();

    if (!preventFullScreen) {
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
    preventFullScreen,
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
    if (preventFullScreen) {
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
    preventFullScreen,
    changeExtendMode,
    extendMode,
    fakeFullScreen,
    isFullScreen,
    triggerExtendTransition,
  ]);

  return (
    <ControlsContext.Provider
      value={{
        setItemInteraction,
        slidable: items.length > 1,

        carrouselItemIndex,
        setCarrouselItemIndex,
        itemIndexCommand,
        setItemIndexCommand,
        masterItemIndex,
        specialCommand,
        isRunningSpecialCommand,
        finishSpecialCommand,
        prevItem,
        nextItem,
        scrollToItemIndex,

        displayedCategoryId,
        changeCategory,

        enableHotspotsControl,
        showHotspots,
        toggleHotspots,

        showGalleryControls,
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
