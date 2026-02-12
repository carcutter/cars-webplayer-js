import Pannellum, {
  Pannellum as PannellumType,
} from "pannellum-react/es/elements/Pannellum";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { HFOV, MAX_HFOV, MIN_HFOV, PITCH, YAW } from "../../../const/pannellum";
import { MAX_ZOOM, ZOOM_STEP } from "../../../const/zoom";
import { useLoadingProgress } from "../../../hooks/useLoadingProgress";
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
  const { isShowingDetails, setItemInteraction, zoom, isZooming, setZoom } =
    useControlsContext();
  const [progress, isLoading] = useLoadingProgress(src);
  const pannellumRef = useRef<PannellumType>(null);
  const pannellumId = useId();

  const pannellumContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerReady, setContainerReady] = useState(false);
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    pannellumContainerRef.current = node;
    setContainerReady(!!node);
  }, []);

  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);

  const onLoad = useCallback(() => {
    if (itemIndex !== undefined) {
      setItemInteraction(itemIndex, "ready");
    }

    onLoaded?.();
    setIsPannellumLoaded(true);
  }, [itemIndex, setItemInteraction, onLoaded]);

  const onMouse = useCallback((e: Event) => {
    if (e instanceof MouseEvent && e.button !== 0) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, []);

  const loadScene = useCallback(() => {
    const viewer = pannellumRef.current?.getViewer();
    if (viewer) {
      viewer.loadScene();
    }
  }, []);

  useEffect(() => {
    if (
      pannellumRef.current &&
      isPannellumLoaded &&
      pannellumContainerRef.current
    ) {
      const viewer = pannellumRef.current.getViewer();
      const container = pannellumContainerRef.current;

      if (viewer) {
        const handleWheel = (event: WheelEvent) => {
          event.preventDefault();
          const zoom = convertPannellumHfovToBidirectionalSteppedScale(
            viewer.getHfov(),
            MIN_HFOV,
            MAX_HFOV,
            MAX_ZOOM,
            ZOOM_STEP
          );
          const direction = event.deltaY < 0 ? "zoom-in" : "zoom-out";
          const newZoom =
            direction === "zoom-in"
              ? Math.min(zoom + ZOOM_STEP, MAX_ZOOM)
              : Math.max(zoom - ZOOM_STEP, 1);
          setZoom(newZoom);
        };

        const handleWheelDebounced = createThrottleDebounce(
          handleWheel,
          100,
          150
        );

        const handleDblClick = (event: MouseEvent) => {
          event.preventDefault();
          const zoom = convertPannellumHfovToBidirectionalSteppedScale(
            viewer.getHfov(),
            MIN_HFOV,
            MAX_HFOV,
            MAX_ZOOM,
            ZOOM_STEP,
            true
          );
          setZoom(zoom);
        };

        container.addEventListener("wheel", handleWheelDebounced);
        container.addEventListener("dblclick", handleDblClick);

        const zoomFactor = Math.abs(1 - Math.abs(zoom));
        const maxHfovReduction = MAX_HFOV - MIN_HFOV;
        const newHfov = HFOV - zoomFactor * maxHfovReduction;
        viewer.setHfov(newHfov);

        return () => {
          container.removeEventListener("wheel", handleWheel);
          container.removeEventListener("dblclick", handleDblClick);
        };
      }
    }
  }, [zoom, isPannellumLoaded, isZooming, setZoom]);

  return (
    <>
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
          <div ref={setContainerRef} className="size-full">
            <style>
              {`
                .pnlm-load-button {
                  display: none !important;
                }
                .pnlm-load-box {
                  display: none !important;
                }
                .pnlm-container {
                  background-image: none !important;
                }
                .pnlm-about-msg {
                  width: 0;
                  height: 0;
                  padding: 0;
                  visibility: hidden;
                }

                .pnlm-about-msg a {
                  display: none;
                  visibility: hidden;
                }
              `}
            </style>
            {containerReady && (
              <Pannellum
                ref={pannellumRef}
                id={pannellumId}
                panorama={src}
                preview={poster}
                width="100%"
                height="100%"
                image={src}
                pitch={PITCH}
                yaw={YAW}
                hfov={HFOV}
                maxHfov={MAX_HFOV}
                minHfov={MIN_HFOV}
                compass={false}
                showControls={false}
                keyboardZoom={false}
                onLoad={onLoad}
                onError={onError}
                onMousedown={onMouse}
                onTouchstart={onMouse}
                onTouchend={onMouse}
                onMouseup={onMouse}
                autoLoad={false}
              />
            )}
          </div>
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
    </>
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
        onLoaded={() => setStatus("spin")}
        onError={() => setStatus("error")}
      />
    );
  }
};

export default InteriorThreeSixtyElement;
