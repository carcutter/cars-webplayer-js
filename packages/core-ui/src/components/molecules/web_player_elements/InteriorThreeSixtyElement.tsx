import { useCallback, useEffect, useRef, useState } from "react";

import { HFOV, MAX_HFOV, MIN_HFOV } from "../../../const/pannellum";
import { MAX_ZOOM, ZOOM_STEP } from "../../../const/zoom";
import { useLoadingProgress } from "../../../hooks/useLoadingProgress";
import { usePannellumViewer } from "../../../hooks/usePannellumViewer";
import { useControlsContext } from "../../../providers/ControlsContext";
import { useGlobalContext } from "../../../providers/GlobalContext";
import { CustomizableItem } from "../../../types/customizable_item";
import { createThrottleDebounce } from "../../../utils/debounce";
import { convertPannellumHfovToBidirectionalSteppedScale } from "../../../utils/math";
import { cn } from "../../../utils/style";
import Interior360PlayIcon from "../../icons/Interior360PlayIcon";
import InteriorThreeSixtyIcon from "../../icons/InteriorThreeSixtyIcon";
import ErrorTemplate from "../../template/ErrorTemplate";
import Button from "../../ui/Button";

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
  const { emitAnalyticsEvent } = useGlobalContext();
  const { displayedCategoryId, displayedCategoryName } = useControlsContext();

  const emitAnalyticsEventInterior360Play = useCallback(
    (type: "click" | "auto") => {
      emitAnalyticsEvent({
        type: "track",
        category_id: displayedCategoryId,
        category_name: displayedCategoryName,
        item_type: "interior-360",
        item_position: itemIndex,
        action_properties: {
          action_name: "Interior 360 Play",
          action_field: "interior_360_play",
          action_value: type,
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
        <InteriorThreeSixtyIcon className="size-20" />

        <Button color="neutral" shape="icon" onClick={onClickPLayButton}>
          <Interior360PlayIcon className="size-full" />
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
  const { itemIndex, src, poster, onLoaded, onError } = props;
  const { autoLoadInterior360 } = useGlobalContext();
  const { isShowingDetails, zoom, setZoom } = useControlsContext();
  const [progress, isLoading] = useLoadingProgress(src);

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

  const loadScene = useCallback(() => {
    setShouldAutoLoad(true);
  }, []);

  const viewerRef = usePannellumViewer(
    containerRef,
    { image: src, preview: poster, autoLoad: shouldAutoLoad },
    {
      onLoad,
      onError,
      onMousedown: onMouse,
      onMouseup: onMouse,
      onTouchstart: onMouse,
      onTouchend: onMouse,
    }
  );

  // Sync zoom level to pannellum hfov
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !isPannellumLoaded) return;

    const zoomFactor = Math.abs(1 - Math.abs(zoom));
    const maxHfovReduction = MAX_HFOV - MIN_HFOV;
    const newHfov = HFOV - zoomFactor * maxHfovReduction;
    viewer.setHfov(newHfov);
  }, [zoom, isPannellumLoaded, viewerRef]);

  // Set up wheel and double-click zoom handlers (once when panorama loads)
  useEffect(() => {
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
  }, [isPannellumLoaded, setZoom, viewerRef]);

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden bg-transparent"
      )}
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
