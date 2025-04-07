import { Pannellum } from "pannellum-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLoadingProgress } from "../../../hooks/useLoadingProgress";
import { useControlsContext } from "../../../providers/ControlsContext";
import { useGlobalContext } from "../../../providers/GlobalContext";
import { CustomizableItem } from "../../../types/customizable_item";
import { cn } from "../../../utils/style";
import InteriorThreeSixtyIcon from "../../icons/InteriorThreeSixtyIcon";
import PlayIcon from "../../icons/PlayIcon";
import ErrorTemplate from "../../template/ErrorTemplate";
import Button from "../../ui/Button";

type InteriorThreeSixtyElementLoadControlsProps = {
  isPannellumLoaded: boolean;
  isLoading: boolean;
  progress: number;
  autoloadInterior360: boolean;
  loadScene: () => void;
};

const InteriorThreeSixtyElementLoadControls: React.FC<
  InteriorThreeSixtyElementLoadControlsProps
> = ({
  isPannellumLoaded,
  isLoading,
  progress,
  autoloadInterior360,
  loadScene,
}) => {
  if (isPannellumLoaded) {
    return null;
  }

  if (autoloadInterior360) {
    loadScene();
  }

  return (
    <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-y-4">
      <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-y-4 bg-foreground/35">
        <InteriorThreeSixtyIcon className="size-20 text-primary-light" />

        <Button color="neutral" shape="icon" onClick={loadScene}>
          <PlayIcon className="size-full" />
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
  onLoaded: () => void;
  onError: () => void;
};

const InteriorThreeSixtyElementInteractive: React.FC<
  InteriorThreeSixtyElementProps
> = props => {
  const { itemIndex, src, poster, onLoaded, onError } = props;
  const { autoLoadInterior360 } = useGlobalContext();
  const { isShowingDetails, setItemInteraction } = useControlsContext();
  const [progress, isLoading] = useLoadingProgress(src);
  const pannellumRef = useRef<Pannellum>(null);

  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);

  const onLoad = useCallback(() => {
    if (itemIndex !== undefined) {
      setItemInteraction(itemIndex, "ready");
    }

    onLoaded?.();
    setIsPannellumLoaded(true);
  }, [itemIndex, setItemInteraction, onLoaded]);

  const onMouse = useCallback((e: Event) => {
    // Ignore event if the user is not using the main button
    if (e instanceof MouseEvent && e.button !== 0) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, []);

  const loadScene = useCallback(() => {
    // Load the scene
    const viewer = pannellumRef.current?.getViewer();
    if (viewer) {
      viewer.loadScene();
    }
  }, []);

  return (
    <>
      <div className={cn("relative size-full overflow-hidden bg-transparent")}>
        <div
          // Scale effect on show details
          className={cn(
            "size-full duration-details",
            isShowingDetails ? "scale-105" : "scale-100"
          )}
        >
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
          `}
          </style>
          <div className="relative size-full">
            <Pannellum
              ref={pannellumRef}
              id="pannellum"
              panorama={src}
              preview={poster}
              width="100%"
              height="100%"
              image={src}
              pitch={0}
              yaw={0}
              hfov={100}
              maxHfov={100}
              compass={false}
              showControls={false}
              onLoad={onLoad}
              onError={onError}
              onMousedown={onMouse}
              onTouchstart={onMouse}
              onTouchend={onMouse}
              onMouseup={onMouse}
              autoLoad={false}
            />
            <InteriorThreeSixtyElementLoadControls
              isPannellumLoaded={isPannellumLoaded}
              isLoading={isLoading}
              progress={progress}
              autoloadInterior360={autoLoadInterior360}
              loadScene={loadScene}
            />
          </div>
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
