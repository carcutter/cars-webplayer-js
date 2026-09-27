import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MAX_HFOV, MIN_HFOV } from "../../../const/pannellum";
import { MAX_ZOOM, ZOOM_STEP } from "../../../const/zoom";
import { useLoadingProgress } from "../../../hooks/useLoadingProgress";
import { usePannellumViewer } from "../../../hooks/usePannellumViewer";
import { useControlsContext } from "../../../providers/ControlsContext";
import { useGlobalContext } from "../../../providers/GlobalContext";
import { cursorCssValue, getThemeConfig } from "../../../theme-config";
import { CustomizableItem } from "../../../types/customizable_item";
import { createThrottleDebounce } from "../../../utils/debounce";
import {
  clamp,
  convertPannellumHfovToBidirectionalSteppedScale,
} from "../../../utils/math";
import { cn } from "../../../utils/style";
import Interior360PlayIcon from "../../icons/Interior360PlayIcon";
import InteriorThreeSixtyIcon from "../../icons/InteriorThreeSixtyIcon";
import ErrorTemplate from "../../template/ErrorTemplate";
import Button from "../../ui/Button";

/** Horizontal drag distance before the cursor switches to a directional arrow.
    Keeps a near-vertical drag (pitch only) on the default cursor. */
const DIRECTION_THRESHOLD_PX = 3;

type SpinCursorDirection = "default" | "left" | "right";

type InteriorThreeSixtyElementLoadControlsProps = {
  itemIndex: number;
  isPannellumLoaded: boolean;
  isLoading: boolean;
  progress: number;
  autoloadInterior360: boolean;
  loadScene: () => void;
};

const InteriorThreeSixtyElementLoadControls: React.FC<
  InteriorThreeSixtyElementLoadControlsProps
> = ({
  itemIndex,
  isPannellumLoaded,
  isLoading,
  progress,
  autoloadInterior360,
  loadScene,
}) => {
  const { emitAnalyticsEvent, themeConfig } = useGlobalContext();
  const { displayedCategoryId, displayedCategoryName } = useControlsContext();
  const theme = useMemo(() => getThemeConfig(themeConfig), [themeConfig]);

  const emitAnalyticsEventInterior360Play = useCallback(
    (type: "click" | "auto") => {
      emitAnalyticsEvent({
        type: "interaction",
        current: {
          category_id: displayedCategoryId,
          category_name: displayedCategoryName,
          item_type: "interior-360",
          item_position: itemIndex,
        },
        action: {
          name: "Interior 360 Play",
          field: "interior_360_play",
          value: type,
        },
      });
    },
    [emitAnalyticsEvent, displayedCategoryId, displayedCategoryName, itemIndex]
  );

  // Click play
  const onClickPLayButton = useCallback(() => {
    loadScene();
    emitAnalyticsEventInterior360Play("click");
  }, [loadScene, emitAnalyticsEventInterior360Play]);

  // Autoplay
  useEffect(() => {
    if (!autoloadInterior360) return;
    loadScene();
    emitAnalyticsEventInterior360Play("auto");
  }, [autoloadInterior360, loadScene, emitAnalyticsEventInterior360Play]);

  if (isPannellumLoaded) {
    return null;
  }

  return (
    <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-y-4">
      <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-y-4 bg-foreground/35">
        <InteriorThreeSixtyIcon
          className="size-20"
          isVisible={theme?.threeSixtyIcon}
        />

        <Button
          aria-label="Play interior 360 view"
          className={
            theme?.playButton
              ? "border-0 bg-transparent p-0 shadow-none hover:bg-transparent"
              : undefined
          }
          style={
            theme?.playButton
              ? { width: 140, height: 140, padding: 0 }
              : undefined
          }
          color="neutral"
          shape="icon"
          onClick={onClickPLayButton}
        >
          {theme?.playButton ? (
            <img className="size-full" src={theme.playButton.default} alt="" />
          ) : (
            <Interior360PlayIcon className="size-full" />
          )}
        </Button>

        <div
          className={cn(
            "relative h-1 w-3/5 overflow-hidden rounded-full bg-background",
            !isLoading && "invisible"
          )}
        >
          <div
            className="h-full bg-primary transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

type InteriorThreeSixtyElementProps = Extract<
  CustomizableItem,
  { type: "interior-360" }
> & {
  itemIndex: number;
  onlyPreload?: boolean;
  onLoaded?: () => void;
  onError?: () => void;
};

const InteriorThreeSixtyElementInteractive: React.FC<
  InteriorThreeSixtyElementProps
> = props => {
  const { itemIndex, src, poster, onLoaded, onError, onlyPreload } = props;
  const { autoLoadInterior360, themeConfig } = useGlobalContext();
  const { isShowingDetails, zoom, setZoom } = useControlsContext();
  const [progress, isLoading] = useLoadingProgress(src);
  const theme = useMemo(() => getThemeConfig(themeConfig), [themeConfig]);
  const themeCursor = theme?.cursor;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
  const [shouldAutoLoad, setShouldAutoLoad] = useState(autoLoadInterior360);

  useEffect(() => {
    if (autoLoadInterior360) {
      setShouldAutoLoad(true);
    }
  }, [autoLoadInterior360]);

  const onLoad = useCallback(() => {
    onLoaded?.();
    setIsPannellumLoaded(true);
  }, [onLoaded]);

  const onMouse = useCallback((e: Event) => {
    if (e instanceof MouseEvent && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, []);

  // - Themed spin cursor: pannellum owns the cursor of its UI layer, so we only
  //   expose the drag direction as a data attribute and let CSS pick the SVG
  //   (see the `[data-cc-spin-cursor]` rules in index.css). Written imperatively
  //   to keep the drag free of React re-renders.
  const dragStartXRef = useRef<number | null>(null);

  const setSpinCursorDirection = useCallback(
    (direction: SpinCursorDirection) => {
      const wrapper = wrapperRef.current;
      if (!wrapper || !wrapper.dataset.ccSpinCursor) return;

      wrapper.dataset.ccSpinCursor = direction;
    },
    []
  );

  // Pannellum stops propagation of the mousedown/mouseup it handles (see
  // `onMouse` above), so we track the drag through its own events rather than
  // adding listeners of our own.
  const onMousedown = useCallback(
    (e: Event) => {
      onMouse(e);
      if (!(e instanceof MouseEvent) || e.button !== 0) return;

      dragStartXRef.current = e.clientX;
      setSpinCursorDirection("default");
    },
    [onMouse, setSpinCursorDirection]
  );

  const onMouseup = useCallback(
    (e: Event) => {
      onMouse(e);
      dragStartXRef.current = null;
      setSpinCursorDirection("default");
    },
    [onMouse, setSpinCursorDirection]
  );

  // Pannellum's own mousemove handler neither fires an event nor stops
  // propagation, so a plain document listener is enough here.
  useEffect(() => {
    if (!themeCursor) return;

    const onMousemove = (e: MouseEvent) => {
      const dragStartX = dragStartXRef.current;
      if (dragStartX === null) return;

      const walkX = e.clientX - dragStartX;
      if (Math.abs(walkX) < DIRECTION_THRESHOLD_PX) return;

      // Reset the reference point so the cursor tracks recent movement
      dragStartXRef.current = e.clientX;
      setSpinCursorDirection(walkX < 0 ? "left" : "right");
    };

    document.addEventListener("mousemove", onMousemove);

    return () => {
      document.removeEventListener("mousemove", onMousemove);
    };
  }, [themeCursor, setSpinCursorDirection]);

  const loadScene = useCallback(() => {
    setShouldAutoLoad(true);
  }, []);

  const viewerRef = usePannellumViewer(
    containerRef,
    { image: src, preview: poster, autoLoad: shouldAutoLoad },
    {
      onLoad,
      onError,
      onMousedown,
      onMouseup,
      onTouchstart: onMouse,
      onTouchend: onMouse,
    }
  );

  // Sync zoom level to pannellum hfov
  useEffect(() => {
    if (onlyPreload) return;

    const viewer = viewerRef.current;
    if (!viewer || !isPannellumLoaded) return;

    const minZoom = 1;
    const normalizedZoom = clamp((zoom - minZoom) / (MAX_ZOOM - minZoom), 0, 1);
    const newHfov = clamp(
      MAX_HFOV - normalizedZoom * (MAX_HFOV - MIN_HFOV),
      MIN_HFOV,
      MAX_HFOV
    );
    viewer.setHfov(newHfov);
  }, [zoom, isPannellumLoaded, viewerRef, onlyPreload]);

  // Set up wheel and double-click zoom handlers (once when panorama loads)
  useEffect(() => {
    if (onlyPreload) return;

    const container = containerRef.current;
    if (!container || !isPannellumLoaded) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const viewer = viewerRef.current;
      if (!viewer) return;

      const currentZoom = convertPannellumHfovToBidirectionalSteppedScale(
        viewer.getHfov(),
        MIN_HFOV,
        MAX_HFOV,
        MAX_ZOOM,
        ZOOM_STEP
      );
      const direction = event.deltaY < 0 ? "zoom-in" : "zoom-out";
      const newZoom =
        direction === "zoom-in"
          ? Math.min(currentZoom + ZOOM_STEP, MAX_ZOOM)
          : Math.max(currentZoom - ZOOM_STEP, 1);
      setZoom(newZoom);
    };

    const handleWheelThrottled = createThrottleDebounce(handleWheel, 100, 150);

    const handleDblClick = (event: MouseEvent) => {
      event.preventDefault();
      const viewer = viewerRef.current;
      if (!viewer) return;

      const toggleZoom = convertPannellumHfovToBidirectionalSteppedScale(
        viewer.getHfov(),
        MIN_HFOV,
        MAX_HFOV,
        MAX_ZOOM,
        ZOOM_STEP,
        true
      );
      setZoom(toggleZoom);
    };

    container.addEventListener("wheel", handleWheelThrottled);
    container.addEventListener("dblclick", handleDblClick);

    return () => {
      container.removeEventListener("wheel", handleWheelThrottled);
      container.removeEventListener("dblclick", handleDblClick);
    };
  }, [isPannellumLoaded, setZoom, viewerRef, onlyPreload]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden bg-transparent"
      )}
      // The attribute gates the themed cursor override and carries the drag
      // direction; the variables hold the theme's cursor SVGs.
      data-cc-spin-cursor={themeCursor ? "default" : undefined}
      style={
        themeCursor
          ? ({
              "--cc-spin-cursor-default": cursorCssValue(themeCursor.default),
              "--cc-spin-cursor-left": cursorCssValue(themeCursor.leftSpin),
              "--cc-spin-cursor-right": cursorCssValue(themeCursor.rightSpin),
            } as React.CSSProperties)
          : undefined
      }
    >
      <div
        className={cn(
          "size-full",
          isShowingDetails ? "scale-105" : "scale-100"
        )}
      >
        <div ref={containerRef} className="size-full" />
        <InteriorThreeSixtyElementLoadControls
          isPannellumLoaded={isPannellumLoaded}
          isLoading={isLoading}
          progress={progress}
          autoloadInterior360={autoLoadInterior360}
          loadScene={loadScene}
          itemIndex={itemIndex}
        />
      </div>
    </div>
  );
};

/**
 * InteriorThreeSixtyElement component renders a carrousel's 360
 *
 * @prop `onlyPreload`: If true, zoom will not affect the 360. It is useful to pre-fetch images.
 * @prop `index`: The index of the item in the carrousel. Used to share state.
 */
const InteriorThreeSixtyElement: React.FC<
  InteriorThreeSixtyElementProps
> = props => {
  const { itemIndex } = props;

  const { setItemInteraction } = useControlsContext();

  const [status, setStatus] = useState<
    null | "placeholder" | "spin" | "error"
  >();
  const handleLoaded = useCallback(() => {
    setStatus("spin");
  }, []);
  const handleError = useCallback(() => {
    setStatus("error");
  }, []);

  // Update the item interaction state according to the readiness of the 360
  useEffect(() => {
    if (status === null || status === "error") {
      return;
    }

    setItemInteraction(itemIndex, status === "spin" ? "running" : "ready");
  }, [itemIndex, setItemInteraction, status]);

  if (status === "error") {
    return (
      <ErrorTemplate
        className="text-background"
        text="Interior Spin could not be loaded"
      />
    );
  } else {
    return (
      <InteriorThreeSixtyElementInteractive
        {...props}
        onLoaded={handleLoaded}
        onError={handleError}
      />
    );
  }
};

export default InteriorThreeSixtyElement;
