import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "pannellum-react/es/pannellum/css/pannellum.css";
import "pannellum-react/es/pannellum/css/style-textInfo.css";
import "pannellum-react/es/pannellum/js/libpannellum.js";
import "pannellum-react/es/pannellum/js/pannellum.js";
import "pannellum-react/es/pannellum/js/RequestAnimationFrame";

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

type PannellumViewer = {
  loadScene: () => void;
  getHfov: () => number;
  setHfov: (hfov: number) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  destroy: () => void;
};

type PannellumElementHandle = {
  getViewer: () => PannellumViewer | null;
};

type PannellumElementProps = {
  width: string;
  height: string;
  image: string;
  preview?: string;
  pitch: number;
  yaw: number;
  hfov: number;
  maxHfov: number;
  minHfov: number;
  compass: boolean;
  showControls: boolean;
  keyboardZoom: boolean;
  autoLoad: boolean;
  onLoad?: () => void;
  onError?: () => void;
  onMousedown?: (event: Event) => void;
  onTouchstart?: (event: Event) => void;
  onTouchend?: (event: Event) => void;
  onMouseup?: (event: Event) => void;
};

const PannellumElement = forwardRef<
  PannellumElementHandle,
  PannellumElementProps
>((props, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const callbacksRef = useRef<{
    onLoad?: () => void;
    onError?: () => void;
    onMousedown?: (event: Event) => void;
    onTouchstart?: (event: Event) => void;
    onTouchend?: (event: Event) => void;
    onMouseup?: (event: Event) => void;
  }>({});

  useImperativeHandle(
    ref,
    () => ({
      getViewer: () => viewerRef.current,
    }),
    []
  );

  useEffect(() => {
    callbacksRef.current = {
      onLoad: props.onLoad,
      onError: props.onError,
      onMousedown: props.onMousedown,
      onTouchstart: props.onTouchstart,
      onTouchend: props.onTouchend,
      onMouseup: props.onMouseup,
    };
  }, [
    props.onLoad,
    props.onError,
    props.onMousedown,
    props.onTouchstart,
    props.onTouchend,
    props.onMouseup,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const pannellumGlobal = (
      window as Window & {
        pannellum?: {
          viewer: (
            node: HTMLElement,
            config: Record<string, unknown>
          ) => PannellumViewer;
        };
      }
    ).pannellum;

    if (!pannellumGlobal) {
      return;
    }

    const viewer = pannellumGlobal.viewer(container, {
      type: "equirectangular",
      panorama: props.image,
      preview: props.preview,
      image: props.image,
      pitch: props.pitch,
      yaw: props.yaw,
      hfov: props.hfov,
      maxHfov: props.maxHfov,
      minHfov: props.minHfov,
      compass: props.compass,
      showControls: props.showControls,
      keyboardZoom: props.keyboardZoom,
      autoLoad: props.autoLoad,
    });

    viewerRef.current = viewer;

    viewer.on("load", () => callbacksRef.current.onLoad?.());
    viewer.on("error", () => callbacksRef.current.onError?.());
    viewer.on("mousedown", (...args: unknown[]) =>
      callbacksRef.current.onMousedown?.(args[0] as Event)
    );
    viewer.on("mouseup", (...args: unknown[]) =>
      callbacksRef.current.onMouseup?.(args[0] as Event)
    );
    viewer.on("touchstart", (...args: unknown[]) =>
      callbacksRef.current.onTouchstart?.(args[0] as Event)
    );
    viewer.on("touchend", (...args: unknown[]) =>
      callbacksRef.current.onTouchend?.(args[0] as Event)
    );

    return () => {
      viewerRef.current = null;
      viewer.destroy();
    };
  }, [
    props.image,
    props.preview,
    props.pitch,
    props.yaw,
    props.hfov,
    props.maxHfov,
    props.minHfov,
    props.compass,
    props.showControls,
    props.keyboardZoom,
    props.autoLoad,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        width: props.width,
        height: props.height,
      }}
    />
  );
});

PannellumElement.displayName = "PannellumElement";

const InteriorThreeSixtyElementInteractive: React.FC<
  InteriorThreeSixtyElementProps
> = props => {
  const { itemIndex, src, poster, onLoaded, onError } = props;
  const { autoLoadInterior360 } = useGlobalContext();
  const { isShowingDetails, setItemInteraction, zoom, isZooming, setZoom } =
    useControlsContext();
  const [progress, isLoading] = useLoadingProgress(src);
  const pannellumRef = useRef<PannellumElementHandle>(null);

  const pannellumContainerRef = useRef<HTMLDivElement | null>(null);
  const [containerReady, setContainerReady] = useState(false);
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    pannellumContainerRef.current = node;
    setContainerReady(!!node);
  }, []);

  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
  const [shouldAutoLoad, setShouldAutoLoad] = useState(autoLoadInterior360);

  useEffect(() => {
    if (autoLoadInterior360) {
      setShouldAutoLoad(true);
    }
  }, [autoLoadInterior360]);

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
    setShouldAutoLoad(true);
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
              <PannellumElement
                ref={pannellumRef}
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
                autoLoad={shouldAutoLoad}
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
